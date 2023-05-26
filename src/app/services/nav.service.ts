import { Injectable } from '@angular/core';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';
import { HttpService } from './default/http.service';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  
  private url = "gestion-comercial/nav/catalogo/";

  constructor(private httpService: HttpService) { }

  async getSucursales(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}sucursales`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getSucursales

  async getRutas(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}rutas`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getRutas


  

  async getBackupPromociones(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup/promociones`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getBackupPromociones

  
  async getBackupPromocionesDetalle(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup/promociones-detalle`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getBackupPromocionesDetalle

  
  async getBackupEscalas(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup/escalas`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getBackupEscalas

  
  async getBackupConversiones(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup/conversiones`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getBackupConversiones

  
  async getBackupListaPrecios(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup/lista-precios`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity(); 
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getBackupListaPrecios


}
