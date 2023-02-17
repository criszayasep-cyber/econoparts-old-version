import { Injectable } from '@angular/core';
import { ResultadoHttpEntity } from '../entity/default/resultado-http-entity';
import { HttpService } from './default/http.service';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  private url = "gestion-comercial/promociones/";

  constructor(private httpService: HttpService) { }

  async activas(){
    let httpResponse = await this.httpService.execute(false, "BACKEND", "get", `${this.url}activas`, null);
    if(httpResponse.ok){
      return httpResponse.data;
    }else{
      let error  = new  ResultadoHttpEntity();
      error.ok = false;
      error.mensaje = httpResponse.msj;
      
      return error;
    }
  }//fin activas
}
