import { FormControl } from '@angular/forms';

export class ValidadorSTJ {
    static validSeleccionar(fc: FormControl){
        if(fc.value.toLowerCase() === "seleccionar"){
            return ({validSeleccionar: true});
        } else {
            return (null);
        }
      }
}
