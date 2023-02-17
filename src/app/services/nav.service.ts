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

}
