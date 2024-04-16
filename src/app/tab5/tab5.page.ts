import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ToolsService } from '../services/default/tools.service';
import { PromocionesService } from '../services/promociones.service';
import {MatButtonToggleGroup} from '@angular/material/button-toggle';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { PedidoService } from '../services/pedido.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})


export class Tab5Page implements OnInit {

  loading = true;
  search: any[] = new Array();
  displayedColumns: any[]  = new Array();
  dataSource: any[] = new Array();

  segment = "a"
  promociones: any[];
  promocionesCodigos: any[];
  productos: any[];
  listaPrecios: any[] = new Array();
  listaProductos: any[] = new Array();

  promocionesCustom: any[];
  registrosLim = -1;
  loadingLim = {
    detalle: false
  }
  constructor(
    private tools: ToolsService,
    public navCtrl: NavController,
    private alertController: AlertController, 
    public configuracion: ConfiguracionService,
    private pedidoService: PedidoService,
    private promService: PromocionesService) {
      
    }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    //this.loading = true;
    this.loadPromociones();
  }

  doRefresh(event) {
    this.loadPromociones();

    setTimeout(() => {
      event.target.complete();
    }, 3500);
  }

  async loadPromociones(){
    if(this.configuracion.ConfiguracionService.online){
      var httpResponse = await this.promService.activas()
      if(httpResponse.ok){
        this.promocionesCustom = httpResponse.registros["custom"];
        this.productos = httpResponse.registros["listas"];
        this.promociones = [...new Set(httpResponse.registros["listas"].map(item => item.nombre))];
        this.promocionesCodigos = [...new Set(httpResponse.registros["listas"].map(item => item.codigo))];
        if(this.promocionesCustom.length>0){
          this.segment = "0";
        }else{
          this.segment = this.promocionesCodigos[0];
        }
  
        //Agrupar todos los productos por promoción
        this.promocionesCodigos.forEach( c => {
          var prds = this.productosByPromocion(c);
          this.listaPrecios[c] = this.unique(prds, ['minimo', 'lista']);
          this.listaProductos[c] = this.unique(prds, ['codigo', 'descripcion', 'imagen']);
  
          this.displayedColumns[c] = [];
          this.displayedColumns[c].length = this.listaPrecios.length+3;
          this.displayedColumns[c][0] = 'sku';
          this.displayedColumns[c][1] = 'descripcion';
          this.displayedColumns[c][2] = 'imagen';
          
          this.dataSource[c] = this.listaProductos[c];
          var iterador = 3;
          this.listaPrecios[c].forEach(lp => {
            this.displayedColumns[c][iterador] = lp.minimo+"";
            iterador++;
          });
        });  
  
      }else{
        this.tools.showNotification("Error", httpResponse.mensaje,"Ok");
      }
      this.loading = false;
    }else{
      //alert("Consulta local")
      this.loading = false;
    }
  }

  clearFilter(item){
    this.search[item]=''
    this.dataSource[item] = this.listaProductos[item];
  }

  applyFilter(item, event: Event) {
    //const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const filterValue = this.search[item];
    this.dataSource[item] = this.listaProductos[item].filter(f => {
      
      var resultado = {
        sku: true,
        descripcion: true
      }
      if(filterValue.length>0){
        if(f.sku!=null){
          resultado.sku = f.sku.toLocaleLowerCase().includes(filterValue);
        }
        if(f.descripcion!=null){
          resultado.descripcion = f.descripcion.toLocaleLowerCase().includes(filterValue);
        }
      }

      return resultado.sku || resultado.descripcion;

    });

  }

  async agregarProducto(producto){
    //this.ref.detectChanges();
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
            if(data[0]>producto.Existencia){
              this.tools.showNotification("Error", "No hay suficientes productos disponibles","Ok");
              return false;
            }else{
              this.addProduct(producto, data[0]);
              //this.ref.detectChanges();
              return true;
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
      //this.ref.detectChanges();
  }
  
  async addProduct(producto, cantidad){
    let dataPost = {
      Codigo: producto.Codigo,
      Descripcion: producto.Descripcion,
      Existencia: cantidad
    }
    this.registrosLim = -1;
    this.loadingLim.detalle = true;
    var response = await this.pedidoService.getDetalle(ConfiguracionService.gestionDiaria.pedido.ped_id);
    if(response.ok){
      this.registrosLim = response.registros.length;
      if (this.registrosLim >= 26) {
        this.tools.showNotification("Error", "Ya alcanzo el limite de 25 lineas para este pedido","Ok");
      }else{
        var http = await this.pedidoService.addProductoPromocion(dataPost,ConfiguracionService.gestionDiaria.pedido.ped_id);
        if(http){
          if(http.ok){
            this.tools.showNotification("Exito", "Promocional agregado exitosamente","Ok");
          }
        }else{
          this.tools.showNotification("Error", http.mensaje,"Ok");
        }
      }
        
    }else{
      this.tools.showNotification("Error", response.mensaje,"Ok");
    }
}


  buildImg(img){
    if(img!=null && img.length>10){
      return 'data:image/jpeg;base64,'+img
    }else{
      return "/assets/imagen_no_disponible.png";
    }
  }
  
  productosByPromocion(item){
    return this.productos.filter(p => p.codigo==item);
  }

  buscarPrecio(sku, promocion, lista){
    var p = this.productos.find(f => f.sku==sku && f.codigo==promocion && f.lista==lista);
    if(p!=undefined){
      return p.precio;
    }else{
      return 0;
    }
  }

  unique(arr, keyProps) {
    return Object.values(arr.reduce((uniqueMap, entry) => {
      const key = keyProps.map(k => entry[k]).join('|');
      if (!(key in uniqueMap)) uniqueMap[key] = entry;
      return uniqueMap;
    }, {}));     
  }  

  buscarProducto(sku){

    let navigationExtras: NavigationExtras = {
      queryParams: {
          basico: sku
      }
    };
    this.navCtrl.navigateForward(['tabs/tab2'], navigationExtras);
  }


}

