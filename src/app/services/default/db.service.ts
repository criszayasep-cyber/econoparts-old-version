import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ToolsService } from './tools.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly database_name: string = "gestion_comercial.db";
  readonly table_name: string = "myfreakytable";

  name_model: string = "";
  row_data: any = [];

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private tools: ToolsService) { 
      this.platform.ready().then(() => {
        this.createDB();
      }).catch(error => {
        console.log(error);
      })
    }
  
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.storage = db;
      this.loadChange();
      //alert('gestion_comercial Database Created!');
    })
    .catch(e => {
      //alert("error " + JSON.stringify(e))
      this.tools.showNotification("Error!", "No se pudo conectar a la base local: "+JSON.stringify(e),"Ok");
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }
  
  async select(query){
    let items = [];
    await this.storage.executeSql(query, []).then(res => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          items.push(res.rows.item(i));
        }
      }
    });
    
    return items;
  }
  insert(query, params){
    this.storage.executeSql(query, params)
    .then(res => {
    });
  }
  update(query, params){
    this.storage.executeSql(query, params)
    .then(data => {
    })
  }

  loadChange(){
    this.httpClient.get(
      'assets/files/dump.sql', 
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.validateVersion();
          this.isDbReady.next(true);
        })
        .catch(error => console.error("ERROR => ",error));
    });
  }

  async validateVersion(){
    var rows = await this.select('SELECT * FROM versiones_tracking');
    if (rows.length > 0) {
      if(rows[0].id!=environment.version){
        let data = [environment.version, new Date()];
        this.update(`UPDATE versiones_tracking SET id=?, fecha=? WHERE id=${environment.version}`,data)
        //Si hubiese que correr alguna actualización
      }
    }else{
      let data = [environment.version, new Date()];
      this.insert('INSERT INTO versiones_tracking VALUES (?, ?)', data)
    }
  }


}
