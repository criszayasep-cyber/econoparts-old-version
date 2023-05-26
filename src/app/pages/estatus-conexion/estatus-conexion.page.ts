import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/default/db.service';

@Component({
  selector: 'app-estatus-conexion',
  templateUrl: './estatus-conexion.page.html',
  styleUrls: ['./estatus-conexion.page.scss'],
})
export class EstatusConexionPage implements OnInit {

  constructor(private db: DbService,
    private ref: ChangeDetectorRef) { }

  tablas = []

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.loadTables();
  }
  
  async loadTables(){
    this.ref.detectChanges();
    this.tablas = await this.db.select("SELECT * FROM tracking_tables");
    this.ref.detectChanges();
  }

  filterTable(tipo:string){
    return this.tablas.filter( w => w.tipo == tipo);
  }

}
