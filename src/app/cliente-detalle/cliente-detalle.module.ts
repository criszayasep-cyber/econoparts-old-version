import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClienteDetallePage } from './cliente-detalle.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ClienteDetallePage
  }
];

@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClienteDetallePage]
})
export class ClienteDetallePageModule {}
