import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatSubPageRoutingModule } from './cat-sub-routing.module';

import { CatSubPage } from './cat-sub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatSubPageRoutingModule
  ],
  declarations: [CatSubPage]
})
export class CatSubPageModule {}
