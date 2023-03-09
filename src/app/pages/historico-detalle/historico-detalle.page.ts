import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfiguracionService } from '../../services/default/configuracion.service';
import { VmoPedidoEntityEntity } from '../../entity/vmo-pedido-entity';
import { PedidoService } from '../../services/pedido.service';
import { ToolsService } from '../../services/default/tools.service';
import { VmoPedidoDetalleEntityEntity } from '../../entity/vmo-pedido-detalle-entity';
import { FacturaEntity } from 'src/app/entity/factura-entity';
import { FacturaDetalleEntity } from 'src/app/entity/factura-detalle-entity';
import { TrackingPedidoEntity } from 'src/app/entity/tracking-pedido-entity';

@Component({
  selector: 'app-historico-detalle',
  templateUrl: './historico-detalle.page.html',
  styleUrls: ['./historico-detalle.page.scss'],
})
export class HistoricoDetallePage implements OnInit {

  segment = "pedido";
  registros = -1;
  loading = {
    detalle: false
  }
  usuario: any;
  historial= null;

  pedido: VmoPedidoEntityEntity;
  facturado = false;
  facturaEncabezado: FacturaEntity;
  facturaDetalle: Array<FacturaDetalleEntity> = [];
  tracking: Array<TrackingPedidoEntity> = [];

  constructor(public navCtrl: NavController, 
    private alertController: AlertController,
    private activeRoute: ActivatedRoute, 
    public configuracion: ConfiguracionService,
    private pedidoService: PedidoService,
    private tools: ToolsService) { 
      
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.pedido = JSON.parse(params["pedido"]);
      this.loadTracking();
      this.loadInfo();
    });
  }
  
  ionViewWillEnter(){
    
  }

  async reenviar(){

    if(this.configuracion.getCodigoActivo()!=undefined){
      this.tools.showNotification("Error", "Hay una gestión activa","Ok");
    }else{
    
      const alert = await this.alertController.create({
        header: '¿Realmente desea crear otro pedido igual?',
        subHeader: 'El cliente de este pedido se pondrá en gestión',
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
          this.tools.presentLoading("Creando duplicado...")
          var response = await this.pedidoService.Reenviar(this.pedido.ped_id);
          this.tools.destroyLoading();
          if(response.ok){
            this.tools.showNotification("Exito!", "Pedido creado","Ok");
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

  async loadInfo(){
    await this.loadDetalle();
    this.loadFactura();
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

  
  async loadFactura(){
    var response = await this.pedidoService.getFactura(this.pedido.ped_no);
    if(response){
      if(response.ok){
        let resultado = response.registros;
        this.facturado = resultado["facturado"];
        this.facturaEncabezado = resultado["factura"];
        this.facturaDetalle = resultado["detalle"];

        if(this.facturado){
          this.pedido.vmo_pedido_detalle.forEach( p => {
            p["facturado"] =  this.encontrarFacturado(p.pde_producto);
          });
        }
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  
  async loadTracking(){
    this.tracking = [];
    var response = await this.pedidoService.getTracking(this.pedido.ped_no);
    if(response){
      if(response.ok){
        this.tracking = response.registros;
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.loading.detalle = false;
  }

  filterTracking(){
    return this.tracking.filter(f => f.Estado!="TOTAL");
  }

  filterTotalServicio(){
    var encontrado = this.tracking.filter(f => f.Estado=="TOTAL")[0];
    if(encontrado!=undefined){
      return encontrado.Dias+" días "+this.pad(encontrado.Horas,2)+":"+this.pad(encontrado.Minutos,2);
    }else{
      return "";
    }
  }
  pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

  async atras(){
    this.navCtrl.navigateBack(['/tabs/tab4']);
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

  
  

  encontrarFacturado(sku){
    let cantidad = 0;
    if(this.facturado){
      let item = this.facturaDetalle.find( f => f.codigo==sku);
      if(item!=undefined){
        cantidad = item.cantidad;
      }
    }
    return cantidad;
  }

  totalUnidadesFacturadas(){
    if(this.facturado){
      return this.facturaDetalle.reduce((accumulator, obj) => {
        return accumulator + obj.cantidad;
      }, 0);
    }else{
      return 0;
    }
  }

  
  totalMontoFacturado(){
    if(this.facturado){
      return this.facturaDetalle.reduce((accumulator, obj) => {
        return accumulator + obj.monto;
      }, 0);
    }else{
      return 0;
    }
  }
  
  totalMontoIVAFacturado(){
    if(this.facturado){
      return this.facturaDetalle.reduce((accumulator, obj) => {
        return accumulator + obj.monto_iva;
      }, 0);
    }else{
      return 0;
    }
  }
  
}