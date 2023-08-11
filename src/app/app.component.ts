import { Component, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';

import { Platform, ActionSheetController, PopoverController, ModalController, MenuController, IonRouterOutlet, ToastController, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { AuthService } from './services/auth/auth.service';
import { DeviceService } from './services/default/device.service';
import { ToolsService } from './services/default/tools.service';
import { DbService } from './services/default/db.service';
import { ConfiguracionService } from './services/default/configuracion.service';
import { Network } from '@capacitor/network';
import { FCMPlugin } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/src/FCMPlugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  clientesEnGestion = 0
  conexion = this.config.ConfiguracionService.online
  showSplash = true;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  
  constructor(
    private platform: Platform,
    public pf: DeviceService,
    private statusBar: StatusBar,
    //private actionSheetCtrl: ActionSheetController,
    //private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    //private menu: MenuController,
    //private router: Router,
    public navCtrl: NavController,
    //private toastController: ToastController,
    public menuCtrl: MenuController,
    //private fcm2: FCMPlugin,
    private fcm: FCM,
    public auth: AuthService,
    private tools: ToolsService,
    public device: DeviceService,
    public config: ConfiguracionService,
    private ref: ChangeDetectorRef,
    private db:DbService,
    private alertController: AlertController
  ) {
    this.initializeApp();
    //this.backButtonEventss();
    window.localStorage['contador'] = 0;
    //this.usuario = JSON.parse(window.localStorage["usuario"]  || '[]');
    //console.log("pais=>",tool.countryCode);
    /*if(tool.countryCode===undefined || tool.countryCode.length==0){
      tool.setPais('SV');
    }*/
  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#f3d800");
      timer(5800).subscribe(()=> this.actualizar());

      
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        // Register your new token in your back-end if you want
        // backend.registerToken(token);
        console.log(token)
      });
      
      this.db.clientesEnGestion.subscribe(c => {
        this.clientesEnGestion = c
      })

    });
  }

  getToken(){
    this.fcm.getToken().then(token => {
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
      console.log(token)
    });
  }
  

  actualizar(){
    /*const el = document.getElementById('splashstj');
    el.classList.add('animated','fadeOut', 'fast');*/
    setTimeout(()=> {
      this.showSplash = false;
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#f3d800");
    },800); 
  }

  
  cerrarSesion(){
    /*window.localStorage.removeItem('token');
    this.navCtrl.navigateForward(['/login']);*/
    this.auth.sessionEnd();
  }

  async sincronizar(){

    var titulo = "¿Realmente desea pasar al modo offline?"
    var subTitulo = "Se creara una copia reciente del servidor a su tablet, esto puede tardar un par de minutos."
    if(!this.conexion){
      titulo = "¿Relmente desea pasar al modo online?"
      subTitulo = "Se enviaran las gestiones y pedidos creados al servidor y se actuliazaran los catalogos locales con el servidor, esto puedo tardar un par de minutos."
    }
    
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subTitulo,
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
        }]
      });
      
      await alert.present();
      var { data, role } = await alert.onDidDismiss();
      if(role=="ok"){

        var procesado = false;
        
        //Verificar que tenga conexión a internet
        const status = await Network.getStatus();
        if(!status.connected){
          this.tools.showNotification("Aviso", "Debe conectarse a internet para cambiar la configuración","Ok");
        }else if(this.config.getCodigoActivo()!=undefined){
          //Verificar que no tenga una gestión activa
          this.tools.showNotification("Aviso", "No puede cambiar la configuración, si tiene una gestión activa.","Ok");
        }else if(this.clientesEnGestion>0){
          //Verificar que no tenga clientes para gestionar
          this.tools.showNotification("Aviso", "No puede cambiar la configuración, si tiene clientes a visitar","Ok");
        }else if(this.conexion){
            //Preparar copia local
            //Sincronizar las tablas catalogo: combos, productos, aplicaciones, equivalentes y clientes
            //Sincronizar las tablas sin conexión: inventario, precios y promociones
            this.tools.presentLoading("Sincronizando...")
            this.db.syncLocalCopy(true, false, true);
            var contar = 0;
            this.db.procesosTotales.subscribe(s => {
              contar += s
              if(contar==11){
                this.tools.destroyLoading();
                if(contar==this.db.procesosOk){
                  this.tools.showNotification("Aviso", "Sincronización completa.","Ok");
                  this.config.setOnline(this.conexion);
                  this.conexion = false
                }else{
                  this.tools.showNotification("Aviso", "No se puede desconectar, ocurrio un error en la sincronización.","Ok");
                  this.conexion = true;
                }
              }
            })
            
            //Cambiar el estatus
            /*if(procesado){
            }else{
            }*/
        }else{
          //Transferir gestiones
          //Transferir pedidos
          //Sincronizar datos al servidor
          
          //Cambiar el estatus
          if(procesado){
            this.conexion = true
          }else{
            this.tools.showNotification("Aviso", "No se pudo conectar al servidor: ","Ok");
            this.conexion = false;
          }
    
        }
        
        
    
        this.ref.detectChanges();
    
        if(procesado){
          this.config.ConfiguracionService.online = this.conexion;
          window.localStorage["online"] = this.conexion;
        }
      }else{
        this.conexion = !this.conexion
      }

  }


  estatus(){
    this.navCtrl.navigateForward(['tabs/tab1/estatus']);
  }

  async crearCopia(){
    if(this.conexion){
      
      const alert = await this.alertController.create({
        header: '¿Realmente desea crear una copia del servidor?',
        subHeader: 'Esto puede tomar un par de minutos, se sugiere realizar esta acción conectado a un Wifi',
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
          }]
        });
        
        await alert.present();
        var { data, role } = await alert.onDidDismiss();
        if(role=="ok"){
          this.tools.presentLoading("Sincronizando...")
          this.db.syncLocalCopy(true, false, false);
          var contar = 0;
          this.db.procesosTotales.subscribe(s => {
            contar += s
            if(contar==6){
              this.tools.destroyLoading();
              if(contar==this.db.procesosOk){
                this.tools.showNotification("Aviso", "Sincronización completa.","Ok");
              }else{
                this.tools.showNotification("Aviso", "Ocurrio un error en la sincronización, intentelo de nuevo.","Ok");
              }
            }
          })
        }

        
    }else{
      this.tools.showNotification("Aviso", "No puede realizar un copia en modo offline","Ok");
    }
  }

}
