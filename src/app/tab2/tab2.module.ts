import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { LazyLoadImageModule,intersectionObserverPreset } from 'ng-lazyload-image';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import { EncabezadoModule } from '../componentes/encabezado/encabezado.module';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    EncabezadoModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }]),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset // <-- tell LazyLoadImage that you want to use IntersectionObserver
    }),
    NgSelectModule
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
