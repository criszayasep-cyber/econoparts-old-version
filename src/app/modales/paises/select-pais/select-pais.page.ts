import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-pais',
  templateUrl: './select-pais.page.html',
  styleUrls: ['./select-pais.page.scss'],
})
export class SelectPaisPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  seleccionarPais(pais){
    this.modalCtrl.dismiss({
      country: pais
    });

  }

}
