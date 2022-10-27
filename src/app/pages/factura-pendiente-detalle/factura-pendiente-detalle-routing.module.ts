import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturaPendienteDetallePage } from './factura-pendiente-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: FacturaPendienteDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturaPendienteDetallePageRoutingModule {}
