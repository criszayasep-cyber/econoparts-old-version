import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolsService } from 'src/app/services/default/tools.service';



@Component({
  selector: 'app-cat-sub',
  templateUrl: './cat-sub.page.html',
  styleUrls: ['./cat-sub.page.scss'],
})
export class CatSubPage implements OnInit {

  entity = {
    categoria: null,
    subCategoria: null
  }

  categorias: any[];
  subCategorias: any[]
  
  constructor(private modalCtrl: ModalController,
    private ref: ChangeDetectorRef,
    private tools: ToolsService) { }

  ngOnInit() {
    this.loadCategorias();
  }

  async loadCategorias(){
    
  }
  async seleccionarCategoria(){
    this.ref.detectChanges();
    this.entity.subCategoria = null;
    this.subCategorias = [];
    /*var responseHttp = await this.inventarioService.getSubCategoriasByCategoriaNAV(this.entity.categoria.Code);
    if(responseHttp.resultado){
      this.subCategorias = responseHttp.registros;
    }*/
  }

  crear(){
    //console.log(this.entity)
    if(this.entity.categoria!=null){
      this.modalCtrl.dismiss({
        resultado: this.entity
      });
    }else{
      this.tools.showErrorToast("Debe de seleccionar una categoría.");
    }
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}

