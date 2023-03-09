import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, IonSegment, IonSlides, AlertController, PickerController, ToastController } from '@ionic/angular';
import { CASService } from '../../services/default/cas.service';
import { FormGroup, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { LoginService } from '../../services/default/login.service';
import { ToolsService } from '../../services/default/tools.service';
import { ConfiguracionService } from '../../services/default/configuracion.service';
import { DeviceService } from '../../services/default/device.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  loading: any;
  verError = false;
  formLogin: FormGroup;
  mensajeError: any;
  showPassword = false;
  passwordToggleIcon = "eye";

  constructor( private casServices : CASService,
    public navCtrl: NavController, 
    private elementRef:ElementRef,
    public loadingController: LoadingController, 
    public formBuilder: FormBuilder,
    private alertController: AlertController, 
    private pickerCtrl: PickerController,
    private toastCtrl: ToastController,
    public tools: ToolsService,
    public device: DeviceService,
    private loginService: LoginService) { 
      this.formLogin = this.formBuilder.group({
        Username: [window.localStorage.getItem("userLogin"), Validators.compose([Validators.required])],
        Password: ['', Validators.compose([Validators.required])],
        Sistema: [environment.signature],
        withoutRC: [true],
        ad: [true]
      });
      /*if(window.localStorage['login']){
        this.navCtrl.navigateForward(['/tabs/tab4/mi-cuenta']);
      }*/
      
    }

  ionViewWillEnter(){
    if(this.loginService.validateUser()){
      this.navCtrl.navigateForward(['/tabs/tab1']);
    }
  }
  
  ngOnInit() {
    
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      this.passwordToggleIcon = "eye-off";
    }else{
      this.passwordToggleIcon = "eye";
    }
  }


  async login(){
    window.localStorage["userLogin"] = this.formLogin.controls["Username"].value;

    this.verError = false;
    this.mensajeError = "";
    if(this.formLogin.valid){
      await this.presentLoading("Espere un momento...");
      var response = await this.casServices.login(this.formLogin.value);
      this.loading.dismiss();
      if(response.ok){
        //this.formLogin.reset();
        this.formLogin.controls["Password"].setValue("");
        /*
        window.localStorage['nombre'] =  this.isLogin.datos.nombre;
        window.localStorage['correo'] =  this.isLogin.datos.correo;
        window.localStorage['exp'] =  this.isLogin.datos.exp;
        window.localStorage["operaciones"] = JSON.stringify(this.isLogin.datos.operaciones); 
        this.loginService.setDatos();*/
        ConfiguracionService.bearer = response.token;
        window.localStorage["token"] = response.token;
        this.navCtrl.navigateForward(['/tabs/tab1']);
      }else{
        this.mensajeError = response.mensaje;
        this.verError = true;
      }
    }else{
      this.presentAlert("Aviso", "Ingrese todos los datos", "Ok");
    }
  }

  async recuperarPassword(){    
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ingrese el correo de su cuenta',
      backdropDismiss: false,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Recuperar',
          handler: (alertData) => {
            if(alertData.email!=""){
              let param = {
                'email': alertData.email
              }
              this.casServices.recuperarCuenta(param);
              this.showErrorToast('Se han enviado las instrucciones a su correo.');
              return true;
            }else{
              this.showErrorToast('Email no valido');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showErrorToast(data: any) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 2000
    });
    toast.present();
  }


  async presentAlert($titulo, $mensaje, $boton){
    const alert = await this.alertController.create({
      header: $titulo,
      message: $mensaje,
      backdropDismiss: false,
      buttons: [$boton]
    });
    await alert.present();
  }


  async presentLoading(mensaje){
    this.loading = await this.loadingController.create({
      message: mensaje
    });
    return this.loading.present();
  }
}
