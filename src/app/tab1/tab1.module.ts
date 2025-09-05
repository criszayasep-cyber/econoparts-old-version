import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LazyLoadImageModule,intersectionObserverPreset } from 'ng-lazyload-image';
import { OrdenamientoComponent } from '../componentes/ordenamiento/ordenamiento.component';
import { EncabezadoModule } from '../componentes/encabezado/encabezado.module';
import { SharedModule } from '../shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    CommonModule,
    FormsModule,
    EncabezadoModule,
    FontAwesomeModule,
    MatPaginatorModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset // <-- tell LazyLoadImage that you want to use IntersectionObserver
    })
  ],
  declarations: [Tab1Page, OrdenamientoComponent]
})
export class Tab1PageModule {}
