import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotasCreditoRelacionadasPage } from './notas-credito-relacionadas.page';

const routes: Routes = [
  {
    path: '',
    component: NotasCreditoRelacionadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotasCreditoRelacionadasPageRoutingModule {}
