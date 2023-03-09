import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Tab4Page } from './tab4.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EncabezadoModule } from '../componentes/encabezado/encabezado.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page
  }
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    MatPaginatorModule,
    EncabezadoModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule {}
