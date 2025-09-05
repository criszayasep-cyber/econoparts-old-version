import { ChangeDetectorRef, Component,OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ToolsService } from '../services/default/tools.service';
import { ConfiguracionService } from '../services/default/configuracion.service';
import { OrdenamientoComponent } from '../componentes/ordenamiento/ordenamiento.component';
import { KPIService } from '../services/kpi.service';
import { RutaService } from '../services/ruta.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GestionDiariaEntity } from '../entity/gestion-diaria-entity';
import { element } from 'protractor';
import { Network } from '@capacitor/network';
import { Subject } from 'rxjs';
import { DbService } from '../services/default/db.service';
import { AuthService } from '../services/auth/auth.service';
import { CobrosService } from '../services/cobros.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FilterEntity } from '../entity/default/filter-entity';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  
  titulo = "Gestión Comercial";
	loadTotales: Subject<number> = new Subject();
  fechasDisponibles: Array<Date> = window.localStorage["fechasDisponibles"]?JSON.parse(window.localStorage["fechasDisponibles"]):[];
  hoy = window.localStorage["hoy"]?window.localStorage["hoy"]:new Date();
  kpiAcumulado: any;
  kpiDia: any
  total = 0;
  filtros: FilterEntity;
  clientes: Array<GestionDiariaEntity> = window.localStorage["clientesVisitar"]?JSON.parse(window.localStorage["clientesVisitar"]):[];
  loading = {
    clientes: false
  }

  constructor(
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
    public tools: ToolsService,
    private alertController: AlertController, 
    public configuracion: ConfiguracionService,
    private popoverController: PopoverController,
    private kpiService: KPIService,
    private activeRoute: ActivatedRoute,
    private cobrosService: CobrosService,
    public router: Router,
    private rutaService: RutaService,
    private authService: AuthService,
    private db: DbService,
    private http: HttpClient
    ) {
      
    }

  ngOnInit(){
    this.loadAll();
    this.filtros = new FilterEntity(ConfiguracionService.paginacion);
  }

  async loadAll(){
    if(this.configuracion.ConfiguracionService.online){
      const status = await Network.getStatus();
      if(status.connected){
        this.loadClientes();
        this.loadKPI();
        this.loadGestionActiva();
      }else{
        this.tools.showNotification("Error", "No esta conectado a internet","Ok");
      }
    }else{
      this.loadClientes();
      this.loadGestionActiva();
    }
  }

  paginar(pag): void{
    this.tools.paginar(this.filtros,pag);
    this.configuracion.setPaginacion(pag.pageSize);
   this.loadAll();
  }
  
  async ionViewWillEnter() {

    if(this.configuracion.ConfiguracionService.online){
      const status = await Network.getStatus();
        if(status.connected){
          let necesarioActualizar = false;
  
          await this.activeRoute.queryParams.subscribe( params => {
            if(params["actualizarLista"]!=undefined){
              necesarioActualizar = true;
            }
          });
          
          if(necesarioActualizar || ConfiguracionService.actualizarTab1){
            this.loadAll();
            
            ConfiguracionService.actualizarTab1 = false;
            window.localStorage["actualizarTab1"] = JSON.stringify(false);
            this.router.navigate([], {queryParams: null});
          }
        }else{
          this.tools.showNotification("Error", "No esta conectado a internet","Ok");
        }
    }else{
      let necesarioActualizar = false;

      await this.activeRoute.queryParams.subscribe( params => {
        if(params["actualizarLista"]!=undefined){
          necesarioActualizar = true;
        }
      });
      
      if(necesarioActualizar || ConfiguracionService.actualizarTab1){
        this.loadAll();
        
        ConfiguracionService.actualizarTab1 = false;
        window.localStorage["actualizarTab1"] = JSON.stringify(false);
        this.router.navigate([], {queryParams: null});
      }
    }
  }
  
  
  doRefresh(event) {
    this.loadAll();
    let countLoad = 0
    this.loadTotales.subscribe(s => {
      countLoad += s;
      if(countLoad==3){
        event.target.complete();
      }
    })
  }

  searchCliente(){
    this.navCtrl.navigateForward(['tabs/tab3']);
  }

  async addClienteNuevo(){
    const alertMedio = await this.alertController.create({
      header: 'Ingrese los datos del cliente',
      subHeader: '',
      cssClass: 'coupon-alert',
      message: '',
      backdropDismiss: false,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },{
          text: 'OK',
          role: 'ok'
        }],
        inputs: [
          {
            placeholder: 'Nombre',
            type: 'text',
            value: ''
          },
          {
            placeholder: 'NIT',
            type: 'text',
            value: ''
          },
          {
            placeholder: 'Correo',
            type: 'text',
            value: ''
          },
          {
            placeholder: 'Teléfono',
            type: 'text',
            value: ''
          }
        ]
      });

    await alertMedio.present();
    var { data, role } = await alertMedio.onDidDismiss();

    if(role=="ok"){
      var completo = true;
      for(var i=0; i<3; i++){
        if(data.values[i].replaceAll(' ','') == ''){
          completo = false;
        }
      };

      if(completo){
        //Enviamos agregar una gestión
          this.tools.presentLoading("Iniciando gestión...")
          var dataPost = {
            nombre: data.values[0],
            nit: data.values[1],
            correo: data.values[2],
            telefono: data.values[3]
          }
          var response = await this.rutaService.iniciarGestionClienteNuevo(dataPost);
          this.tools.destroyLoading();
          if(response.ok){
            var item = {
              ruta: response.registros["ruta"],
              cliente: response.registros["cliente"]
            }
            ConfiguracionService.setSelectedCliente(item, response.registros["pedido"]);
            this.loadAll();
            this.navCtrl.navigateForward(['tabs/tab2']);
          }else{
            this.tools.showNotification("Error", response.mensaje,"Ok");
          }
      }else{
        this.tools.showNotification("Error", "Debe de completar todos los datos","Ok");
      }

    }
  }

  async opciones(ev, item:GestionDiariaEntity, indice){
    const popover = await this.popoverController.create({
      component: OrdenamientoComponent,
      componentProps: {item: item},
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      mode: 'ios',
    });

    
    
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if(data && data.item){
      switch(data.item){
        case 1://Cancelar gestión
          this.ref.detectChanges();
          const alert = await this.alertController.create({
            header: 'Motivo de Cancelación',
            backdropDismiss: false,
              buttons: [{
                text: 'Aceptar',
                handler: async data =>{
                  this.ref.detectChanges();
                  
                  if(data!=undefined && data.length>0){
                    if(this.configuracion.ConfiguracionService.online){
                      let dataPost = {
                        ruta: item.ruta.rde_id,
                        motivo: data
                      }
    
                      var response = await this.rutaService.noVenta(dataPost);
                      if(response.ok){
                        //this.configuracion.removePedidoActual();
                        ConfiguracionService.setUnselectCliente(false); 
                        if(data!="0"){
                          this.clientes.splice(indice, 1);
                          console.log(this.clientes); // No es aqui
                          this.loadAll();
                          window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                        }
                      }
                      /*if(data!="0"){
                        item.cancelado = true;
                        item.motivo = data;
                      }*/
                    }else{
                      ConfiguracionService.setUnselectCliente(false); 
                      if(data=="0"){
                        let params = [0, null];
                        this.db.update(`UPDATE venta_movil_gestiones SET rde_visitado=?, rde_gestion_inicio=? WHERE rde_id=${item.ruta.rde_id}`,params)
                      }else{
                        let params = [data, new Date()];
                        this.db.update(`UPDATE venta_movil_gestiones SET rde_motivo_no_venta=?, rde_gestion_fin=? WHERE rde_id=${item.ruta.rde_id}`,params)

                        params = ['CANCELADO NO VENTA']
                        this.db.update(`UPDATE venta_movil_pedidos SET ped_estado=? WHERE ped_id=${item.ruta.rde_pedido}`,params)
                        console.log(this.clientes); // No es aqui II
                        this.clientes.splice(indice, 1);
                        this.loadAll();
                        window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                      }
                    }

                  }

                  this.ref.detectChanges();
                  return true;
                }
              }],
              inputs: [
                {
                  label: 'Negocio cerrado',
                  type: 'radio',
                  value: 'Negocio cerrado'
                },
                {
                  label: 'Cliente tiene stock',
                  type: 'radio',
                  value: 'Cliente tiene stock'
                },
                {
                  label: 'Cliente sin dinero',
                  type: 'radio',
                  value: 'Cliente sin dinero'
                },
                {
                  label: 'Retomar mismo día',
                  type: 'radio',
                  value: '0'
                }
              ]
            });
      
            await alert.present();
            this.ref.detectChanges();
          break;
        case 2://Iniciar gestión
          if(this.configuracion.ConfiguracionService.online){
            this.tools.presentLoading("Iniciando gestión...")
            var response = await this.rutaService.iniciarGestion(item.ruta.rde_id);
            this.tools.destroyLoading();
            if(response.ok){
              ConfiguracionService.setSelectedCliente(item, response.registros);
              this.navCtrl.navigateForward(['tabs/tab2']);
            }else{
              this.tools.showNotification("Error", response.mensaje,"Ok");
            } 
          }else{
            var idPed = 0
            if(item.pedido==null){
              //Se crea el pedido
              var id = new Date().getTime()
              let data = [id, 
                new Date(),
                this.authService.getUsername(),
                item.cliente.correo,
                item.cliente.codigo,
                new Date(),
                this.authService.getCodigoVendedor(),
                item.cliente.nombre_social,
                item.cliente.nombre_comercial,
                item.cliente.direccion,
                item.cliente.direccion2,
                item.cliente.dui,
                item.cliente.nit,
                item.cliente.telefono,
                item.cliente.area_despacho,
                item.cliente.celular
              ];
              var query = `INSERT INTO 
                            venta_movil_pedidos(ped_id,ped_fecha_registro,ped_usuario,
                              ped_cliente_correo,ped_cliente_codigo,ped_fecha, ped_vendedor,
                              ped_cliente_nombre,ped_cliente_comercial,ped_cliente_direccion,ped_cliente_direccion2,
                              ped_cliente_dui, ped_cliente_nit,ped_telefono,ped_ruta,ped_celular) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
              this.db.insert(query, data)
              idPed = id
            }else{
              //Se busca el pedido
              idPed = item.pedido.ped_id
            }
            var p = await this.db.select(`SELECT * FROM venta_movil_pedidos WHERE ped_id='${idPed}'`);
            
            let params = [idPed, new Date(), 1];
            this.db.update(`UPDATE venta_movil_gestiones SET rde_pedido=?, rde_gestion_inicio=?, rde_visitado=? 
                            WHERE rde_id=${item.ruta.rde_id}`,params)

            ConfiguracionService.setSelectedCliente(item, p[0]);
            this.navCtrl.navigateForward(['tabs/tab2']);
          }
          break;
        case 3://Cambiar día
          this.ref.detectChanges();

          var opciones = [];

          //var config = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          //var config = { year: 'numeric', month: '2-digit', day: '2-digit' };
          this.fechasDisponibles.forEach( function(fd) {
            opciones.push({
              label: new Date(fd).toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'short', day: '2-digit' }),
              type: 'radio',
              value: fd
            });
          });

          const cambiarDia = await this.alertController.create({
            header: 'Seleccione la nueva fecha',
            backdropDismiss: false,
              buttons: [{
                text: 'Ok',
                handler: async data =>{
                  this.ref.detectChanges();

                  if(data!=undefined && data.length>0){
                    let dataPost = {
                      ruta: item.ruta.rde_id,
                      nueva_fecha: data
                    }
  
                    var response = await this.rutaService.updateFecha(dataPost);
                    if(response.ok){
                      //this.configuracion.removePedidoActual();
                      console.log(this.clientes); // No es aqui III
                      this.clientes.splice(indice, 1);
                      window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                      ConfiguracionService.setUnselectCliente(false);
                      this.loadAll();
                    }
                  }
                  
                  this.ref.detectChanges();
                  return true;
                }
              }],
              inputs: opciones
            });
      
            await cambiarDia.present();
            this.ref.detectChanges();
          break;
        case 4://ver cliente
          let navigationExtras: NavigationExtras = {
            queryParams: {
                cliente: JSON.stringify(item.cliente)
            }
          };
          this.navCtrl.navigateForward(['tabs/tab3/detalle'], navigationExtras);
          break;
        case 5://Gestion cobros
        this.ref.detectChanges();
        const alertCobros = await this.alertController.create({
          header: 'Gestión cobros',
          backdropDismiss: false,
            buttons: [{
              text: 'OK',
              handler: async data =>{
                if (data == "Visita de cobros"){
                  const alert = await this.alertController.create({
                    header: 'Ingrese el monto',
                    inputs: [
                      {
                        name: 'monto',
                        type: 'number',
                        placeholder: 'Ingrese el monto',
                      }
                    ],
                    buttons: [
                      {
                        text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'secondary',
                      },
                      {
                        text: 'Aceptar',
                        handler: async (data2) => {
                          // Manejar el rde_monto ingresado
                          const rde_monto = parseFloat(data2.monto);
                          let dataPost = {
                            rde_id: item.ruta.rde_id,rde_monto: rde_monto
                          }


                          if (!isNaN(rde_monto)) {                  
                            var response = await this.cobrosService.sendCobro(dataPost);//.subscribe(async respuesta => {
                            //this.http.post('http://localhost:49220/G-cobro', { }).subscribe(async respuesta => {
                              if(response){
                                this.ref.detectChanges();
                                
                                if(data!=undefined && data.length>0){
                                  if(this.configuracion.ConfiguracionService.online){
                                    let dataPost = {
                                      ruta: item.ruta.rde_id,
                                      motivo: data
                                    }
                  
                                    var response = await this.rutaService.noVenta(dataPost);
                                    if(response.ok){
                                      
                                      //this.configuracion.removePedidoActual();
                                      ConfiguracionService.setUnselectCliente(false); 
                                      if(data!="0"){
                                        console.log(this.clientes); // No es aqui IV
                                        this.clientes.splice(indice, 1);
                                        this.loadAll();
                                        window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                                      }
                                    }
                                
                                  }else{
                                    ConfiguracionService.setUnselectCliente(false); 
                                    if(data=="0"){
                                      let params = [0, null];
                                      this.db.update(`UPDATE venta_movil_gestiones SET rde_visitado=?, rde_gestion_inicio=? WHERE rde_id=${item.ruta.rde_id}`,params)
                                    }else{
                                      let params = [data, new Date()];
                                      this.db.update(`UPDATE venta_movil_gestiones SET rde_motivo_no_venta=?, rde_gestion_fin=? WHERE rde_id=${item.ruta.rde_id}`,params)

                                      params = ['CANCELADO NO VENTA']
                                      this.db.update(`UPDATE venta_movil_pedidos SET ped_estado=? WHERE ped_id=${item.ruta.rde_pedido}`,params)
                                      console.log(this.clientes); // No es aqui V
                                      this.clientes.splice(indice, 1);
                                      this.loadAll();
                                      window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                                    }
                                  }
                                }
                                this.ref.detectChanges();
                                return true;
                              }else{
                                this.tools.showNotification("Error", response.mensaje,"Ok");
                              }

                            /*}, error => {
                              // Manejar errores aquí
                              this.tools.showNotification("Error", 'Error al realizar la solicitud:' + error, "Ok");
                            });*/
                          } else {
                            // Mostrar un mensaje de error si el valor ingresado no es válido
                            this.tools.showNotification("Error", "Por favor, ingrese un monto válido.", "Ok");
                            return false;
                          }
                        },
                      },
                    ],
                  });
                  await alert.present();
                }
                else{
                  this.ref.detectChanges();
                                
                                if(data!=undefined && data.length>0){
                                  if(this.configuracion.ConfiguracionService.online){
                                    let dataPost = {
                                      ruta: item.ruta.rde_id,
                                      motivo: data
                                    }
                  
                                    var response = await this.rutaService.noVenta(dataPost);
                                    if(response.ok){
                                      
                                      //this.configuracion.removePedidoActual();
                                      ConfiguracionService.setUnselectCliente(false); 
                                      if(data!="0"){
                                        console.log(this.clientes); // No es aqui VI
                                        this.clientes.splice(indice, 1);
                                        this.loadAll();
                                        window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                                      }
                                    }
                                
                                  }else{
                                    ConfiguracionService.setUnselectCliente(false); 
                                    if(data=="0"){
                                      let params = [0, null];
                                      this.db.update(`UPDATE venta_movil_gestiones SET rde_visitado=?, rde_gestion_inicio=? WHERE rde_id=${item.ruta.rde_id}`,params)
                                    }else{
                                      let params = [data, new Date()];
                                      this.db.update(`UPDATE venta_movil_gestiones SET rde_motivo_no_venta=?, rde_gestion_fin=? WHERE rde_id=${item.ruta.rde_id}`,params)

                                      params = ['CANCELADO NO VENTA']
                                      this.db.update(`UPDATE venta_movil_pedidos SET ped_estado=? WHERE ped_id=${item.ruta.rde_pedido}`,params)
                                      console.log(this.clientes); // No es aqui VII
                                      this.clientes.splice(indice, 1);
                                      this.loadAll();
                                      window.localStorage["clientesVisitar"] = JSON.stringify(this.clientes);
                                    }
                                  }
                                }
                                this.ref.detectChanges();
                                return true;
                }
              }
            }],
            inputs: [
              {
                label: 'Visita de cobros',
                type: 'radio',
                value: 'Visita de cobros'
              },
              {
                label: 'Visita gestión Quedan',
                type: 'radio',
                value: 'Visita gestión Quedan'
              },
              {
                label: 'Visita por documentación',
                type: 'radio',
                value: 'Visita por documentación'
              },
              {
                label: 'Visitar mismo dia',
                type: 'radio',
                value: '0'
              }
            ]
          });
    
          await alertCobros.present();
          this.ref.detectChanges();
        break;
      }
    }
  }

  async loadClientes(){
    this.ref.detectChanges();
    console.log(this.clientes); // Te encontramos pero tu eres un objecto
    //this.clientes = [];
    if(this.configuracion.ConfiguracionService.online){
      this.loading.clientes = true;
      var r = await this.rutaService.getToday();
      this.loading.clientes = false;
      if(r){
        if(r.ok){
          this.clientes = r.registros;
          this.total = this.clientes.length;
          this.db.clientesEnGestion.next(this.clientes?this.clientes.length:0)
          window.localStorage["clientesVisitar"] = JSON.stringify(r.registros);
        }else{
          this.tools.showNotification("Error", r.mensaje,"Ok");
        }
      }
    }else{
      var resultado = []
      var query = "SELECT * FROM  venta_movil_gestiones WHERE rde_vendedor_codigo = '"+this.authService.getCodigoVendedor()+"' AND rde_gestion_fin IS NULL"
      var gestiones = await this.db.select(query)
      gestiones.forEach(async g => {
        var cli = await this.db.select("SELECT * FROM venta_movil_clientes WHERE codigo='"+g.rde_cliente_codigo+"'")
        resultado.push({
          ruta: g,
          cliente: cli[0]
        });
      })

      
      this.clientes = resultado;
      this.db.clientesEnGestion.next(this.clientes?this.clientes.length:0)
      window.localStorage["clientesVisitar"] = JSON.stringify(resultado);
    }
    this.ref.detectChanges();
    this.loadTotales.next(1);
  }

  async loadKPI(){
    var r = await this.kpiService.getAll();
    if(r){
      if(r.ok){
        this.loadFechasDisponibles(r.registros["hoy"]);

        this.hoy = r.registros["hoy"];
        this.kpiAcumulado = r.registros["acumulado"]
        this.kpiDia = r.registros["dia"]

        window.localStorage["hoy"] = this.hoy;
      }else{
        this.tools.showNotification("Error", r.mensaje,"Ok");
      }
    }
    this.loadTotales.next(1);
  }

  async loadFechasDisponibles(serverString){
    var server = new Date(serverString);
    var local = new Date(this.hoy);

    if(!(local.getTime() == server.getTime())){
      var response = await this.rutaService.fechasDisponibles();
      if(response.ok){
        this.fechasDisponibles = response.registros;
        window.localStorage["fechasDisponibles"] = JSON.stringify(response.registros);
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
  }

  async loadGestionActiva(){
    
    if(this.configuracion.ConfiguracionService.online){
      var response = await this.rutaService.getGestionActiva();
      if(response.ok){
        if(response.registros["ruta"]!=null){
          ConfiguracionService.setGestionActiva(response.registros);
        }else{
          ConfiguracionService.setUnselectCliente(false);
        }
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }else{
      var registros = []
      var query = `SELECT * FROM venta_movil_gestiones 
                  WHERE rde_visitado=1 
                    AND rde_vendedor_codigo='${this.authService.getCodigoVendedor()}' 
                    AND rde_gestion_inicio IS NOT NULL
                    AND rde_gestion_fin IS NULL`
      var ruQuery = await this.db.select(query);

      if(ruQuery.length>0){
        var ruta = ruQuery[0]
  
        var cliQuery = await this.db.select(`SELECT * FROM venta_movil_clientes WHERE codigo='${ruta.rde_cliente_codigo}'`);
        var pedQuery = await this.db.select(`SELECT * FROM venta_movil_pedidos WHERE ped_id='${ruta.rde_pedido}'`);

        registros.push({
          ruta: ruta,
          cliente: cliQuery[0],
          pedido: pedQuery[0]
        })
        
        ConfiguracionService.setGestionActiva(registros);
      }else{
        ConfiguracionService.setUnselectCliente(false);
      }
    }
    this.loadTotales.next(1);
  }

}
