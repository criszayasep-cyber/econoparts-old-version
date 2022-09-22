import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CotizacionDetallePageRoutingModule } from './cotizacion-detalle-routing.module';

import { CotizacionDetallePage } from './cotizacion-detalle.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    CotizacionDetallePageRoutingModule
  ],
  declarations: [CotizacionDetallePage]
})
export class CotizacionDetallePageModule {}
