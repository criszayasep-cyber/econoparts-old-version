import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotasCreditoRelacionadasPageRoutingModule } from './notas-credito-relacionadas-routing.module';

import { NotasCreditoRelacionadasPage } from './notas-credito-relacionadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotasCreditoRelacionadasPageRoutingModule
  ],
  declarations: [NotasCreditoRelacionadasPage]
})
export class NotasCreditoRelacionadasPageModule {}
