import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteEntity } from '../entity/cliente-entity';
import { FacturaPendienteEntity } from '../entity/factura-pendiente';
import { ClienteService } from '../services/cliente.service';
import { ToolsService } from '../services/default/tools.service';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.page.html',
  styleUrls: ['./cliente-detalle.page.scss'],
})
export class ClienteDetallePage implements OnInit {

  registros = -1;
  segment = "first";
  cliente: ClienteEntity;
  facturasPendientes: Array<FacturaPendienteEntity> = [];
  loading = {
    facturas: false
  }

  constructor(
    private tools: ToolsService,
    private activeRoute: ActivatedRoute,
    private clienteService: ClienteService) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.cliente  = JSON.parse(params["cliente"]);
    });
  }

  ionViewWillEnter(){
    this.facturasPendientes = [];
    this.segment = "first";
    this.registros = -1;
  }

  async segmentChanged(event){
    this.registros = -1;
    switch(event.detail.value){
      case "first":
        break;
      case "second":
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
        break;
    }
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

}
