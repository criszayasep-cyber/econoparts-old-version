import { Injectable } from '@angular/core';
import { HttpService } from './default/http.service';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';

@Injectable({
  providedIn: 'root'
})
export class CobrosService {
  
  private url = "gestion-comercial/cobros/";

  constructor(private httpService: HttpService) { }

  async sendCobro(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}G-cobro`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin sendCobro

}