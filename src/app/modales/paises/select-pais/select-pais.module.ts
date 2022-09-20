import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPaisPageRoutingModule } from './select-pais-routing.module';

import { SelectPaisPage } from './select-pais.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPaisPageRoutingModule
  ],
  declarations: [SelectPaisPage]
})
export class SelectPaisPageModule {}
