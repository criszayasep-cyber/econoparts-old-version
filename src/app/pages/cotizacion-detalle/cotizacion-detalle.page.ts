import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfiguracionService } from '../../services/default/configuracion.service';
import { VmoPedidoEntityEntity } from '../../entity/vmo-pedido-entity';
import { PedidoService } from '../../services/pedido.service';
import { ToolsService } from '../../services/default/tools.service';
import { VmoPedidoDetalleEntityEntity } from '../../entity/vmo-pedido-detalle-entity';
import { ClienteService } from '../../services/cliente.service';
import { ClienteEntity } from '../../entity/cliente-entity';

@Component({
  selector: 'app-cotizacion-detalle',
  templateUrl: './cotizacion-detalle.page.html',
  styleUrls: ['./cotizacion-detalle.page.scss'],
})
export class CotizacionDetallePage implements OnInit {

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
      this.pedido = JSON.parse(params["pedido"]);
      this.loadDetalle();
      this.loadInfoCliente();
    });
  }
  
  ionViewWillEnter(){
    this.facturado = false;
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
  
  async facturar(){
    var r = await this.tools.showConfirm("¿Realmente desea facturar este pedido?", "", "");
    if(r=="confirm"){
      this.tools.presentLoading("Facturando...")
      var response = await this.pedidoService.facturarCotizacion(this.pedido);
      this.tools.destroyLoading();
      if(response){
        if(response.ok){
          //ConfiguracionService.setUnselectCliente(true);
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
      header: '¿Realmente desea reenviar esta cotización?',
      subHeader: '',
      cssClass: 'coupon-alert',
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
          var response = await this.pedidoService.cotizarReenviar(this.pedido, data.values);
          this.tools.destroyLoading();
          if(response.ok){
            /*ConfiguracionService.setUnselectCliente(true);
            this.facturado = true;*/
            this.tools.showNotification("Exito!", "Pedido cotizado","Ok");
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
        }else{
          this.tools.showNotification("Error", "Debe de seleccionar una opción", "OK");
        }
      }
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