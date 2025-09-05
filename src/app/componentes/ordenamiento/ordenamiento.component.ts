import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { GestionDiariaEntity } from 'src/app/entity/gestion-diaria-entity';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';

@Component({
  selector: 'app-ordenamiento',
  templateUrl: './ordenamiento.component.html',
  styleUrls: ['./ordenamiento.component.scss'],
})
export class OrdenamientoComponent implements OnInit {

  item: GestionDiariaEntity;

  constructor(private popoverCtrl: PopoverController,
    public configuracion: ConfiguracionService,
    public navParams: NavParams) {
      this.item = this.navParams.get('item');
     }

  ngOnInit() {}

  seleccionar(valor){
    console.log(valor);
    this.popoverCtrl.dismiss({
      item: valor
    });
  }

}
