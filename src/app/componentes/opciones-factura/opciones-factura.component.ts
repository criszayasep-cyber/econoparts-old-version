import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { GestionDiariaEntity } from 'src/app/entity/gestion-diaria-entity';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';

@Component({
  selector: 'app-opciones-factura',
  templateUrl: './opciones-factura.component.html',
  styleUrls: ['./opciones-factura.component.scss'],
})
export class OpcionesFacturaComponent implements OnInit {

  item: any;

  constructor(private popoverCtrl: PopoverController,
    public configuracion: ConfiguracionService,
    public navParams: NavParams) {
      this.item = this.navParams.get('item');
     }

  ngOnInit() {}

  seleccionar(valor){
    this.popoverCtrl.dismiss({
      item: valor
    });
  }

}
