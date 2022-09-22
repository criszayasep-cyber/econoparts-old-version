import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { ConfiguracionService } from '../../services/default/configuracion.service';
import { ProductoService } from '../../services/producto.service';
import { ToolsService } from '../../services/default/tools.service';
import { AplicacionEntity } from '../../entity/aplicaciones-entity';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.page.html',
  styleUrls: ['./producto-detalle.page.scss'],
})
export class ProductoDetallePage implements OnInit { 

  loading = false;
  segment = "info";
  imagen = "/assets/imagen_no_disponible.png";
  producto: any;
  aplicaciones: Array<AplicacionEntity> = [];

  constructor(private navParams:NavParams, 
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public configuracion: ConfiguracionService, 
    public navCtrl: NavController,
    private productoService: ProductoService,
    private tools: ToolsService) { }

  
  ngOnInit() {
    this.producto = this.navParams.get("producto");

    if(this.producto.imagen!=null && this.producto.imagen.length>10){
      this.imagen = 'data:image/jpeg;base64,'+this.producto.imagen
    }
  }
  
  async segmentChanged(event){
    switch(event.detail.value){
      case "aplicaciones":
        if(this.aplicaciones.length==0){
          this.loading = true;
          let dataPost = {
            busqueda: this.producto.pro_number
          }
          var respose = await this.productoService.aplicaciones(dataPost);
          this.loading = false;
          if(respose.ok){
            this.aplicaciones = respose.registros;
          }else{
            this.tools.showNotification("Error", respose.mensaje,"Ok");
          }
        }
        break;
    }
  }
  
  close(){
    this.modalController.dismiss();
  }
}
