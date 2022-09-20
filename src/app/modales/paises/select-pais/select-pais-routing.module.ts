import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPaisPage } from './select-pais.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPaisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPaisPageRoutingModule {}
