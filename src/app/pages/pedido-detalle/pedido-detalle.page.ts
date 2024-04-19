import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, PickerController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfiguracionService } from '../../services/default/configuracion.service';
import { VmoPedidoEntityEntity } from '../../entity/vmo-pedido-entity';
import { PedidoService } from '../../services/pedido.service';
import { ToolsService } from '../../services/default/tools.service';
import { VmoPedidoDetalleEntityEntity } from '../../entity/vmo-pedido-detalle-entity';
import { ClienteService } from '../../services/cliente.service';
import { ClienteEntity } from '../../entity/cliente-entity';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
})
export class PedidoDetallePage implements OnInit {

  facturado = false;
  registros = -1;
  loading = {
    detalle: false
  }
  usuario: any;
  historial= null;
  sucursales: any[];
  rutas: any[];
  segment = "precios";

  pedido: VmoPedidoEntityEntity;
  cliente: ClienteEntity;

  constructor(public navCtrl: NavController, 
    private alertController: AlertController,
    private activeRoute: ActivatedRoute, 
    public configuracion: ConfiguracionService,
    private pedidoService: PedidoService,
    private tools: ToolsService,
    private clienteService: ClienteService,
    private pickerCtrl: PickerController,
    private navService: NavService,
    private ref: ChangeDetectorRef,
    private toastCtrl: ToastController) { 
      this.cliente = new ClienteEntity();
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {

      //this.pedido  = this.configuracion.getpedidos().filter(f => f.cliente.codigo==params["pedido"])[0]
      this.pedido = JSON.parse(params["pedido"]);
      this.loadDetalle();
      this.loadInfoCliente();

      this.loadRutas();
      this.loadSucursales();
    });
  }
  
  ionViewWillEnter(){
    this.facturado = false;
    /*if(!window.localStorage['login']){
      this.navCtrl.navigateForward(['/tabs/tab4']);
    }*/
  }

  async loadInfoCliente(){
    if(this.configuracion.ConfiguracionService.online){
      var response = await this.clienteService.getByID(this.pedido.ped_cliente_codigo);
      if(response){
        if(response.ok){
          this.cliente = response.registros["cliente"];
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }
    }else{

    }
  }

  async loadDetalle(){
    this.registros = -1;
    this.loading.detalle = true;
    
    if(this.configuracion.ConfiguracionService.online){
      var response = await this.pedidoService.getDetalle(this.pedido.ped_id);
      if(response){
        if(response.ok){
          this.pedido.vmo_pedido_detalle = response.registros;
          this.registros = this.pedido.vmo_pedido_detalle.length;
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }
    }else{

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
      this.tools.presentLoading("Eliminando producto...")
      var response = await this.pedidoService.removeProducto(this.pedido.ped_id, item.pde_id);
      this.tools.destroyLoading();
      if(response.ok){
        this.pedido.vmo_pedido_detalle.splice(indice,1);
        this.pedido.vmo_pedido_detalle = response.registros;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  actualizandoProducto = false;
  async onInputTime(event){
    console.log(event)
    if(event>0 && !this.actualizandoProducto){
      this.actualizandoProducto = true;
      setTimeout(async () => 
      {
        this.actualizandoProducto = false;
        var pds = this.pedido.vmo_pedido_detalle.filter(f => f.pde_cantidad==null);
        if(pds.length==0){
          this.tools.presentLoading("Actualizando precios...")
          var response = await this.pedidoService.updatePedidoDetalle(this.pedido);
          if(response){
            if(response.ok){
              //this.tools.showNotification("Exito!", "Pedido actualizado","Ok");
              this.pedido.vmo_pedido_detalle = response.registros;
            }else{
              this.tools.showNotification("Error", response.mensaje,"Ok");
            }
          }
          this.tools.destroyLoading();
        }
      },
      1500);
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

    var rutSuc = "";
    if(this.pedido.ped_ubicacion=="CD"){
      rutSuc = `<span class="c-no-margin">Ruta:</span> ${this.pedido.ped_ruta_txt}<br/>`;
    }else{
      rutSuc = `<span class="c-no-margin">Sucursal:</span> ${this.pedido.ped_sucursal_txt}<br/>`;
    }

    var html = `<span class="c-no-margin">Complemento:</span> ${this.pedido.ped_complemento?'Si':'No'}<br/>
                <span class="c-no-margin">Condición:</span> ${this.pedido.ped_tipo_pago}<br/>
                <span class="c-no-margin">Facturación:</span> ${this.pedido.ped_ubicacion}<br/>
                ${rutSuc}`;
    var r = await this.tools.showConfirm("¿Realmente desea facturar este pedido?", "", html);
    if(r=="confirm"){
      //Validar productos baterias nuevas
      var NoBateriasNuevas=0;
      var NoBateriasChatarra=0;
      var response = await this.pedidoService.getDetalle(this.pedido.ped_id);
      if(response.ok){
        NoBateriasNuevas=response.registros.reduce((accumulator, obj) => {
          if (obj.pde_descripcion.startsWith("BATERIAS")){
            return accumulator + (obj.pde_cantidad*1);
          }else{
            return accumulator;
          }
        }, 0);
        NoBateriasChatarra=response.registros.reduce((accumulator, obj) => {
          if (obj.pde_producto=="510102"){
            return accumulator + (obj.pde_cantidad*1);
          }else{
            return accumulator;
          }
        }, 0);
      }
      //Fin baterias nuevas
      if (NoBateriasChatarra<=NoBateriasNuevas) {
        if(this.cliente.tipo_pago=='0D' || this.cliente.tipo_pago=='CEN' || this.pedido.ped_tipo_pago=='CONTADO'){
          this.tools.presentLoading("Facturando...")
          var response = await this.pedidoService.facturar(this.pedido, this.configuracion.getGestionActiva());
          this.tools.destroyLoading();
          if(response){
            if(response.ok){
              ConfiguracionService.setUnselectCliente(true);
              this.facturado = true;
              this.tools.showNotification("Exito!", "Pedido facturado","Ok");
            }else{
              this.tools.showNotification("Advertencia", response.error,"Ok");
              this.tools.showNotification("Advertencia", response.mensaje,"Ok");
            }
          }/*
          this.tools.presentLoading("Facturando...")
          var response = await this.pedidoService.facturar(this.pedido, this.configuracion.getGestionActiva());
          this.tools.destroyLoading();
          if(response){
            if(response.ok){
              ConfiguracionService.setUnselectCliente(true);
              this.facturado = true;
              this.tools.showNotification("Exito!", "Pedido facturado","Ok");
            }else{
              this.tools.showNotification("Advertencia", response.error,"Ok");
              this.tools.showNotification("Advertencia", response.mensaje,"Ok");
            }
          }*/
        }else{
          var disponible = this.cliente.limite-this.cliente.saldo;
          if(disponible<=0){
            this.tools.showNotification("Error!", "Cliente no tiene saldo disponible para facturar","Ok");
          }else{
            disponible = disponible-this.totalMontoIVA();
            if(disponible<0){
              this.tools.showNotification("Error!", "El monto del pedido supera el saldo disponible del cliente","Ok");
            }else{
              this.tools.presentLoading("Facturando...")
              var response = await this.pedidoService.facturar(this.pedido, this.configuracion.getGestionActiva());
              this.tools.destroyLoading();
              if(response){
                if(response.ok){
                  ConfiguracionService.setUnselectCliente(true);
                  this.facturado = true;
                  this.tools.showNotification("Exito!", "Pedido facturado","Ok");
                }else{
                  this.tools.showNotification("Advertencia", response.error,"Ok");
                  this.tools.showNotification("Advertencia", response.mensaje,"Ok");
                }
              }
            }
          }
        }
      }else {
        this.tools.showNotification("Error", "La cantidad de baterias chatarra:"+NoBateriasChatarra+" debe ser menor o igual a la cantidad de baterias nuevas: "+NoBateriasNuevas,"Ok");
      }
      /*
      */

    }
  }
  
  async cotizar(){
    //Preguntar porque medio cotizar
    const alert = await this.alertController.create({
      header: '¿Realmente desea solo cotizar este pedido?',
      subHeader: 'La gestión del cliente finalizara.',
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
            label: 'Correo: \n'+this.pedido.ped_cliente_correo,
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
        return accumulator + (obj.pde_precio_unitario_final*obj.pde_cantidad);
      }, 0);
    }else{
      return 0;
    }
  }
  
  totalMontoIVA(){
    if(this.pedido.vmo_pedido_detalle?.length>0){
      return this.pedido.vmo_pedido_detalle.reduce((accumulator, obj) => {
        return accumulator + ((obj.pde_precio_unitario_final*1.13)*obj.pde_cantidad);
      }, 0);
    }else{
      return 0;
    }
  }

  

  async loadRutas(){
    if(this.configuracion.ConfiguracionService.online){
      var response = await this.navService.getRutas();
      if(response){
        if(response.ok){
          this.rutas = response.registros;
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }
    }else{

    }
  }

  async loadSucursales(){
    if(this.configuracion.ConfiguracionService.online){
      var response = await this.navService.getSucursales();
      if(response){
        if(response.ok){
          this.sucursales = response.registros;
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }
    }else{

    }
  }

  async openPickerRutas(){
    
    var opciones = [];

    this.rutas.forEach(s => {
      opciones.push({
        text: s.Codigo+"-"+s.Nombre+" ("+s.DeliveryCodigo+": "+s.DeliveryNombre+")",
        value: s.Codigo
      })
    });

    var seleccion = 0;
    if(this.pedido.ped_ruta.length>0){
      seleccion = this.rutas.findIndex(s => s.Codigo==this.pedido.ped_ruta)
    }

    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'rutas',
          selectedIndex: seleccion,
          options: opciones,
        },
      ],
      cssClass: 'prueba',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (value) => {
            //window.alert(`You selected: ${value.languages.value}`);
            var obj = this.obtenerKeyValue(this.rutas, 'Codigo', value.rutas.value);
            this.pedido.ped_ruta = value.rutas.value;
            this.pedido.ped_ruta_txt = obj.Codigo+" - "+obj.Nombre;

            this.ref.detectChanges();
          },
        },
      ],
    });

    await picker.present();
  }




  async openPickerSucursales(){
    var opciones = [];

    this.sucursales.forEach(s => {
      opciones.push({
        text: s.Nombre,
        value: s.Codigo
      })
    });

    var seleccion = 0;
    if(this.pedido.ped_sucursal.length>0 && this.pedido.ped_sucursal!='Seleccionar'){
      seleccion = this.sucursales.findIndex(s => s.Codigo==this.pedido.ped_sucursal)
    }

    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'sucursales',
          selectedIndex: seleccion,
          options: opciones,
        },
      ],
      cssClass: 'prueba',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (value) => {
            //window.alert(`You selected: ${value.languages.value}`);
            this.pedido.ped_sucursal = value.sucursales.value;
            this.pedido.ped_sucursal_txt = value.sucursales.text;
            this.ref.detectChanges();
          },
        },
      ],
    });

    await picker.present();
  }


  obtenerKeyValue(array, buscar, valor){
    return array.find(s => s[buscar]==valor);
  }
  
  hola(x){
    console.log(x.detail.checked)
  }
}