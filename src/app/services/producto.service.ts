import { Injectable } from '@angular/core';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';
import { HttpService } from './default/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = "gestion-comercial/producto/";

  constructor(private httpService: HttpService) { }

  async filter(entity){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}filtrar`, entity);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin filter

  async equivalentes(codigo){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}equivalentes`, codigo);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin equivalentes

  

  async aplicaciones(codigo){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}aplicaciones`, codigo);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin aplicaciones

  


  async combos(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}combos`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin combos

  async backup(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin backup

  async aplicacionesBackup(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}aplicaciones-backup`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin aplicacionesBackup

  async equivalentesBackup(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}equivalentes-backup`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin equivalentesBackup

  
  async FiltrarPrecioExistencia(entity){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}filtrar-precio-existencia`, entity);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin FiltrarPrecioExistencia

  async inventarioPrecioBackup(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup-precio-existencia`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin inventarioPrecioBackup
  

  async imagenesBackup(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}backup-images`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin imagenesBackup
  

  async findImage(codigo:string){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}find-image/${codigo}`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin findImage




}
