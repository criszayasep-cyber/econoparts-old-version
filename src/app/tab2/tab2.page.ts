import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { ProductoService } from '../services/producto.service';
import { ToolsService } from '../services/default/tools.service';
import { FilterEntity } from '../entity/default/filter-entity';
import { PedidoService } from '../services/pedido.service';
import { HtmlModalPage } from '../html-modal/html-modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page  implements OnInit{

  productos = [];
  productosEquivalentes = [];
  total = 0;

  codigo = "";
  segment = "busqueda";
  registros = {
    busqueda: -1,
    equivalentes: -1
  }
  loading = {
    busqueda: false,
    equivalentes: false
  }
  filtros: FilterEntity;

  cargado = window.localStorage['contador']==1?true:false;
  someDefaultImage = 'assets/default-img.jpg';
  categorias: any = [];
  constructor(private route: Router,
    private sanitizer: DomSanitizer,
    private alertController: AlertController, 
    public configuracion: ConfiguracionService,
    private ref: ChangeDetectorRef,
    public productoService: ProductoService,
    private pedidoService: PedidoService,
    public navCtrl: NavController,
    private modalController: ModalController,
    private tools: ToolsService) {}
  
  ngOnInit(){

    /*if(window.localStorage["categorias"]){
      this.cargado = true;
      this.categorias = JSON.parse(window.localStorage["categorias"]);
    }*/
    
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
    
  }

  
  paginar(pag): void{
    if(this.filtros.items!=pag.pageSize){
      this.filtros.pageIndex = 0;
      this.filtros.items = pag.pageSize;
      this.filtros.offset = 0;
    }else{
      this.filtros.pageIndex = pag.pageIndex;
      this.filtros.items = pag.pageSize;
      this.filtros.offset = pag.pageIndex * pag.pageSize;
    }
    this.buscar();
  }


  limpiar(){
    this.total = 0;
    this.registros.busqueda = -1;
    this.productos = [];
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
  }

  async buscar(){
    this.registros.busqueda = -1;
    this.productos = [];
    this.loading.busqueda = true;
    var http = await this.productoService.filter(this.filtros);
    if(http.ok){
      this.productos = http.registros;
      this.registros.busqueda = this.productos.length;
      this.total = http.total;
    }else{
      this.tools.showNotification("Error", http.mensaje,"Ok");
    }
    this.loading.busqueda = false;
  }

  verProducto(item){
    this.modalController.create({
      component: HtmlModalPage,
      cssClass: 'my-modal-class',
      backdropDismiss: false,
      componentProps:{
        producto: item
      }
    }).then(modal => modal.present());
  }

  async agregarProducto(producto){
    this.ref.detectChanges();
    const alert = await this.alertController.create({
      header: 'Agregar al pedido',
      backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },{
          text: 'OK',
          handler: data =>{
            producto.cantidad = data[0];
            this.addProduct(producto, data[0]);
            this.ref.detectChanges();
            return true;
          }
        }],
        inputs: [
          {
            label: 'Cantidad de producto',
            type: 'number',
          }
        ]
      });

      await alert.present();
      this.ref.detectChanges();
  }

  doRefresh(event) {
    
  }

  async addProduct(producto, cantidad){
    let dataPost = {
      producto: producto,
      cantidad: cantidad,
      pedido: ConfiguracionService.gestionDiaria.pedido.ped_id
    }
    var http = await this.pedidoService.addProducto(dataPost);
    if(http){
      if(http.ok){
        this.tools.showNotification("Exito", "Producto agregado exitosamente","Ok");
      }
    }else{
      this.tools.showNotification("Error", http.mensaje,"Ok");
    }
  }

  
  async segmentChanged(event){

  }

  async verEquivalentes(item){
    this.segment = "equivalentes";
    this.codigo = item.pro_number;
    this.buscarEquivalentes();
  }

  

  limpiarEquivalentes(){
    this.registros.equivalentes = -1;
    this.productosEquivalentes = [];
    this.codigo = "";
  }

  async buscarEquivalentes(){
    this.registros.equivalentes = -1;
    this.productosEquivalentes = [];
    this.loading.equivalentes = true;
    let dataPost = {
      busqueda: this.codigo
    }
    var http = await this.productoService.equivalentes(dataPost);
    if(http.ok){
      this.productosEquivalentes = http.registros;
      this.registros.equivalentes = this.productosEquivalentes.length;
    }else{
      this.tools.showNotification("Error", http.mensaje,"Ok");
    }
    this.loading.equivalentes = false;
  }

}