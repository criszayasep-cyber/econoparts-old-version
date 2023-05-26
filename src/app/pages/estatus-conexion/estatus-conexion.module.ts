import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstatusConexionPageRoutingModule } from './estatus-conexion-routing.module';

import { EstatusConexionPage } from './estatus-conexion.page';
import { EncabezadoModule } from 'src/app/componentes/encabezado/encabezado.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EncabezadoModule,
    IonicModule,
    SharedModule,
    FontAwesomeModule,
    EstatusConexionPageRoutingModule
  ],
  declarations: [EstatusConexionPage]
})
export class EstatusConexionPageModule {}
