import { Injectable } from '@angular/core';
import { HttpService } from './default/http.service';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';

@Injectable({
  providedIn: 'root'
})
export class VentaPerdidaService {
  
  private url = "gestion-comercial/venta-perdida/";

  constructor(private httpService: HttpService) { }

  
  async guardar(data){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "post", `${this.url}guardar`, data);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin guardar
  


}