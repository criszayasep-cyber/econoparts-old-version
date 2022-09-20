import { Injectable } from '@angular/core';
import { HttpService } from './default/http.service';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';

@Injectable({
  providedIn: 'root'
})
export class KPIService {
  
  private url = "gestion-comercial/kpi/";

  constructor(private httpService: HttpService) { }

  async getAll(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}get-all`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin getAll

}