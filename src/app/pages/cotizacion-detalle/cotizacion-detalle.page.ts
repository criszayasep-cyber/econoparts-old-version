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
  selector: 'app-cotizacion-detalle',
  templateUrl: './cotizacion-detalle.page.html',
  styleUrls: ['./cotizacion-detalle.page.scss'],
})
export class CotizacionDetallePage implements OnInit {

  diasFaltantes = 0;
  vencido = false;
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
    private pickerCtrl: PickerController,
    private navService: NavService,
    private ref: ChangeDetectorRef,
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

      this.loadRutas();
      this.loadSucursales();

      
      let hoy = new Date();
      let vencimiento = new Date(this.pedido.ped_fecha);
      vencimiento.setDate(vencimiento.getDate()+15);
      /*console.log(vencimiento)
      console.log(hoy)*/

      this.vencido = (hoy > vencimiento);
      //console.log(this.vencido)
      
      if(!this.vencido){
        this.diasFaltantes = Math.ceil((Math.abs(vencimiento.getTime()-hoy.getTime()))/ (1000 * 3600 * 24));
        //console.log("DIAS FALTANTES:",this.diasFaltantes)
      }

    });
  }
  
  ionViewWillEnter(){
    this.facturado = false;
  }

  async loadRutas(){
    var response = await this.navService.getRutas();
    if(response){
      if(response.ok){
        this.rutas = response.registros;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  async loadSucursales(){
    var response = await this.navService.getSucursales();
    if(response){
      if(response.ok){
        this.sucursales = response.registros;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
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



  async editar(){
    if(this.configuracion.getCodigoActivo()!=undefined){
      this.tools.showNotification("Error", "Hay una gestión activa","Ok");
    }else{
      const alert = await this.alertController.create({
        header: '¿Realmente desea modificar esta cotización?',
        subHeader: 'Los precios se actualizaran a la lista de precios actual.',
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
          }]
        });
  
        await alert.present();
        const { data, role } = await alert.onDidDismiss();
        if(role=="ok"){
          this.tools.presentLoading("Actualizando información...")
          var response = await this.pedidoService.EditarCotizacion(this.pedido.ped_id);
          this.tools.destroyLoading();
          if(response.ok){
            this.tools.showNotification("Exito!", "Pedido activo para modificar","Ok");
            var item = response.registros;
            ConfiguracionService.setSelectedCliente(item, item["pedido"]);
            
            let navigationExtras: NavigationExtras = {
              queryParams: {
                  segment: "first"
              }
            };
            this.navCtrl.navigateForward(['tabs/tab4'], navigationExtras);
          }else{
            this.tools.showNotification("Error!", response.mensaje,"Ok");
          }
        }
    }
  }
}