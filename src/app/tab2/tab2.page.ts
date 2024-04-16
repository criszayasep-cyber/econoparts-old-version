import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AlertController, IonContent, ModalController, NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { ProductoService } from '../services/producto.service';
import { ToolsService } from '../services/default/tools.service';
import { FilterEntity } from '../entity/default/filter-entity';
import { PedidoService } from '../services/pedido.service';
import { ProductoDetallePage } from '../pages/producto-detalle/producto-detalle.page';
import { FormControl } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { DbService } from '../services/default/db.service';
import { VentaPerdidaPage } from '../pages/venta-perdida/venta-perdida.page';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { DeviceService } from '../services/default/device.service';
import { VmoPedidoEntityEntity } from '../entity/vmo-pedido-entity';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page  implements OnInit{
  @ViewChild(IonContent) content: IonContent;
  pedido: VmoPedidoEntityEntity;
  bodega = "CENDIST"
  bodegaEq = "CENDIST"

  combos = {
    grupos: [],
    subgrupos: [],
    fabricantes: [],
    familias:[]
  }

  titulo = "| Catálogo";
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

  registrosLim = -1;
  loadingLim = {
    detalle: false
  }

  filtros: FilterEntity;
  verMas = false;

  cargado = window.localStorage['contador']==1?true:false;
  someDefaultImage = 'assets/default-img.jpg';
  categorias: any = [];
  constructor(private router: Router,
    private config: NgSelectConfig,
    private db: DbService,
    private sanitizer: DomSanitizer,
    private alertController: AlertController, 
    public configuracion: ConfiguracionService,
    private ref: ChangeDetectorRef,
    public productoService: ProductoService,
    private pedidoService: PedidoService,
    public navCtrl: NavController,
    private modalController: ModalController,
    private activeRoute: ActivatedRoute,
    private keyboard: Keyboard,
    private pf: DeviceService,
    private tools: ToolsService) {}
  
  ngOnInit(){
    this.config.notFoundText = "No se encuentra";

    /*if(window.localStorage["categorias"]){
      this.cargado = true;
      this.categorias = JSON.parse(window.localStorage["categorias"]);
    }*/
    
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
  }

  async loadCombos(){
    if(this.pf.isBrowser()){
      var http = await this.productoService.combos();
      if(http.ok){
        this.combos.grupos = http.registros.filter(w => w.tipo=="GRUPO");
        this.combos.subgrupos = http.registros.filter(w => w.tipo=="SUB_GRUPO");
        this.combos.fabricantes = http.registros.filter(w => w.tipo=="FABRICANTE");
        this.combos.familias = http.registros.filter(w => w.tipo=="FAMILIA");
      }
    }else{
      this.combos.grupos = await this.db.select("SELECT * FROM venta_movil_combos WHERE tipo='GRUPO'");
      this.combos.subgrupos = await this.db.select("SELECT * FROM venta_movil_combos WHERE tipo='SUB_GRUPO'");
      this.combos.fabricantes = await this.db.select("SELECT * FROM venta_movil_combos WHERE tipo='FABRICANTE'");
      this.combos.familias = await this.db.select("SELECT * FROM venta_movil_combos WHERE tipo='FAMILIA'");
    }
  }

  
  async ionViewWillEnter() {
    this.loadCombos();


    await this.activeRoute.queryParams.subscribe( params => {
      if(params["basico"]!=undefined){
        var cod = params["basico"];
        this.router.navigate([], {queryParams: null});
        this.filtros.numero = cod;
        this.buscar(true);
      }
    });
    
  }

  
  paginar(pag): void{
    this.tools.paginar(this.filtros,pag);
    this.configuracion.setPaginacion(pag.pageSize);
    this.buscar(false);
  }


  limpiar(){
    this.total = 0;
    this.registros.busqueda = -1;
    this.productos = [];
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
  }

  onEnter(){
    this.buscar(true);
  }

  /*async buscar(primera:boolean){
    this.filtros.primera = primera;
    if(primera){
      this.total = 0;
      this.filtros.pageIndex = 0;
      this.filtros.offset = 0;
    }else{
      this.filtros.total = this.total;
    }

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
  }*/

  async buscar(primera:boolean){
    
    setTimeout(async () => 
    {
      this.keyboard.hide()
    },
    500);
    this.keyboard.hide()
    this.loading.busqueda = true;
    
    this.filtros.primera = primera;
    if(primera){
      this.total = 0;
      this.filtros.pageIndex = 0;
      this.filtros.offset = 0;
    }else{
      this.filtros.total = this.total;
    }

    this.registros.busqueda = -1;
    this.productos = [];

    if(this.pf.isBrowser()){
      this.filtros.sucursal = this.bodega;
      var http = await this.productoService.filter(this.filtros);
      if(http.ok){
        this.productos = http.registros;
        this.registros.busqueda = this.productos.length;
        this.total = http.total;
      }else{
        this.tools.showNotification("Error", http.mensaje,"Ok");
      }
    }else{
      var where = ` bodega='${this.bodega}' `;
      if(!this.tools.isNullOrEmpty(this.filtros.grupo)){
        where += ` and pro_categoria_id='${this.filtros.grupo}' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.subGrupo)){
        where += ` and pro_sub_categoria_id='${this.filtros.subGrupo}' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.fabricante)){
        where += ` and pro_fabricante_id='${this.filtros.fabricante}' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.familia)){
        where += ` and pro_familia_id='${this.filtros.familia}' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.numero)){
        where += ` and UPPER(pro_number) LIKE '%${this.filtros.numero.toUpperCase()}%' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.descripcion)){
        where += ` and UPPER(pro_descripcion) LIKE '%${this.filtros.descripcion.toUpperCase()}%' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.marca)){
        where += ` and UPPER(pro_marca) LIKE '%${this.filtros.marca.toUpperCase()}%' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.modelo)){
        where += ` and UPPER(pro_modelo) LIKE '%${this.filtros.modelo.toUpperCase()}%' `
      }
  
      if(!this.tools.isNullOrEmpty(this.filtros.aplicacion)){
        where += ` and UPPER(pro_number) IN (SELECT no FROM venta_movil_aplicaciones WHERE UPPER(aplicacion) LIKE '%${this.filtros.aplicacion.toUpperCase()}%') `
      }
  
      if(where.length>0){
        var query = `SELECT * 
                    FROM venta_movil_productos 
                      LEFT JOIN venta_movil_inventario_precios ON no=pro_number
                    WHERE ${where} 
                    ORDER BY existencia DESC 
                    LIMIT ${this.filtros.offset}, ${this.filtros.items}`;
        //console.log(query)
        var prds = await this.db.select(query);
        
        this.productos = prds;
        this.registros.busqueda = prds.length;
        
        
        const yOffset = document.getElementById("tbResultado");
        if(yOffset){
          //console.log(yOffset.offsetTop)
          this.content.scrollToPoint(0, yOffset.offsetTop,500)
        }
  
        if(this.filtros.primera){
          var count = await this.db.select("SELECT count(*) total FROM venta_movil_productos LEFT JOIN venta_movil_inventario_precios ON no=pro_number WHERE "+where);
          this.total = count[0]["total"];
        }else{
          this.total = this.filtros.total;
        }
  
        if(this.registros.busqueda>0 && this.configuracion.ConfiguracionService.online){
          //Enviamos los codigos para búsqueda
          var cods = "'"+prds.map(a => a.pro_number).join("','")+"'"
          var dataPost = {
            busqueda : cods,
            sucursal: this.bodega
          }
          var http = await this.productoService.FiltrarPrecioExistencia(dataPost);
          if(http.ok){
            var actualizacion = http.registros
            var jsonUpdate = [];
            actualizacion.forEach(element => {
              var index = this.productos.findIndex(obj => obj.pro_number == element.no)
              this.productos[index].preciou = element.preciou;
              this.productos[index].existencia = element.existencia;
              this.productos[index].medida = element.medida;
              //Actualizar la DB
              jsonUpdate.push({
                "set": {
                  "preciou": element.preciou,
                  "existencia": element.existencia,
                  "medida": element.medida
                },
                "where": {
                  "no": element.no,
                  "bodega": element.bodega
                }
              })
            });
            
            if(jsonUpdate.length>0){
              var json = {
                "data":{
                    "updates":{
                        "venta_movil_inventario_precios":jsonUpdate
                    }
                }
              };
              this.db.updateMassive(json);
            }
          }else{
            this.tools.showNotification("Error", http.mensaje,"Ok");
          }
        }
      }
    }
    this.loading.busqueda = false;

  }

  verProducto(item){
    this.modalController.create({
      component: ProductoDetallePage,
      cssClass: 'my-modal-class',
      backdropDismiss: false,
      componentProps:{
        producto: item
      }
    }).then(modal => modal.present());
  }

  ventaPerdida(item){
    this.modalController.create({
      component: VentaPerdidaPage,
      cssClass: 'modal-venta-perdida',
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
            if(producto.existencia>=data[0]){
              producto.cantidad = data[0];
              this.addProduct(producto, data[0]);
              this.ref.detectChanges();
              return true;
            }else{
              this.tools.showNotification("Error", "La cantidad solicitada supera la existencia disponible" ,"Ok");
            }
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
    
    if(this.configuracion.ConfiguracionService.online){
      this.registrosLim = -1;
      this.loadingLim.detalle = true;
      var response = await this.pedidoService.getDetalle(dataPost.pedido);
      if(response.ok){
        this.registrosLim = response.registros.length;
        if (this.registrosLim >= 26) {
          this.tools.showNotification("Error", "Ya alcanzo el limite de 25 lineas para este pedido","Ok");
        }else{
          var http = await this.pedidoService.addProducto(dataPost);
          if(http){
            if(http.ok){
              this.tools.showNotification("Exito", "Producto agregado exitosamente","Ok");
            }else{
              this.tools.showNotification("Error", http.mensaje,"Ok");
            }
          }else{
            this.tools.showNotification("Error", http.mensaje,"Ok");
          }
        }
        
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }

      
    }else{
      var id = new Date().getTime()
      let data = [id,
        ConfiguracionService.gestionDiaria.pedido.ped_id,
        producto.pro_number,
        producto.pro_descripcion,
        cantidad,
        producto.preciou,
        0,
        cantidad * producto.preciou,
        (cantidad * producto.preciou) * 1.13,
        producto.medida,
        producto.bodega,
      ];
      this.db.insert('INSERT INTO venta_movil_pedidos_detalle(pde_id, pde_pedido, pde_producto, pde_descripcion, pde_cantidad, pde_precio_unitario, pde_descuento, pde_monto, pde_monto_iva, pde_unidad_medida, pde_bodega) VALUES (?,?,?,?,?,?,?,?,?,?,?)', data)
      this.modalController.dismiss();
      this.tools.showNotification("Exito", "Producto agregado exitosamente","Ok");
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

  /*async buscarEquivalentes(){
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
  }*/
  async buscarEquivalentes(){
    this.registros.equivalentes = -1;
    this.productosEquivalentes = [];
    this.loading.equivalentes = true;
    
    if(this.pf.isBrowser()){
      let dataPost = {
        busqueda: this.codigo,
        sucursal: this.bodegaEq
      }
      var http = await this.productoService.equivalentes(dataPost);
      if(http.ok){
        this.productosEquivalentes = http.registros;
        this.registros.equivalentes = this.productosEquivalentes.length;
      }else{
        this.tools.showNotification("Error", http.mensaje,"Ok");
      }
      this.loading.equivalentes = false;
    }else{
      var query = `SELECT * FROM venta_movil_productos 
                    INNER JOIN venta_movil_inventario_precios ON no=pro_number
                    WHERE bodega='${this.bodegaEq}' AND pro_number IN (SELECT noSustituto FROM venta_movil_equivalentes WHERE no='${this.codigo}')
                    ORDER BY existencia DESC ` 
      var prds = await this.db.select(query);
      this.productosEquivalentes = prds;
      this.registros.equivalentes = prds.length;
    
      this.loading.equivalentes = false;
  
      if(this.registros.equivalentes>0 && this.configuracion.ConfiguracionService.online){
        //Enviamos los codigos para búsqueda
        var cods = "'"+prds.map(a => a.pro_number).join("','")+"'"
        var dataPost = {
          busqueda : cods,
          sucursal: this.bodegaEq
        }
        var http = await this.productoService.FiltrarPrecioExistencia(dataPost);
        if(http.ok){
          var actualizacion = http.registros
          var jsonUpdate = [];
          actualizacion.forEach(element => {
            var index = this.productosEquivalentes.findIndex(obj => obj.pro_number == element.no)
            this.productosEquivalentes[index].preciou = element.preciou;
            this.productosEquivalentes[index].existencia = element.existencia;
            //Actualizar la DB
            jsonUpdate.push({
              "set": {
                "preciou": element.preciou,
                "existencia": element.existencia
              },
              "where": {
                "no": element.no
              }
            })
          });
          
          if(jsonUpdate.length>0){
            var json = {
              "data":{
                  "updates":{
                      "venta_movil_inventario_precios":jsonUpdate
                  }
              }
            };
            this.db.updateMassive(json);
          }
        }else{
          this.tools.showNotification("Error", http.mensaje,"Ok");
        }
      }
    }
  }


  buscarCombo(term, list) {
      term = term.toLowerCase();
      return list.nombre.toLowerCase().indexOf(term) > -1 || list.id.toLowerCase().indexOf(term) > -1
  }
}