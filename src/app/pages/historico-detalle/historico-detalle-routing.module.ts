import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoDetallePage } from './historico-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricoDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricoDetallePageRoutingModule {}
