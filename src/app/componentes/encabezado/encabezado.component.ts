import { Component, Input, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';
import { DeviceService } from 'src/app/services/default/device.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
})
export class EncabezadoComponent implements OnInit {

  @Input() titulo: any;

  constructor(public config: ConfiguracionService, public pf: DeviceService) { }

  ngOnInit() {}

}
