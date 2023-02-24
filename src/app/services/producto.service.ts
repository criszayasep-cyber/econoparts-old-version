import { Injectable } from '@angular/core';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';
import { HttpService } from './default/http.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = "gestion-comercial/producto/";

  constructor(private httpService: HttpService) { }

  async filter(entity){
    const status = await Network.getStatus();
    if(status.connected){
      let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}filtrar`, entity);
      if(httpResponse.ok){
        return httpResponse.data;
      }else{
        let error  = new  ResultadoHttpEntity();
        error.ok = false;
        error.mensaje = httpResponse.msj;
        
        return error;
      }
    }else{
      
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = "No esta conectado a internet";
      
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


}
