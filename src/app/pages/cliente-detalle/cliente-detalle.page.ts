import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { OpcionesFacturaComponent } from 'src/app/componentes/opciones-factura/opciones-factura.component';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';
import { ClienteEntity } from '../../entity/cliente-entity';
import { FacturaPendienteEntity } from '../../entity/factura-pendiente';
import { ClienteService } from '../../services/cliente.service';
import { ToolsService } from '../../services/default/tools.service';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.page.html',
  styleUrls: ['./cliente-detalle.page.scss'],
})
export class ClienteDetallePage implements OnInit {

  registros = -1;
  segment = "";
  cliente: ClienteEntity;
  facturasPendientes: Array<FacturaPendienteEntity> = [];
  loading = {
    facturas: false
  }

  constructor(
    private tools: ToolsService,
    public navCtrl: NavController,
    public router: Router,
    private alertController: AlertController,
    private activeRoute: ActivatedRoute,
    private popoverController: PopoverController,
    private clienteService: ClienteService) { 
      
    }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.cliente  = JSON.parse(params["cliente"]);
    });
  }

  ionViewWillEnter(){
    var p = this.activeRoute.snapshot.queryParamMap.get('tab')
    if(p!=undefined){
      this.segment = p;
    }else{
      this.facturasPendientes = [];
      this.segment = "first";
      this.registros = -1;
    }
  }

  async segmentChanged(event){
    this.registros = -1;
    switch(event.detail.value){
      case "first":
        break;
      case "second":
        if(ConfiguracionService.online){
          this.loading.facturas = true;
          var response = await this.clienteService.getFacturasPendientes(this.cliente.codigo);
          if(response){
            if(response.ok){
              this.facturasPendientes = response.registros;
              this.registros = this.facturasPendientes.length;
            }else{
              this.tools.showNotification("Error", response.mensaje,"Ok");
            }
          }
          this.loading.facturas = false;
        }
        break;
    }
    this.router.navigate([], 
      {
        relativeTo: this.activeRoute,
        queryParams: {tab: event.detail.value}, 
        queryParamsHandling: 'merge'
      });
  }

  validarEstado(item:FacturaPendienteEntity){
    var hoy = new Date();
    var fecha = new Date(item.fecha_vencimiento)

    if(fecha<=hoy){
      return true
    }else{
      return false
    }
  }
  

  async opciones(ev, item){
    
    const popover = await this.popoverController.create({
      component: OpcionesFacturaComponent,
      componentProps: {item: item},
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios',
    });

    let navigationExtras: NavigationExtras;
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if(data!=undefined){
      switch(data.item){
        case 1:
          navigationExtras = {
            queryParams: {
                subTipo: item.sub_tipo,
                numeroExtero: item.numero_externo,
                documento: item.documento
            }
          };
          this.navCtrl.navigateForward(['tabs/tab3/facturas-pendientes-detalle'], navigationExtras);
          break;
        case 2:
          navigationExtras = {
            queryParams: {
                numero: item.numero,
                documento: item.documento
            }
          };
          this.navCtrl.navigateForward(['tabs/tab3/notas-credito-relacionadas'], navigationExtras);
          break;
        case 3:
          this.reportarDocumento(item);
          break;
      }
    }
  }

  async reportarDocumento(item){
    
    const alertMedio = await this.alertController.create({
      header: 'Ingrese un comentario',
      subHeader: 'Este reporte sera enviado por correo a créditos.',
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
            label: 'Comentario',
            type: 'textarea',
            value: ''
          }
        ]
      });

    await alertMedio.present();
    var { data, role } = await alertMedio.onDidDismiss();

    if(role=="ok"){
      if(data.values[0].length>0){
        let dataPost = {
          documento: item.documento,
          comentario: data.values[0],
          cliente: this.cliente.nombre_social,
          cliente_codigo: this.cliente.codigo
        }
        
        this.tools.presentLoading("Enviando reporte...")
        var response = await this.clienteService.ReportarDocumento(dataPost);
        this.tools.destroyLoading();
        if(response.ok){
          this.tools.showNotification("Exito!", "Reporte envíado, usted recibira una copia por correo.","Ok");
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        }
      }else{
        this.tools.showNotification("Error", "Debe de ingresar un valor", "OK");
      }
    }
  }

  async enviarEC(){
    const alertMedio = await this.alertController.create({
      header: '¿Cúal es el medio a enviar el estado de cuenta?',
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
            label: 'Correo',
            type: 'radio',
            value: 'CORREO'
          },
          {
            label: 'WhatsApp',
            type: 'radio',
            value: 'WHATSAPP'
          }
        ]
      });

    await alertMedio.present();
    var { data, role } = await alertMedio.onDidDismiss();

    if(role=="ok"){
      var medio = data.values;
      if(medio!=undefined){
        var confirmar = medio=="WHATSAPP"?this.cliente.celular:this.cliente.correo;
        const alert = await this.alertController.create({
          header: 'Verifique el '+medio+" donde se enviara",
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
                label: 'Correo:',
                type: 'text',
                value: confirmar
              }
            ]
          });
    
        await alert.present();
        var { data, role } = await alert.onDidDismiss();
        if(role=="ok"){
          var valor = data.values[0];
          if(valor.length>5){
  
  
            const alert = await this.alertController.create({
              header: '¿Realmente desea enviar el estado de cuenta?',
              subHeader: 'Esta seguro de los datos visualizados son correctos, sino verificar estado de cuenta con analista de créditos y cobros antes de enviar al cliente',
              cssClass: 'coupon-alert',
              message: 'Se enviara por '+medio+' a '+valor,
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
              var { data, role } = await alert.onDidDismiss();
              if(role=="ok"){
                var dataPost = {
                  cliente: this.cliente.codigo,
                  medio: medio,
                  valor: valor
                }
                this.tools.presentLoading("Enviando estado de cuenta...")
                var response = await this.clienteService.sendEstadoCuenta(dataPost);
                this.tools.destroyLoading();
                if(response.ok){
                  this.tools.showNotification("Exito!", "Estado de cuenta enviado","Ok");
                }else{
                  this.tools.showNotification("Error", response.mensaje,"Ok");
                }
              }
          }else{
            this.tools.showNotification("Error", "Debe de ingresar un valor", "OK");
          }
        }
      }else{
        this.tools.showNotification("Error", "Debe de seleccionar una opción", "OK");
      }
    }

  }

}
