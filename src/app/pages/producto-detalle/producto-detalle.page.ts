import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { ConfiguracionService } from '../../services/default/configuracion.service';
import { ProductoService } from '../../services/producto.service';
import { ToolsService } from '../../services/default/tools.service';
import { AplicacionEntity } from '../../entity/aplicaciones-entity';
import { DbService } from 'src/app/services/default/db.service';

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
    private db: DbService,
    private sanitizer: DomSanitizer,
    public configuracion: ConfiguracionService, 
    public navCtrl: NavController,
    private productoService: ProductoService,
    private tools: ToolsService) { }

  
  ngOnInit() {
    this.producto = this.navParams.get("producto");

    this.loadImage();
  }

  async loadImage(){
    var image: any;

    if(ConfiguracionService.online){
      var http = await this.productoService.findImage(this.producto.pro_number);
      if(http.ok){
        if(http.registros!=null && http.registros.length>10){
          image = http.registros;
        }
      }
    }

    if(image!=undefined && image.length>0){
      this.imagen = 'data:image/jpeg;base64,'+image;
    }
  }
  
  async segmentChanged(event){
    switch(event.detail.value){
      case "aplicaciones":
        /*if(this.aplicaciones.length==0){
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
        }*/
        this.aplicaciones = await this.db.select("SELECT * FROM venta_movil_aplicaciones WHERE no='"+this.producto.pro_number+"' ORDER BY aplicacion ASC");
        break;
    }
  }
  
  close(){
    this.modalController.dismiss();
  }
}
