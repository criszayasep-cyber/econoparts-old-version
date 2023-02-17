import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PedidoDetallePage } from './pedido-detalle.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    component: PedidoDetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatSelectModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoDetallePage]
})
export class PedidoDetallePageModule {}
