import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {  

  constructor(private platform: Platform) { }
  
  getUbicacion(){
    var d = this.platform.platforms();
    return d[0];
  }

  getVersion(){
    return environment.version;
  }

  getInfo(){
    var d = this.platform.platforms();
    return d[0]+" - "+environment.version +" - " + (environment.production?"prod":"dev");
  }


}
