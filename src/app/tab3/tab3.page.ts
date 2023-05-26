import { Component, OnInit, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, IonSegment, IonSlides, AlertController, IonSelect, IonItemSliding, LoadingController, PickerController, ModalController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { ClienteEntity } from '../entity/cliente-entity';
import { FilterEntity } from '../entity/default/filter-entity';
import { ClienteService } from '../services/cliente.service';
import { ToolsService } from '../services/default/tools.service';
import { RutaService } from '../services/ruta.service';
import { DbService } from '../services/default/db.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page  implements OnInit{

  total = 0;
  registros = -1;
  clientes: Array<ClienteEntity> = [];
  loading = false;
  filtros: FilterEntity;

  constructor(
    public config: ConfiguracionService,
    public navCtrl: NavController,
    private clienteService: ClienteService,
    private rutaSerivce: RutaService,
    private db: DbService,
    private authService: AuthService,
    private tools: ToolsService) {
      this.filtros = new FilterEntity(ConfiguracionService.paginacion);
    }
  
  ngOnInit(){

    /*if(window.localStorage["categorias"]){
      this.cargado = true;
      this.categorias = JSON.parse(window.localStorage["categorias"]);
    }*/
    
  }

  paginar(pag): void{
    this.tools.paginar(this.filtros,pag);
    this.config.setPaginacion(pag.pageSize);
    this.buscar(false);
  }

  async add(item:ClienteEntity, indice){

    var r = await this.tools.showConfirm("¿Realmente desea agregar al cliente \""+item.nombre_social+"\" a la gestión de este día?", "", "");
    if(r=="confirm"){
      //Agregar a la lista
      
      if(this.config.ConfiguracionService.online){
        this.tools.presentLoading("Espere un momento...");
        var response = await this.rutaSerivce.addGestionToday(item.codigo);
        this.tools.destroyLoading();
        if(response.ok){
          this.clientes.splice(indice,1);
          let navigationExtras: NavigationExtras = {
            queryParams: {
                actualizarLista: true
            }
          };
          this.navCtrl.navigateForward(['tabs/tab1'], navigationExtras);
        }else{
          this.tools.showNotification("Error", response.mensaje,"Ok");
        } 
      }else{
        var id = new Date().getTime()
        let data = [id, 
          this.authService.getCodigoVendedor(), 
          new Date(), 
          item.codigo, 
          "AGREGADO"];
        this.db.insert('INSERT INTO venta_movil_gestiones(rde_id,rde_vendedor_codigo,rde_fecha,rde_cliente_codigo,rde_tipo) VALUES (?,?,?,?,?)', data)
        
        this.clientes.splice(indice,1);
        let navigationExtras: NavigationExtras = {
          queryParams: {
              actualizarLista: true
          }
        };
        this.navCtrl.navigateForward(['tabs/tab1'], navigationExtras);
      }
    }
  }
  

  limpiar(){
    this.registros = -1;
    this.clientes = [];
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
  }

  /*async buscar(primera){
    this.filtros.primera = primera;
    if(primera){
      this.total = 0;
      this.filtros.pageIndex = 0;
      this.filtros.offset = 0;
    }else{
      this.filtros.total = this.total;
    }

    this.registros = -1;
    this.clientes = [];
    this.loading = true;
    var http = await this.clienteService.filter(this.filtros);
    if(http.ok){
        this.clientes = http.registros;
        this.registros = this.clientes.length;
        this.total = http.total;
    }else{
      this.tools.showNotification("Error", http.mensaje,"Ok");
    }
    this.loading = false;
  }*/

  async buscar(primera){
    this.filtros.primera = primera;
    if(primera){
      this.total = 0;
      this.filtros.pageIndex = 0;
      this.filtros.offset = 0;
    }else{
      this.filtros.total = this.total;
    }

    this.registros = -1;
    this.clientes = [];
    this.loading = true;

    var where = "";

    var codVendedor = this.authService.getCodigoVendedor()
    if(codVendedor!="138"){
      where = " vendedor='"+codVendedor+"' ";
    }
    
    if(!this.tools.isNullOrEmpty(this.filtros.cliente)){
      where += (where.length>0?" and ": "") + ` codigo='${this.filtros.cliente}' `;
    }
    if(!this.tools.isNullOrEmpty(this.filtros.razon_social)){
      where += (where.length>0?" and ": "") + ` UPPER(nombre_social) LIKE '%${this.filtros.razon_social}%' `;
    }
    if(!this.tools.isNullOrEmpty(this.filtros.nombre_comercial)){
      where += (where.length>0?" and ": "") + ` UPPER(nombre_comercial) LIKE '%${this.filtros.nombre_comercial}%' `;
    }
    if(!this.tools.isNullOrEmpty(this.filtros.registro)){
      where += (where.length>0?" and ": "") + ` nrc='${this.filtros.registro}' `;
    }

    if(where.length>0){
      var query = `SELECT * 
                  FROM venta_movil_clientes 
                  WHERE ${where} 
                  ORDER BY nombre_social ASC 
                  LIMIT ${this.filtros.offset}, ${this.filtros.items}`;
      //console.log(query)
      var cls = await this.db.select(query);

      
      this.clientes = cls;
      this.registros = cls.length;
      if(this.filtros.primera){
        var count = await this.db.select("SELECT count(*) total FROM venta_movil_clientes WHERE "+where);
        this.total = count[0]["total"];
      }else{
        this.total = this.filtros.total;
      }
    }

    this.loading = false;
  }


  onEnter(){
    this.buscar(true);
  }

  onInputClear(evento){
    console.log(evento)
  }

  show(item:ClienteEntity){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          cliente: JSON.stringify(item)
      }
    };
    this.navCtrl.navigateForward(['tabs/tab3/detalle'], navigationExtras);
  }

}
