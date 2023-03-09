import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, ActionSheetController, PopoverController, ModalController, MenuController, IonRouterOutlet, ToastController, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { AuthService } from './services/auth/auth.service';
import { DeviceService } from './services/default/device.service';
import { ToolsService } from './services/default/tools.service';
//import { FCMPlugin } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/src/FCMPlugin';
//import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  showSplash = true;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private router: Router,
    public navCtrl: NavController,
    private toastController: ToastController,
    public menuCtrl: MenuController,
    //private fcm2: FCMPlugin,
    private fcm: FCM,
    private alertController: AlertController,
    public auth: AuthService,
    private tools: ToolsService,
    public device: DeviceService
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
    this.tools.showNotification("Aviso", "Intentelo nuevamete","Ok");
  }

}
