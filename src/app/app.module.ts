import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

//import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { LazyLoadImageModule,intersectionObserverPreset } from 'ng-lazyload-image'; // <-- import it
import { ProductoDetallePageModule } from './pages/producto-detalle/producto-detalle.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import {NgxMaskIonicModule} from 'ngx-mask-ionic'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { JwtModule } from "@auth0/angular-jwt";
import { ConfiguracionService } from './services/default/configuracion.service';
import { environment } from 'src/environments/environment';
import {MatPaginatorModule} from '@angular/material/paginator';

import localeEs from '@angular/common/locales/es';
import { DatePipe, registerLocaleData } from '@angular/common';


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    IonicModule.forRoot(),
    NgxMaskIonicModule.forRoot(), 
    IonicModule.forRoot({
      mode: 'ios'
    }),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset // <-- tell LazyLoadImage that you want to use IntersectionObserver
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: ConfiguracionService.getBearer,
        allowedDomains: [environment.ip],
        disallowedRoutes: ["//authenticate", "//welcome"],
        authScheme: (request) => {
          if (request.url.includes("welcome") || request.url.includes("authenticate")) {
            return "";
          }
          return "Bearer ";
        },
      },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    FontAwesomeModule,
    HttpClientModule,
    ProductoDetallePageModule,
    MatPaginatorModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    Keyboard,
    {provide: LOCALE_ID, useValue: 'es'},
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
      library.addIconPacks(fas);
      library.addIconPacks(fab);
      library.addIconPacks(far);
      library.addIcons(faCoffee);
    }
}
