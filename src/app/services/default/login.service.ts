import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public nombre: any = window.localStorage["nombre"] 
  public correo: any = window.localStorage["correo"]
  public bearer: any = window.localStorage["token"]
  public exp: any = window.localStorage["exp"]
  public operaciones: any = JSON.parse(window.localStorage["operaciones"]  || '[]');

  constructor(
    public navCtrl: NavController) { }
  
  validateUser(){
    if(this.bearer === undefined || this.bearer.length === 0){
      return false;
    }else{
      return true;
    }
  }

  logout(){
    window.localStorage.removeItem('token');
    this.setDatos();
    this.navCtrl.navigateForward(['/login']);
  }

  setDatos(){
    this.nombre = window.localStorage["nombre"]
    this.correo = window.localStorage["correo"]
    this.bearer = window.localStorage["token"]
    this.exp = window.localStorage["exp"]
    this.operaciones = JSON.parse(window.localStorage["operaciones"]  || '[]');

    this.setCookieSTJ();
  }

  destroySesion(){
    this.bearer = window.localStorage["token"]
  }

  setCookieSTJ(){
    
  }

  
  isOpcionInOperaciones(opcion){
    //this.users.filter(u => u.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    //return this.usuario.filter(u => u.ope_codigo==opcion);
    if(this.operaciones){
      return this.operaciones.some(function(el){ return el.ope_codigo===opcion || el.ope_codigo==="ROOT"});
    }
  }
}
