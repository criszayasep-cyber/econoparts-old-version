import { Component, ChangeDetectorRef } from '@angular/core';
import { DbService } from '../services/default/db.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  nortiz: string = window.localStorage['login'] && window.localStorage['login'].length>1?"miCuenta":"tab4";
  total = window.localStorage["carrito_total"]?window.localStorage["carrito_total"]:0;

  constructor(public detectorRef: ChangeDetectorRef,public db: DbService) {
    
  }

}
