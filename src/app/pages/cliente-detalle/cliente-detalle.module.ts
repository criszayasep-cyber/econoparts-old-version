import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClienteDetallePage } from './cliente-detalle.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule, Routes } from '@angular/router'; 
import { OpcionesFacturaComponent } from 'src/app/componentes/opciones-factura/opciones-factura.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ClienteDetallePage
  }
];

@NgModule({ 
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClienteDetallePage, OpcionesFacturaComponent]
})
export class ClienteDetallePageModule {}
