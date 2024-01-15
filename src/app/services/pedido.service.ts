import { Injectable } from '@angular/core';
import { HttpService } from './default/http.service';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  private url = "gestion-comercial/pedido/";

  constructor(private httpService: HttpService) { }

  async addProducto(data){


    
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}add-producto`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin addProducto

  async addProductoPromocion(data,pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}add-producto-promocion?pedido=${pedido}`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin addProductoPromocion

  
  async removeProducto(pedido, producto){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}remove-producto/${pedido}/${producto}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getAll

  
  async filter(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}filtrar`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin filter

  
  async getDetalle(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}detalle/${pedido}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getDetalle

  
  async getFactura(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}facturacion-informacion/${pedido}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getFactura

  
  async updatePedido(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}update`, pedido);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin updatePedido

  
  async updatePedidoDetalle(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}update-detalle`, pedido);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin updatePedidoDetalle

  
  async facturar(pedido, gestion){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}facturar?gestion=${gestion}`, pedido);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin facturar

  
  async facturarCotizacion(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}facturar-cotizacion`, pedido);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin facturarCotizacion

  
  async cotizar(pedido, gestion, tipo){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}cotizar?gestion=${gestion}&tipo=${tipo}`, pedido);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin cotizar
  
  async cotizarReenviar(pedido, tipo){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}cotizar-reenviar?tipo=${tipo}`, pedido);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin cotizarReenviar



  
  async getFacturaPendiente(numero){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}facturacion-pendiente-detalle/${numero}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getFacturaPendiente


  
  async getFacturaPendienteSuc(numero){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}facturacion-pendiente-suc-detalle/${numero}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getFacturaPendienteSuc

  
  async getTracking(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}tracking/${pedido}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getTracking


  
  
  async Reenviar(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}reenviar/${pedido}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin Reenviar
  
  async EditarCotizacion(pedido){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}editar-cotizacion/${pedido}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin EditarCotizacion



}