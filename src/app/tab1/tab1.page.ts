import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ToolsService } from '../services/default/tools.service';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { OrdenamientoComponent } from '../componentes/ordenamiento/ordenamiento.component';
import { KPIService } from '../services/kpi.service';
import { RutaService } from '../services/ruta.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GestionDiariaEntity } from '../entity/gestion-diaria-entity';
import { element } from 'protractor';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  
  titulo = "Gestión Comercial";
  fechasDisponibles: Array<Date> = window.localStorage["fechasDisponibles"]?JSON.parse(window.localStorage["fechasDisponibles"]):[];
  hoy = window.localStorage["hoy"]?window.localStorage["hoy"]:new Date();
  kpiAcumulado: any;
  kpiDia: any
  clientes: Array<GestionDiariaEntity> = window.localStorage["clientesVisitar"]?JSON.parse(window.localStorage["clientesVisitar"]):[];
  loading = {
    clientes: false
  }

  constructor(
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
    public tools: ToolsService,
    private alertController: AlertController, 
    public configuracion: ConfiguracionService,
    private popoverController: PopoverController,
    private kpiService: KPIService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    private rutaService: RutaService
    ) {
      
    }

  ngOnInit(){
    this.loadAll();
  }

  loadAll(){
    this.loadClientes();
    this.loadKPI();
    this.loadGestionActiva();
  }

  
  async ionViewWillEnter() {

    let necesarioActualizar = false;

    await this.activeRoute.queryParams.subscribe( params => {
      if(params["actualizarLista"]!=undefined){
        necesarioActualizar = true;
      }
    });
    
    if(necesarioActualizar || ConfiguracionService.actualizarTab1){
      this.loadAll();
      
      ConfiguracionService.actualizarTab1 = false;
      window.localStorage["actualizarTab1"] = JSON.stringify(false);
      this.router.navigate([], {queryParams: null});
    }
  }
  
  
  doRefresh(event) {
    this.loadAll();
    
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  searchCliente(){
    this.navCtrl.navigateForward(['tabs/tab3']);
  }

  async addClienteNuevo(){
    const alertMedio = await this.alertController.create({
      header: 'Ingrese los datos del cliente',
      subHeader: '',
      cssClass: 'coupon-alert',
      message: '',
      backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },{
          text: 'OK',
          role: 'ok'
        }],
        inputs: [
          {
            placeholder: 'Nombre',
            type: 'text',
            value: ''
          },
          {
            placeholder: 'NIT',
            type: 'text',
            value: ''
          },
          {
            placeholder: 'Correo',
            type: 'text',
            value: ''
          },
          {
            placeholder: 'Teléfono',
            type: 'text',
            value: ''
          }
        ]
      });

    await alertMedio.present();
    var { data, role } = await alertMedio.onDidDismiss();

    if(role=="ok"){
      var completo = true;
      for(var i=0; i<3; i++){
        if(data.values[i].replaceAll(' ','') == ''){
          completo = false;
        }
      };

      if(completo){
        //Enviamos agregar una gestión
          this.tools.presentLoading("Iniciando gestión...")
          var dataPost = {
            nombre: data.values[0],
            nit: data.values[1],
            correo: data.values[2],
            telefono: data.values[3]
          }
          var response = await this.rutaService.iniciarGestionClienteNuevo(dataPost);
          this.tools.destroyLoading();
          if(response.ok){
            var item = {
              ruta: response.registros["ruta"],
              cliente: response.registros["cliente"]
            }
            ConfiguracionService.setSelectedCliente(item, response.registros["pedido"]);
            this.loadAll();
            this.navCtrl.navigateForward(['tabs/tab2']);
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
      }else{
        this.tools.showNotification("Error", "Debe de completar todos los datos","Ok");
      }

    }
  }

  async opciones(ev, item:GestionDiariaEntity, indice){
    const popover = await this.popoverController.create({
      component: OrdenamientoComponent,
      componentProps: {item: item},
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios',
    });
    
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if(data && data.item){
      switch(data.item){
        case 1://Cancelar gestión
          this.ref.detectChanges();
          const alert = await this.alertController.create({
            header: 'Motivo de NO venta',
            backdropDismiss: false,
              buttons: [{
                text: 'OK',
                handler: async data =>{
                  this.ref.detectChanges();
                  
                  if(data!=undefined && data.length>0){
                    let dataPost = {
                      ruta: item.ruta.rde_id,
                      motivo: data
                    }
  
                    var response = await this.rutaService.noVenta(dataPost);
                    if(response.ok){
                      //this.configuracion.removePedidoActual();
                      ConfiguracionService.setUnselectCliente(false); 
                      if(data!="0"){
                        this.clientes.splice(indice, 1);
                        this.loadAll();
                        window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                      }
                    }
                    /*if(data!="0"){
                      item.cancelado = true;
                      item.motivo = data;
                    }*/
                  }

                  this.ref.detectChanges();
                  return true;
                }
              }],
              inputs: [
                {
                  label: 'Negocio cerrado',
                  type: 'radio',
                  value: 'Negocio cerrado'
                },
                {
                  label: 'Cliente tiene stock',
                  type: 'radio',
                  value: 'Cliente tiene stock'
                },
                {
                  label: 'Cliente sin dinero',
                  type: 'radio',
                  value: 'Cliente sin dinero'
                },
                {
                  label: 'Retomar mismo día',
                  type: 'radio',
                  value: '0'
                }
              ]
            });
      
            await alert.present();
            this.ref.detectChanges();
          break;
        case 2://Iniciar gestión

          this.tools.presentLoading("Iniciando gestión...")
          var response = await this.rutaService.iniciarGestion(item.ruta.rde_id);
          this.tools.destroyLoading();
          if(response.ok){
            ConfiguracionService.setSelectedCliente(item, response.registros);
            this.navCtrl.navigateForward(['tabs/tab2']);
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
          break;
        case 3://Cambiar día
          this.ref.detectChanges();

          var opciones = [];

          //var config = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          //var config = { year: 'numeric', month: '2-digit', day: '2-digit' };
          this.fechasDisponibles.forEach( function(fd) {
            opciones.push({
              label: new Date(fd).toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'short', day: '2-digit' }),
              type: 'radio',
              value: fd
            });
          });

          const cambiarDia = await this.alertController.create({
            header: 'Seleccione la nueva fecha',
            backdropDismiss: false,
              buttons: [{
                text: 'OK',
                handler: async data =>{
                  this.ref.detectChanges();

                  if(data!=undefined && data.length>0){
                    let dataPost = {
                      ruta: item.ruta.rde_id,
                      nueva_fecha: data
                    }
  
                    var response = await this.rutaService.updateFecha(dataPost);
                    if(response.ok){
                      //this.configuracion.removePedidoActual();
                      this.clientes.splice(indice, 1);
                      window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                      ConfiguracionService.setUnselectCliente(false);
                      this.loadAll();
                    }
                  }
                  
                  this.ref.detectChanges();
                  return true;
                }
              }],
              inputs: opciones
            });
      
            await cambiarDia.present();
            this.ref.detectChanges();
          break;
        case 4://ver cliente
          let navigationExtras: NavigationExtras = {
            queryParams: {
                cliente: JSON.stringify(item.cliente)
            }
          };
          this.navCtrl.navigateForward(['tabs/tab3/detalle'], navigationExtras);
          break;
      }
    }
  }

  async loadClientes(){
    this.ref.detectChanges();
    //this.clientes = [];
    this.loading.clientes = true;
    var r = await this.rutaService.getToday();
    this.loading.clientes = false;
    if(r){
      if(r.ok){
        this.clientes = r.registros;
        window.localStorage["clientesVisitar"] = JSON.stringify(r.registros);
      }else{
        this.tools.showNotification("Error", r.mensaje,"Ok");
      }
    }
    this.ref.detectChanges();
  }

  async loadKPI(){
    var r = await this.kpiService.getAll();
    if(r){
      if(r.ok){
        this.loadFechasDisponibles(r.registros["hoy"]);

        this.hoy = r.registros["hoy"];
        this.kpiAcumulado = r.registros["acumulado"]
        this.kpiDia = r.registros["dia"]

        window.localStorage["hoy"] = this.hoy;
      }else{
        this.tools.showNotification("Error", r.mensaje,"Ok");
      }
    }
  }

  async loadFechasDisponibles(serverString){
    var server = new Date(serverString);
    var local = new Date(this.hoy);

    if(!(local.getTime() == server.getTime())){
      var response = await this.rutaService.fechasDisponibles();
      if(response.ok){
        this.fechasDisponibles = response.registros;
        window.localStorage["fechasDisponibles"] = JSON.stringify(response.registros);
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  async loadGestionActiva(){
    var response = await this.rutaService.getGestionActiva();
    if(response.ok){
      if(response.registros["ruta"]!=null){
        ConfiguracionService.setGestionActiva(response.registros);
      }else{
        ConfiguracionService.setUnselectCliente(false);
      }
    }else{
      this.tools.showNotification("Error", response.mensaje,"Ok");
    }
  }

}
