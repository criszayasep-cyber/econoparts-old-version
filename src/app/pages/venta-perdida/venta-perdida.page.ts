import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-venta-perdida',
  templateUrl: './venta-perdida.page.html',
  styleUrls: ['./venta-perdida.page.scss'],
})
export class VentaPerdidaPage implements OnInit {

  producto:any

  constructor(private navParams:NavParams, 
    private modalController: ModalController) {
    }

  ngOnInit() {
    this.producto = {pro_number: "", pro_descripcion: ""}
    this.producto.tipo_venta = "Producto no comercializable"
    if(this.navParams.get("producto")!=null){
      this.producto = this.navParams.get("producto");
      this.producto.tipo_venta = "Inexistencia"
    }
    this.producto.cantidad = 1
    this.producto.marca = ""
    this.producto.modelo = ""
    this.producto.anio = ""
    this.producto.chasis = ""
    this.producto.motor = ""
    this.producto.grupo = ""
    
  }
  close(){
    this.modalController.dismiss();
  }

}
