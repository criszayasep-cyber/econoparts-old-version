import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, IonSegment, IonSlides, AlertController, IonSelect, IonItemSliding, LoadingController, PickerController, ModalController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { VmoPedidoEntityEntity } from '../entity/vmo-pedido-entity';
import { PedidoService } from '../services/pedido.service';
import { ToolsService } from '../services/default/tools.service';
import { FilterEntity } from '../entity/default/filter-entity';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  segment = "first";

  totales = {
    cotizaciones: 0,
    historico: 0
  }
  filtros = {
    cotizaciones: null,
    historico: null
  }
  
  listado = {
    proceso: null,
    cotizaciones: null,
    historico: null
  }

  registros = {
    proceso: -1,
    cotizaciones: -1,
    historico: -1
  }
  loading = {
    proceso: false,
    cotizaciones: false,
    historico: false
  }
  constructor(private route: Router,
    private sanitizer: DomSanitizer,
    public configuracion: ConfiguracionService, 
    private pedidoService: PedidoService,
    private tools: ToolsService,
    public navCtrl: NavController) {
      this.listado.proceso = new Array<VmoPedidoEntityEntity>();
      this.listado.cotizaciones = new Array<VmoPedidoEntityEntity>();
      this.listado.historico = new Array<VmoPedidoEntityEntity>();
      
      this.filtros.cotizaciones = new FilterEntity(ConfiguracionService.paginacion);
      this.filtros.historico = new FilterEntity(ConfiguracionService.paginacion);
    }
  
  ngOnInit(){
    /*if(window.localStorage["categorias"]){
      this.cargado = true;
      this.categorias = JSON.parse(window.localStorage["categorias"]);
    }*/
    
  }
  
  ionViewWillEnter() {
    this.loadPedidosEnProceso();
  }

  doRefresh(event) {
    
    /*switch(this.segment){
      case "first": this.loadPedidosEnProceso(); break;
      case "second": this.loadPedidosCotizaciones(); break;
      case "third": this.loadPedidosHistorico(); break;
    }*/
    this.loadPedidosEnProceso();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async loadPedidosEnProceso(){
    this.registros.proceso = -1;
    this.loading.proceso = true;
    let dataPost = {
      estado: "EN PROCESO",
      primera: true,
      items: 100,
      offset: 0,
      total: 0,
      pageIndex: 0
    }
    var response = await this.pedidoService.filter(dataPost);
    if(response){
      if(response.ok){
        this.listado.proceso = response.registros;
        this.registros.proceso = this.listado.proceso.length;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.loading.proceso = false;
  }
  
  async loadPedidosCotizaciones(){
    this.registros.cotizaciones = -1;
    this.loading.cotizaciones = true;
    let dataPost = {
      estado: "COTIZACION"
    }
    var response = await this.pedidoService.filter(dataPost);
    if(response){
      if(response.ok){
        this.listado.cotizaciones = response.registros;
        this.registros.cotizaciones = this.listado.cotizaciones.length;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.loading.cotizaciones = false;
  }
  
  async loadPedidosHistorico(){
    this.registros.historico = -1;
    this.loading.historico = true;
    let dataPost = {
      estado: "HISTORICO"
    }
    var response = await this.pedidoService.filter(dataPost);
    if(response){
      if(response.ok){
        this.listado.historico = response.registros;
        this.registros.historico = this.listado.historico.length;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.loading.historico = false;
  }
  
  detallePedido(item){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          pedido: JSON.stringify(item)
      }
    };
    this.navCtrl.navigateForward(['tabs/tab4/detalle-pedido'], navigationExtras);
  }
  
  detalleCotizacion(item){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          pedido: JSON.stringify(item)
      }
    };
    this.navCtrl.navigateForward(['tabs/tab4/detalle-cotizacion'], navigationExtras);
  }
  
  detalleHistorico(item){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          pedido: JSON.stringify(item)
      }
    };
    this.navCtrl.navigateForward(['tabs/tab4/detalle-historico'], navigationExtras);
  }
  
  
  async segmentChanged(event){
    /*switch(event.detail.value){
      case "first":
        break;
      case "second":
        this.loadPedidosCotizaciones();
        break;
      case "third":
        this.loadPedidosHistorico();
        break;
    }*/
  }

  paginar(pag): void{
    
    switch(this.segment){
      case "second":
        this.tools.paginar(this.filtros.cotizaciones,pag);
        this.configuracion.setPaginacion(pag.pageSize);
        break;
      case "third":
        this.tools.paginar(this.filtros.historico,pag);
        this.configuracion.setPaginacion(pag.pageSize);
        break;
    }
    this.buscar(false);
  }

  async buscar(primera){

    switch(this.segment){
      case "second":
        this.filtros.cotizaciones.primera = primera;
        if(primera){
          this.totales.cotizaciones = 0;
          this.filtros.cotizaciones.pageIndex = 0;
          this.filtros.cotizaciones.offset = 0;
        }else{
          this.filtros.cotizaciones.total = this.totales.cotizaciones;
        }

        this.registros.cotizaciones = -1;
        this.loading.cotizaciones = true;
        this.filtros.cotizaciones.estado = "COTIZACION";
        var response = await this.pedidoService.filter(this.filtros.cotizaciones);
        if(response){
          if(response.ok){
            this.listado.cotizaciones = response.registros;
            this.registros.cotizaciones = this.listado.historico.length;
            this.totales.cotizaciones = response.total;
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
        }
        this.loading.cotizaciones = false;
      break;
      case "third":
        this.filtros.historico.primera = primera;
        if(primera){
          this.totales.historico = 0;
          this.filtros.historico.pageIndex = 0;
          this.filtros.historico.offset = 0;
        }else{
          this.filtros.historico.total = this.totales.historico;
        }

        this.registros.historico = -1;
        this.loading.historico = true;
        this.filtros.historico.estado = "HISTORICO";
        var response = await this.pedidoService.filter(this.filtros.historico);
        if(response){
          if(response.ok){
            this.listado.historico = response.registros;
            this.registros.historico = this.listado.historico.length;
            this.totales.historico = response.total;
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
        }
        this.loading.historico = false;
      break;
    }
  }
  
  limpiar(){
    switch(this.segment){
      case "second":
        this.registros.cotizaciones = -1;
        this.filtros.cotizaciones = new FilterEntity(25);
        this.listado.cotizaciones = new Array<VmoPedidoEntityEntity>();
      break;
      case "third":
        this.registros.historico = -1;
        this.filtros.historico = new FilterEntity(25);
        this.listado.historico = new Array<VmoPedidoEntityEntity>();
      break;
    }
  }

}
