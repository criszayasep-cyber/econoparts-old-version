import { Injectable } from '@angular/core';
import { HttpService } from './default/http.service';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  
  private url = "gestion-comercial/ruta/";

  constructor(private httpService: HttpService) { }

  async getToday(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}get-today`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getToday

  
  async addGestionToday(cliente){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}add-gestion-today/${cliente}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin addGestionToday

  
  async fechasDisponibles(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}fechas-disponibles`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin fechasDisponibles
  
  async updateFecha(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}nueva-fecha`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin updateFecha
  
  async noVenta(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}no-venta`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin noVenta
  
  async iniciarGestion(id){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}iniciar-gestion/${id}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin iniciarGestion
  
  async getGestionActiva(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}get-gestion-activa`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getGestionActiva


}