import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CotizacionDetallePage } from './cotizacion-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: CotizacionDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CotizacionDetallePageRoutingModule {}
