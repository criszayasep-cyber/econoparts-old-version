import { Injectable } from '@angular/core';
import { HttpService } from './default/http.service';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private url = "gestion-comercial/cliente/";

  constructor(private httpService: HttpService) { }

  async getFacturasPendientes(codigo: string){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}facturas-pendientes/${codigo}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getFacturasPendientes

  

  async filter(entity){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}filter`, entity);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin filter

  

  async getByID(cliente){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}get-by-id/${cliente}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getByID

  
  async sendEstadoCuenta(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}send-estado-cuenta`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin sendEstadoCuenta

  async getNotasCreidto(codigo: string){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}notas-credito-relacionadas/${codigo}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getNotasCreidto

  

  async ReportarDocumento(entity){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}reportar-documento`, entity);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin ReportarDocumento

  async Backup(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin Backup


  

}