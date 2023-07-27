import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observer, Subject } from 'rxjs';
import { ToolsService } from './tools.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { environment } from 'src/environments/environment';
import { ProductoService } from '../producto.service';
import { AuthService } from '../auth/auth.service';
import { ClienteService } from '../cliente.service';
import { ConfiguracionService } from './configuracion.service';
import { NavService } from '../nav.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly database_name: string = "gestion_comercial.db";
  readonly table_name: string = "myfreakytable";

  name_model: string = "";
  row_data: any = [];

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

	public procesosTotales: Subject<number> = new Subject();
	public procesosOk: number = 0;
  public showIconLoading = false;
  public clientesEnGestion: Subject<number> = new Subject();

  constructor(
    private prodService: ProductoService,
    private customerService: ClienteService,
    private navService: NavService,
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    public auth: AuthService,
    private tools: ToolsService) { 
      this.platform.ready().then(() => {
        //Verificar si esta logueado
        if (this.auth.isAuthenticated()) {
          this.createDB();
        }
      }).catch(error => {
        console.log(error);
      })
    }
  
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.storage = db;
      this.loadChange();
      //alert('gestion_comercial Database Created!');
    })
    .catch(e => {
      //alert("error " + JSON.stringify(e))
      this.tools.showNotification("Error!", "No se pudo conectar a la base local: "+JSON.stringify(e),"Ok");
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }
  
  async select(query){
    let items = [];
    try{
      await this.storage.executeSql(query, []).then(res => {
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) { 
            items.push(res.rows.item(i));
          }
        }
      });
    }catch(e){
      this.tools.showNotification("Error!", JSON.stringify(e),"Ok");
    }
    
    return items;
  }
  insert(query, params){
    this.storage.executeSql(query, params)
    .then(res => {
    });
  }
  async update(query, params){
    await this.storage.executeSql(query, params)
    .then(data => {
    })
  }
  async delete(table){
    await this.storage.executeSql("DELETE FROM "+table, [])
    .then(data => {
    })
  }

  updateMassive(json){
    this.sqlPorter.importJsonToDb(this.storage, json)
    .then(_ => {
      //Ok
    })
    .catch(e => this.tools.showNotification("Error!", "No se pudo actualizar la información: "+JSON.stringify(e),"Ok")
    );
  }

  loadChange(){
    this.httpClient.get(
      'assets/files/dump.sql', 
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.validateVersion();
          //if(ConfiguracionService.online){
            this.syncLocalCopy(false, true, false);
          //}
          this.isDbReady.next(true);
        })
        .catch(error => console.error("ERROR => ",error));
    });
  }

  syncLocalCopy(omitirFecha, showNotificacion, sinConexion = false){
    this.procesosOk = 0;
    //En total son 6 copias 

    //Verificamos la ultima fecha de actualización
    var ultimaFecha = window.localStorage["fechaActualizacion"]?window.localStorage["fechaActualizacion"]:null;
    var hoy = new Date().toLocaleDateString('en-GB');

    //Se valida, si se si sincroniza la información del servidor, por defecto esto solo se debe de sincronizar una vez al día
    if(omitirFecha || ultimaFecha==null || ultimaFecha!=hoy){
      
      if(showNotificacion){
        this.showIconLoading = true;
        let count = 0;
        this.procesosTotales.subscribe(s => {
          count += s
          if(count==6){
            this.showIconLoading = false;
          }
        })
      }
      
      this.actualizarCombos(showNotificacion);
      this.actualizarProductos(showNotificacion);
      this.actualizarInventarioPrecio(showNotificacion);
      this.actualizarAplicaciones(showNotificacion);
      this.actualizarEquivalentes(showNotificacion);
      //this.actualizarImagenes();
      this.actualizarClientes(showNotificacion);

      if(sinConexion){
        this.backupPromociones(showNotificacion);
        this.backupPromocionesDetalle(showNotificacion);
        this.backupEscalas(showNotificacion);
        this.backupConversiones(showNotificacion);
        this.backupListaPrecios(showNotificacion);
      }
      window.localStorage["fechaActualizacion"] = hoy;
    }
  }

  async validateVersion(){
    var rows = await this.select('SELECT * FROM versiones_tracking');
    if (rows.length > 0) {
      if(rows[0].id!=environment.version){
        let data = [environment.version, new Date()];
        this.update(`UPDATE versiones_tracking SET id=?, fecha=? WHERE id=${environment.version}`,data)
        //Si hubiese que correr alguna actualización
      }
    }else{
      let data = [environment.version, new Date()];
      this.insert('INSERT INTO versiones_tracking VALUES (?, ?)', data)
    }
  }

  async actualizarTrackingTable(tabla, registros){
    let data = [new Date(), registros];
    await this.update(`UPDATE tracking_tables SET fecha=?, registros=? WHERE tabla='${tabla}'`,data)

    /*var rows = await this.select(`SELECT * FROM tracking_tables WHERE tabla='${tabla}'`);
    if (rows.length > 0) {
      let data = [new Date(), registros];
      this.update(`UPDATE tracking_tables SET fecha=?, registros=? WHERE tabla=${tabla}`,data)
    }else{
      let data = [tabla, new Date(), registros];
      this.insert('INSERT INTO tracking_tables VALUES (?, ?, ?)', data)
    }*/
  }

  async actualizarCombos(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.prodService.combos();
    if(http.ok){
      await this.delete("venta_movil_combos")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_combos":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_combos", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

  

  async actualizarProductos(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.prodService.backup();
    if(http.ok){
      await this.delete("venta_movil_productos")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_productos":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_productos", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

  
  async actualizarAplicaciones(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.prodService.aplicacionesBackup();
    if(http.ok){
      await this.delete("venta_movil_aplicaciones")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_aplicaciones":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_aplicaciones", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

  
  async actualizarEquivalentes(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.prodService.equivalentesBackup();
    if(http.ok){
      await this.delete("venta_movil_equivalentes")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_equivalentes":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_equivalentes", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }
  
  async actualizarInventarioPrecio(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.prodService.inventarioPrecioBackup();
    if(http.ok){
      await this.delete("venta_movil_inventario_precios")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_inventario_precios":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_inventario_precios", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

  
  
  async actualizarImagenes(){
    //Extraemos la data del servidor
    var http = await this.prodService.imagenesBackup();
    if(http.ok){
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_imagenes":registros
              }
          }
      };
      //La guardamos
      this.sqlPorter.importJsonToDb(this.storage, json)
      .then(_ => {
        //Ok
        this.actualizarTrackingTable("venta_movil_imagenes", registros.length)
      })
      .catch(e => this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
      );
    }else{
      this.tools.showNotification("Error!", http.mensaje,"Ok");
    }
  }

  
  
  async actualizarClientes(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.customerService.Backup();
    if(http.ok){
      await this.delete("venta_movil_clientes")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_clientes":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_clientes", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }




  
  async backupPromociones(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.navService.getBackupPromociones();
    if(http.ok){
      await this.delete("venta_movil_promociones")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_promociones":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_promociones", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

  async backupPromocionesDetalle(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.navService.getBackupPromocionesDetalle();
    if(http.ok){
      await this.delete("venta_movil_promociones_detalle")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_promociones_detalle":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_promociones_detalle", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

  async backupEscalas(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.navService.getBackupEscalas();
    if(http.ok){
      await this.delete("venta_movil_escalas")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_escalas":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_escalas", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }
    
  async backupConversiones(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.navService.getBackupConversiones();
    if(http.ok){
      await this.delete("venta_movil_conversiones")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_conversiones":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_conversiones", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }
    
  async backupListaPrecios(showNotificacion = true){
    //Extraemos la data del servidor
    var http = await this.navService.getBackupListaPrecios();
    if(http.ok){
      await this.delete("venta_movil_lista_precios")
      var registros = http.registros;
      var json = {
          "data":{
              "inserts":{
                  "venta_movil_lista_precios":registros
              }
          }
      };
      //La guardamos
      await this.sqlPorter.importJsonToDb(this.storage, json)
      .then(async _ => {
        //Ok
        await this.actualizarTrackingTable("venta_movil_lista_precios", registros.length)
        this.procesosOk++;
      })
      .catch(e => {
        if(showNotificacion){
          this.tools.showNotification("Error!", "No se pudo almacenar la información: "+JSON.stringify(e),"Ok")
        }
      }
      );
    }else{
      if(showNotificacion){
        this.tools.showNotification("Error!", http.mensaje,"Ok");
      }
    }
    this.procesosTotales.next(1);
  }

}
