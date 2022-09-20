import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GestionDiariaEntity } from 'src/app/entity/gestion-diaria-entity';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  
  
  public static actualizarTab1 = window.localStorage["actualizarTab1"]?JSON.parse(window.localStorage["actualizarTab1"]):false;
  public static gestionDiaria: GestionDiariaEntity = window.localStorage["gestionDiaria"]?JSON.parse(window.localStorage["gestionDiaria"]):new GestionDiariaEntity();
  public static clienteSelected = window.localStorage["gestionDiaria"]?true:false;

  public static paginacion = 25;
  public static bearer = window.localStorage["token"]?window.localStorage["token"]:null;
  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  

  constructor() {
    
  }

  public static getBearer(){
    return ConfiguracionService.bearer;
  }

  public static setSelectedCliente(item, pedido){

    this.clienteSelected = true;
    this.gestionDiaria = new GestionDiariaEntity();
    this.gestionDiaria.pedido = pedido;
    this.gestionDiaria.ruta = item.ruta;
    this.gestionDiaria.cliente = item.cliente;
    
    window.localStorage["gestionDiaria"] = JSON.stringify(this.gestionDiaria);
  }
  
  public static setGestionActiva(data){
    this.gestionDiaria = data;
    this.clienteSelected = true;
    window.localStorage["gestionDiaria"] = JSON.stringify(data);
  }

  public static setUnselectCliente(actualizar: boolean){
    this.clienteSelected = false;
    this.gestionDiaria = new GestionDiariaEntity();
    window.localStorage.removeItem('gestionDiaria');
    
    ConfiguracionService.actualizarTab1 = actualizar;
    window.localStorage["actualizarTab1"] = actualizar;
  }

  getClienteNombre(){
    return ConfiguracionService.gestionDiaria.cliente?.nombre_social;
  }

  getCodigoActivo(){
    return ConfiguracionService.gestionDiaria.cliente?.codigo;
  }

  getGestionActiva(){
    return ConfiguracionService.gestionDiaria.ruta.rde_id;
  }

  getEstatusGestion(){
    return ConfiguracionService.clienteSelected;
  }

  /*addProductoPedido(producto){
    let index = this.pedidos.findIndex( f => f.cliente.codigo==this.clienteSeleccionado.codigo)
    this.pedidos[index].productos.push(producto);
  }

  getpedidos(){
    return this.pedidos;
  }

  removePedidoActual(){
    let index = this.pedidos.findIndex( f => f.cliente.codigo==this.clienteSeleccionado.codigo)
    this.pedidos.splice(index, 1);
  }*/
}
