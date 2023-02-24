import { Injectable } from '@angular/core';
import { ToolsService } from './tools.service';
import { HttpService } from './http.service';
import { ResultadoHttpEntity } from 'src/app/entity/default/resultado-http-entity';

import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class CASService {


  private url = "gestion-comercial/login/";

  constructor(private httpService: HttpService) { 
  }
  
  
  async login(data){
    const status = await Network.getStatus();
    if(status.connected){
      let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}authenticate`, data);
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
  }//fin login


  async recuperarCuenta(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}recoveryAccount`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin recuperarCuenta
  
}
