import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ConfiguracionService } from 'src/app/services/default/configuracion.service';
import { DeviceService } from 'src/app/services/default/device.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncabezadoComponent implements OnInit {

  @Input() titulo: any;

  constructor(public config: ConfiguracionService, public pf: DeviceService , private cd: ChangeDetectorRef) { 

  }

  ngOnInit() {
    addEventListener('online', () => {
      this.config.ConfiguracionService.online = true;
      this.cd.markForCheck();
    });
    addEventListener('offline', () => {
      this.config.ConfiguracionService.online = false;
      this.cd.markForCheck();
    });
  }

}
