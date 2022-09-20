import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResultadoHttpResponse } from '../../entity/default/resultado-http-response';
import { ConfiguracionService } from './configuracion.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {  

  constructor(
    private http:HttpClient,
    private configService: ConfiguracionService) { }
  

  async execute(loading: boolean, endpoint: string,tipo, url, datos){
    let rsp = new ResultadoHttpResponse();
    let base = environment.protocolo+"://"+environment.ip+"/";

    /*switch(endpoint){
      case "CAS": base = ConfiguracionService.casIP; break;
      case "BACKEND": base = ConfiguracionService.ip; break;
    }*/

    const params = url.split("?")[1];
    if(params!=null){
      url += "&hl="+loading;
    }else{
      url += "?hl="+loading;
    }

    switch(tipo){
      case "post":
          await this.http.post(base+url, datos, ConfiguracionService.httpOptions).toPromise().then(
            (data: any) =>{
              rsp.data = data;
            }).catch((err: HttpErrorResponse) => { 
              rsp.msj = err.statusText;
              rsp.codigo = err.status;
              rsp.ok = false;
              }
            );
        break;
      case "get":
        await this.http.get(base+url, ConfiguracionService.httpOptions).toPromise().then(
          (data: any) =>{
            rsp.data = data;
          }).catch((err: HttpErrorResponse) => { 
            rsp.msj = err.statusText;
            rsp.codigo = err.status;
            rsp.ok = false;
            }
          );
        break;
      case "delete":
        await this.http.get(base+url, ConfiguracionService.httpOptions).toPromise().then(
          (data: any) =>{
            rsp.data = data;
          }).catch((err: HttpErrorResponse) => { 
            rsp.msj = err.statusText;
            rsp.codigo = err.status;
            rsp.ok = false;
            }
          );
        break;
    }

    if(!rsp.ok){
      if(rsp.msj=="Unknown Error"){
        rsp.msj = "Error de red o el servidor no se encuentra accesible.";
      }
    }

    return rsp;
    
  }

}
