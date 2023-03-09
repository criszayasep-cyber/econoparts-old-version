import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacturaPendienteDetallePageRoutingModule } from './factura-pendiente-detalle-routing.module';

import { FacturaPendienteDetallePage } from './factura-pendiente-detalle.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    FacturaPendienteDetallePageRoutingModule
  ],
  declarations: [FacturaPendienteDetallePage]
})
export class FacturaPendienteDetallePageModule {}
