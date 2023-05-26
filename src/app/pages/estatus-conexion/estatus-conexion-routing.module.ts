import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstatusConexionPage } from './estatus-conexion.page';

const routes: Routes = [
  {
    path: '',
    component: EstatusConexionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstatusConexionPageRoutingModule {}
