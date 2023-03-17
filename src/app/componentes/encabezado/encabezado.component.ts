import { Component, Input, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent implements OnInit {

  @Input() titulo: any;

  constructor(public config: ConfiguracionService) { }

  ngOnInit() {}

}
