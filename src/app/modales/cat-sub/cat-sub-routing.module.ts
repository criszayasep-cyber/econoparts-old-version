import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatSubPage } from './cat-sub.page';

const routes: Routes = [
  {
    path: '',
    component: CatSubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatSubPageRoutingModule {}
