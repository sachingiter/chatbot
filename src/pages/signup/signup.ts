import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  name:any;
  email:any;
  phone_number:any;
  address:any;
  password:any;
  confirmpassword:any;
  passmatch:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices:UserservicesProvider,
    public loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SignupPage');
  }

  checkPassword(){
    if(this.confirmpassword){
      if(this.password != this.confirmpassword){
        this.passmatch = true
      }
      else{
        this.passmatch = false;
      }
    }
  }

  verify(){
    this.navCtrl.push('VerificationPage');
  }

  logIn(){
    this.navCtrl.push('LoginPage');
  }

  signup(){
    let loader = this.loadingCtrl.create();
		loader.present();
    let dataToSend = {
      name:this.name,
      email:this.email,
      phone_number:this.phone_number,
      address:this.address,
      password:this.password
      
    }
    this.userServices.signup(dataToSend).then( data=> {
			loader.dismiss();
			if(data.error == false){
        console.log(data)
				this.userServices.toast(data['message']);
        localStorage.setItem("userDetails", JSON.stringify(data.user));
        localStorage.setItem("isUserLogin","true");
        this.navCtrl.setRoot('LoginPage');
        //this.navCtrl.push('PersonalinfoPage',{mobile:this.mobile});
			}
			else{
				this.userServices.alertBox( data['message']);
			}
		})
		.catch( error=> {
			loader.dismiss();
			this.userServices.alertBox( JSON.stringify(error));
		})
  }

}
