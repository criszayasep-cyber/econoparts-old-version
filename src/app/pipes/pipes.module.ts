import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { PercentajeFormatPipe } from './percentaje-format.pipe';
import { QuantityFormatPipe } from './quantity-format.pipe';



@NgModule({
  declarations: [CurrencyFormatPipe, PercentajeFormatPipe, QuantityFormatPipe],
  imports: [
    CommonModule
  ],
  exports: [CurrencyFormatPipe, PercentajeFormatPipe, QuantityFormatPipe]
})
export class PipesModule { }
