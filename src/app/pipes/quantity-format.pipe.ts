import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quantityFormat'
})
export class QuantityFormatPipe implements PipeTransform {

  transform(value: number,
    decimalLength: number = 0, 
    chunkDelimiter: string = ',', 
    decimalDelimiter:string = '.',
    chunkLength: number = 3): string {

    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num = Number(value).toFixed(Math.max(0, ~~decimalLength));

    return (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
  }

}
