import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { ToolsService } from 'src/app/services/default/tools.service';

@Component({
  selector: 'app-notas-credito-relacionadas',
  templateUrl: './notas-credito-relacionadas.page.html',
  styleUrls: ['./notas-credito-relacionadas.page.scss'],
})
export class NotasCreditoRelacionadasPage implements OnInit {

  documento: string;
  factura: string;
  notasCredito: any[]
  detalle: any[]
  loading = false;

  constructor(
    private tools: ToolsService,
    private activeRoute: ActivatedRoute,
    private clienteService: ClienteService) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.documento = params["documento"]
      this.factura = params["numero"]
      this.loadNotasCredito()
    });
  }

  async loadNotasCredito(){
    this.loading = true;
    var response = await this.clienteService.getNotasCreidto(this.factura);
    if(response){
      if(response.ok){
        this.notasCredito = response.registros["header"];
        this.detalle = response.registros["detalle"]
      }else{
        this.tools.showNotification("Error", response.mensaje,"Ok");
      }
    }
    this.loading = false;
  }

  total(){
    if(this.detalle?.length>0){
      return this.detalle.reduce((accumulator, obj) => {
        return accumulator + (obj.monto*1);
      }, 0);
    }else{
      return 0;
    }
  }

}
