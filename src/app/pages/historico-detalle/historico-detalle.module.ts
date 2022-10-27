import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoDetallePageRoutingModule } from './historico-detalle-routing.module';

import { HistoricoDetallePage } from './historico-detalle.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    HistoricoDetallePageRoutingModule
  ],
  declarations: [HistoricoDetallePage]
})
export class HistoricoDetallePageModule {}
