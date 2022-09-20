import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  loading: any;
  
  constructor(
    private alertController: AlertController,
    public loadingController: LoadingController, 
    private toastCtrl: ToastController
    ) { }

  async showNotification($titulo, $mensaje, $boton){
    const alert = await this.alertController.create({
      header: $titulo,
      message: $mensaje,
      backdropDismiss: false,
      buttons: [$boton]
    });
    await alert.present();
  }

  async showConfirm($titulo, $subtitulo, $message){
    
    const alert = await this.alertController.create({
      header: $titulo,
      subHeader: $subtitulo,
      message: $message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm'
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    return role;
  }

  
  async showErrorToast(data: any) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 2000
    });
    toast.present();
  }

  
  async presentLoading(mensaje){
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return this.loading.present();
  }

  async destroyLoading(){
    try{
      this.loading.dismiss();
    }catch(e){

    }
  }

  construirError(e){
    if(e.error.codigo){
      return "["+e.error.codigo+" "+e.error.error+"] "+e.error.mensaje;
    }else{
      return e.message;
    }
  }

  construirBoton(e){
    if(e.error.codigo){
      if(e.error.codigo==1 && e.error.error=="METODO"){
        return {
          text: 'Ok',
          role: 'cancel',
          handler: ()=>{
            //this.loginService.logout();
          }
        } 
      }else{
        return "Ok";
      }
    }else{ 
      return "Ok";
    }
  }
}
 