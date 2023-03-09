import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotasCreditoRelacionadasPageRoutingModule } from './notas-credito-relacionadas-routing.module';

import { NotasCreditoRelacionadasPage } from './notas-credito-relacionadas.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    NotasCreditoRelacionadasPageRoutingModule
  ],
  declarations: [NotasCreditoRelacionadasPage]
})
export class NotasCreditoRelacionadasPageModule {}
