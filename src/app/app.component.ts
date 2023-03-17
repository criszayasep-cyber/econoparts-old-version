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

  conexion = this.config.ConfiguracionService.online
  showSplash = true;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  
  constructor(
    private platform: Platform,
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
    //private alertController: AlertController,
    public auth: AuthService,
    private tools: ToolsService,
    public device: DeviceService,
    public config: ConfiguracionService,
    private ref: ChangeDetectorRef
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
    });
  }

  getToken(){
    console.log("==========>Aquiiii")
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
    var procesado = false;
    //Verificar que tenga conexión a internet
    const status = await Network.getStatus();
    if(!status.connected){
      this.tools.showNotification("Aviso", "Debe conectarse a internet para cambiar la configuración","Ok");
    }else if(this.config.getCodigoActivo()!=undefined){
      //Verificar que no tenga una gestión activa
      this.tools.showNotification("Aviso", "No puede cambiar la configuración, si tiene una gestión activa.","Ok");
    }else if(!this.conexion){
        //Preparar copia local
  
        //Sincronizar las tablas catalogo: combos, productos, aplicaciones, equivalentes y clientes
  
        //Sincronizar las tablas sin conexión: inventario, precios y promociones
        
        //Cambiar el estatus
        if(procesado){
          
        }else{
          this.tools.showNotification("Aviso", "No se puede desconectar: ","Ok");
          this.conexion = true;
        }
    }else{
      //Sincronizar datos al servidor
      //Transferir gestiones
      //Transferir pedidos
      
      //Cambiar el estatus
      if(procesado){
        
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

  }

}
