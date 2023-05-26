import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { VentaPerdidaPage } from "./venta-perdida.page";


const routes: Routes = [
  {
    path: '',
    component: VentaPerdidaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VentaPerdidaPage]
})
export class VentaPerdidaPageModule {}
