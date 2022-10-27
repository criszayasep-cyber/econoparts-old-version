import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, IonSegment, IonSlides, AlertController, IonSelect, IonItemSliding, LoadingController, PickerController, ModalController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { ClienteEntity } from '../entity/cliente-entity';
import { FilterEntity } from '../entity/default/filter-entity';
import { ClienteService } from '../services/cliente.service';
import { ToolsService } from '../services/default/tools.service';
import { RutaService } from '../services/ruta.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page  implements OnInit{

  total = 0;
  registros = -1;
  clientes: Array<ClienteEntity> = [];
  loading = false;
  filtros: FilterEntity;

  constructor(
    public config: ConfiguracionService,
    public navCtrl: NavController,
    private clienteService: ClienteService,
    private rutaSerivce: RutaService,
    private tools: ToolsService) {
      this.filtros = new FilterEntity(ConfiguracionService.paginacion);
    }
  
  ngOnInit(){

    /*if(window.localStorage["categorias"]){
      this.cargado = true;
      this.categorias = JSON.parse(window.localStorage["categorias"]);
    }*/
    
  }

  paginar(pag): void{
    this.tools.paginar(this.filtros,pag);
    this.config.setPaginacion(pag.pageSize);
    this.buscar(false);
  }

  async add(item:ClienteEntity, indice){

    var r = await this.tools.showConfirm("¿Realmente desea agregar al cliente \""+item.nombre_social+"\" a la gestión de este día?", "", "");
    if(r=="confirm"){
      //Agregar a la lista
      this.tools.presentLoading("Espere un momento...");
      var response = await this.rutaSerivce.addGestionToday(item.codigo);
      this.tools.destroyLoading();
      if(response.ok){
        this.clientes.splice(indice,1);
        let navigationExtras: NavigationExtras = {
          queryParams: {
              actualizarLista: true
          }
        };
        this.navCtrl.navigateForward(['tabs/tab1'], navigationExtras);
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }
  

  limpiar(){
    this.registros = -1;
    this.clientes = [];
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
  }

  async buscar(primera){
    this.filtros.primera = primera;
    if(primera){
      this.total = 0;
      this.filtros.pageIndex = 0;
      this.filtros.offset = 0;
    }else{
      this.filtros.total = this.total;
    }

    this.registros = -1;
    this.clientes = [];
    this.loading = true;
    var http = await this.clienteService.filter(this.filtros);
    if(http.ok){
        this.clientes = http.registros;
        this.registros = this.clientes.length;
        this.total = http.total;
    }else{
      this.tools.showNotification("Error", http.mensaje,"Ok");
    }
    this.loading = false;
  }

  show(item:ClienteEntity){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          cliente: JSON.stringify(item)
      }
    };
    this.navCtrl.navigateForward(['tabs/tab3/detalle'], navigationExtras);
  }

}
