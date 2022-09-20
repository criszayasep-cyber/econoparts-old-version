import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { VmoPedidoEntityEntity } from '../entity/vmo-pedido-entity';
import { PedidoService } from '../services/pedido.service';
import { ToolsService } from '../services/default/tools.service';
import { VmoPedidoDetalleEntityEntity } from '../entity/vmo-pedido-detalle-entity';
import { ClienteService } from '../services/cliente.service';
import { ClienteEntity } from '../entity/cliente-entity';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
})
export class MiCuentaPage implements OnInit {

  facturado = false;
  registros = -1;
  loading = {
    detalle: false
  }
  usuario: any;
  historial= null;

  pedido: VmoPedidoEntityEntity;
  cliente: ClienteEntity;

  constructor(public navCtrl: NavController, 
    private alertController: AlertController,
    private activeRoute: ActivatedRoute, 
    public configuracion: ConfiguracionService,
    private pedidoService: PedidoService,
    private tools: ToolsService,
    private clienteService: ClienteService,
    private toastCtrl: ToastController) { 
      this.cliente = new ClienteEntity();
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {

      //this.pedido  = this.configuracion.getpedidos().filter(f => f.cliente.codigo==params["pedido"])[0]
      this.pedido = JSON.parse(params["pedido"]);
      this.loadDetalle();
      this.loadInfoCliente();
    });
  }
  
  ionViewWillEnter(){
    this.facturado = false;
    /*if(!window.localStorage['login']){
      this.navCtrl.navigateForward(['/tabs/tab4']);
    }*/
  }

  async loadInfoCliente(){
    var response = await this.clienteService.getByID(this.pedido.ped_cliente_codigo);
    if(response){
      if(response.ok){
        this.cliente = response.registros["cliente"];
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  async loadDetalle(){
    this.registros = -1;
    this.loading.detalle = true;
    
    var response = await this.pedidoService.getDetalle(this.pedido.ped_id);
    if(response){
      if(response.ok){
        this.pedido.vmo_pedido_detalle = response.registros;
        this.registros = this.pedido.vmo_pedido_detalle.length;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.loading.detalle = false;
  }

  async changePassword(){

    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ingrese su nueva contraseña',
      backdropDismiss: false,
      inputs: [
        {
          name: 'p1',
          type: 'password',
          placeholder: 'Ingrese su contraseña'
        },
        {
          name: 'p2',
          type: 'password',
          placeholder: 'Repita su contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Cambiar',
          handler: (alertData) => {
            if(alertData.p1!="" && alertData.p2!="" && alertData.p1==alertData.p2){
              let param = {
                'p1': alertData.p1,
                'p2': alertData.p2,
                'user': this.usuario.idUser
              }
              /*this.stjacksServices.changePassword(param).
              subscribe(
                rs => rs,
                er => {
                  //console.log(er);
                },
                () => {
                  //console.log(this.historial);
                }
              );*/
              this.showErrorToast('Su contraseña se ha actualizado.');
              return true;
            }else{
              this.showErrorToast('Su contraseña no coincide');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showErrorToast(data: any) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 2000
    });
    toast.present();
  }


  abrirTracking(id){
    //console.log(id);
    let navigationExtras: NavigationExtras = {
        queryParams: {
            cargarPagina: true,
            url: 'PedidoTracking/'+id,
            currency: null
        }
    };
    this.navCtrl.navigateForward(['lista-productos'], navigationExtras);
  }
  
  async atras(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          actualizarLista: true
      }
    };
    //this.navCtrl.navigateForward(['/tabs/tab4'], navigationExtras);
    this.navCtrl.navigateBack(['/tabs/tab4']);
  }
  
  async deleteProducto(item:VmoPedidoDetalleEntityEntity, indice){
    var r = await this.tools.showConfirm("¿Realmente desea eliminar este producto \""+item.pde_producto+"\"?", "", "");
    if(r=="confirm"){
      var response = await this.pedidoService.removeProducto(this.pedido.ped_id, item.pde_id);
      if(response.ok){
        this.pedido.vmo_pedido_detalle.splice(indice,1);
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }
  
  async guardar(){
    this.tools.presentLoading("Guardando...")
    
    var response = await this.pedidoService.updatePedido(this.pedido);
    if(response){
      if(response.ok){
        this.tools.showNotification("Exito!", "Pedido actualizado","Ok");
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.tools.destroyLoading();
  }
  
  async facturar(){
    var r = await this.tools.showConfirm("¿Realmente desea facturar este pedido?", "", "");
    if(r=="confirm"){
      this.tools.presentLoading("Facturando...")
      var response = await this.pedidoService.facturar(this.pedido, this.configuracion.getGestionActiva());
      this.tools.destroyLoading();
      if(response){
        if(response.ok){
          ConfiguracionService.setUnselectCliente(true);
          this.facturado = true;
          this.tools.showNotification("Exito!", "Pedido facturado","Ok");
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }
    }
  }
  
  async cotizar(){
    //Preguntar porque medio cotizar
    const alert = await this.alertController.create({
      header: '¿Realmente desea solo cotizar este pedido?',
      subHeader: 'La gestión del cliente finalizara.',
      message: 'Enviar cotización a:',
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
            label: 'Correo: '+this.pedido.ped_cliente_correo,
            type: 'radio',
            value: 'CORREO'
          },
          {
            label: 'WhatsApp: +503'+this.pedido.ped_celular,
            type: 'radio',
            value: 'WHATSAPP'
          }
        ]
      });

      await alert.present();
      const { data, role } = await alert.onDidDismiss();
      if(role=="ok"){
        if(data.values!=undefined){
          this.tools.presentLoading("Creando cotización...")
          var response = await this.pedidoService.cotizar(this.pedido, this.configuracion.getGestionActiva(), data.values);
          this.tools.destroyLoading();
          if(response.ok){
            ConfiguracionService.setUnselectCliente(true);
            this.facturado = true;
            this.tools.showNotification("Exito!", "Pedido cotizado","Ok");
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
        }else{
          this.tools.showNotification("Error", "Debe de seleccionar una opción", "OK");
        }
      }

    /*var r = await this.tools.showConfirm("¿Realmente desea solo cotizar este pedido?", "La gestión del cliente finalizara.", "Se enviara a "+this.pedido.ped_cliente_correo);
    if(r=="confirm"){
      this.tools.presentLoading("Creando cotización...")
      var response = await this.pedidoService.cotizar(this.pedido, this.configuracion.getGestionActiva());
      this.tools.destroyLoading();
      if(response){
        if(response.ok){
          ConfiguracionService.setUnselectCliente(true);
          this.facturado = true;
          this.tools.showNotification("Exito!", "Pedido cotizado","Ok");
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }
    }*/
  }

  async presentAlert($titulo, $mensaje, $boton){
    const alert = await this.alertController.create({
      header: $titulo,
      message: $mensaje,
      backdropDismiss: false,
      buttons: [$boton]
    });
    await alert.present();
  }

  totalUnidades(){
    if(this.pedido.vmo_pedido_detalle?.length>0){
      return this.pedido.vmo_pedido_detalle.reduce((accumulator, obj) => {
        return accumulator + (obj.pde_cantidad*1);
      }, 0);
    }else{
      return 0;
    }
  }
  
  totalMonto(){
    if(this.pedido.vmo_pedido_detalle?.length>0){
      return this.pedido.vmo_pedido_detalle.reduce((accumulator, obj) => {
        return accumulator + (obj.pde_precio_unitario*obj.pde_cantidad);
      }, 0);
    }else{
      return 0;
    }
  }
  
  totalMontoIVA(){
    if(this.pedido.vmo_pedido_detalle?.length>0){
      return this.pedido.vmo_pedido_detalle.reduce((accumulator, obj) => {
        return accumulator + ((obj.pde_precio_unitario*1.13)*obj.pde_cantidad);
      }, 0);
    }else{
      return 0;
    }
  }
  
}
