import { Injectable } from '@angular/core';
import decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfiguracionService } from '../default/configuracion.service';
//import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isTimer = false;

  constructor(public helper: JwtHelperService,
    private router: Router) { }

  public isAuthenticated(): boolean {
    var valid = !this.helper.isTokenExpired(ConfiguracionService.bearer);
    if(valid){
      //this.setTimeOut();
    }
    return valid;
  }

  
  public ExsetTimeOut(){
    if(!this.isTimer){
      /*const conversor = 0.0000115741;
      var user = this.helper.decodeToken(localStorage.getItem("token"));
      var exp = user["exp"];
      var actual = Math.round((new Date()).getTime() / 1000);
      var total = exp-actual;
      var timer = total*1000;

      var calc = (total*conversor);
      
      //this.cookieService.set( ConfiguracionService.cookieSys, actual+'', {expires: calc, sameSite: 'Lax'});
      
      setTimeout(() => {
        this.sessionEnd();
      }, timer);

      this.isTimer = true;*/
      //this.httpService.execute(true, "BACKEND", "get", `welcome/api`, null);
    }
  }

  
  public sessionEnd(){
    //this.dialogRef.closeAll();
    //this.cookieService.delete(ConfiguracionService.cookieSys);
    ConfiguracionService.bearer = null;
    window.localStorage["token"] = null;
    window.localStorage.removeItem('token');

    this.router.navigate(['login']);
  }

  public isOpcionInOperaciones(op: string){
    
    const tokenPayload = decode(ConfiguracionService.bearer);
    var roles = tokenPayload["role"];
    
    if(roles instanceof Array){
      return (roles.find(f => f==op) || roles.find(f => f=="ROOT"));
    }else{
      return (roles == op || roles =="ROOT");
    }

  }

  getUser(){
    return this.getClaveToken("nombres")+" "+this.getClaveToken("apellidos");
  }

  getClaveToken(key){
    if(localStorage.getItem("token")!=null){
      var user = this.helper.decodeToken(localStorage.getItem("token"));
      return user[key];
    }else{
      return null;
    }
  }

  public getSucursal(){
    return this.getClaveToken("sucursal");
  }

  public getNombre(){
    return this.getClaveToken("nombre");
  }

  public getCodigoVendedor(){
    return this.getClaveToken("codigoVendedor");
  }

  public getUsername(){
    return this.getClaveToken("user");
  }

  public getFoto(){
    return "/assets/imgs/users/user.svg";
  }

  public decode(){
    console.log( this.helper.decodeToken(ConfiguracionService.bearer))
  }

  public expired(){
    console.log(this.helper.isTokenExpired(ConfiguracionService.bearer))
  }

  public dexpired(){
    console.log(this.helper.getTokenExpirationDate(ConfiguracionService.bearer))
  }

  public role(){
    const tokenPayload = decode(ConfiguracionService.bearer);
    console.log(tokenPayload)
  }
}
