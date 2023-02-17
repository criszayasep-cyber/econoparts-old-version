import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    EncabezadoComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FontAwesomeModule,
  ],
  exports:[
    EncabezadoComponent
  ]
})
export class EncabezadoModule { }
