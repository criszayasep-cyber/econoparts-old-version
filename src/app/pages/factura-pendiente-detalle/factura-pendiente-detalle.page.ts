import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolsService } from 'src/app/services/default/tools.service';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-factura-pendiente-detalle',
  templateUrl: './factura-pendiente-detalle.page.html',
  styleUrls: ['./factura-pendiente-detalle.page.scss'],
})
export class FacturaPendienteDetallePage implements OnInit {

  factura: string;
  productos: any[]
  loading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private pedidoService: PedidoService,
    private tools: ToolsService) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.factura = params["documento"];
      if(params["subTipo"]==""){
        this.loadFacturaSuc()
      }else{
        this.loadFacturaMayoreo()
      }
    });
  }

  async loadFacturaMayoreo(){
    var response = await this.pedidoService.getFacturaPendiente(this.factura);
    if(response){
      if(response.ok){
        let resultado = response.registros;
        this.productos = resultado["detalle"];
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  async loadFacturaSuc(){
    var response = await this.pedidoService.getFacturaPendienteSuc(this.factura);
    if(response){
      if(response.ok){
        let resultado = response.registros;
        this.productos = resultado["detalle"];
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }


  
  totalMontoFacturado(){
      return this.productos.reduce((accumulator, obj) => {
        return accumulator + obj.monto;
      }, 0);
  }
  
  totalMontoIVAFacturado(){
      return this.productos.reduce((accumulator, obj) => {
        return accumulator + obj.monto_iva;
      }, 0);
  }

  

  totalUnidades(){
    if(this.productos?.length>0){
      return this.productos.reduce((accumulator, obj) => {
        return accumulator + (obj.cantidad*1);
      }, 0);
    }else{
      return 0;
    }
  }
  
  totalMonto(){
    if(this.productos?.length>0){
      return this.productos.reduce((accumulator, obj) => {
        return accumulator + (obj.precio*obj.cantidad);
      }, 0);
    }else{
      return 0;
    }
  }
  
  totalMontoIVA(){
    if(this.productos?.length>0){
      return this.productos.reduce((accumulator, obj) => {
        return accumulator + ((obj.precio*1.13)*obj.cantidad);
      }, 0);
    }else{
      return 0;
    }
  }

}
