import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';
import { DbService } from 'src/app/services/default/db.service';
import { ToolsService } from 'src/app/services/default/tools.service';
import { VentaPerdidaService } from 'src/app/services/venta-perdida.service';


@Component({
  selector: 'app-venta-perdida',
  templateUrl: './venta-perdida.page.html',
  styleUrls: ['./venta-perdida.page.scss'],
})
export class VentaPerdidaPage implements OnInit {

  producto:any

  constructor(private navParams:NavParams, 
    public configuracion: ConfiguracionService,
    private modalController: ModalController,
    private db: DbService,
    private authService: AuthService,
    private ventaPerdidaService: VentaPerdidaService,
    private tools: ToolsService) {
    }

  ngOnInit() {
    this.producto = {vpe_sku: "", vpe_descripcion: ""}
    this.producto.vpe_tipo = "Producto no comercializable"
    if(this.navParams.get("producto")!=null){
      var prod = this.navParams.get("producto");
      this.producto.vpe_sku = prod.pro_number;
      this.producto.vpe_descripcion = prod.pro_descripcion;
      this.producto.vpe_tipo = "Inexistencia"
    }
    this.producto.vpe_cantidad = 1
    this.producto.vpe_marca = ""
    this.producto.vpe_modelo = ""
    this.producto.vpe_anio = ""
    this.producto.vpe_chasis = ""
    this.producto.vpe_motor = ""
    this.producto.vpe_grupo = ""
    
    this.producto.vpe_vendedor = this.authService.getCodigoVendedor()
    this.producto.vpe_fecha = this.tools.dateFormatDB()
  }
  
  async guardar(){
    console.log(this.producto)
    if(this.configuracion.ConfiguracionService.online){
      var http = await this.ventaPerdidaService.guardar(this.producto);
      if(http.ok){
        this.modalController.dismiss();
      }else{
        this.tools.showNotification("Error", http.mensaje,"Ok");
      }
    }else{
      var id = new Date().getTime()
      let data = [id,
        this.producto.vpe_fecha,
        this.producto.vpe_vendedor,
        this.producto.vpe_tipo,
        this.producto.vpe_sku,
        this.producto.descripcion,
        this.producto.vpe_cantidad,
        this.producto.vpe_marca,
        this.producto.vpe_modelo,
        this.producto.vpe_anio,
        this.producto.vpe_chasis,
        this.producto.vpe_motor,
        this.producto.vpe_grupo
      ];
      this.db.insert('INSERT INTO venta_movil_venta_perdida(vpe_id,vpe_fecha,vpe_vendedor,vpe_tipo,vpe_sku,vpe_descripcion,vpe_cantidad,vpe_marca,vpe_modelo,vpe_anio,vpe_chasis,vpe_motor,vpe_grupo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', data)
      this.modalController.dismiss();
    }
  }
  close(){
    this.modalController.dismiss();
  }

}
