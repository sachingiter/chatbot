import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  mobile:any;
  password:any;
  LoginData:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices:UserservicesProvider,
    public loadingCtrl:LoadingController,
    public events:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logIn(){
    	let loader = this.loadingCtrl.create();
		loader.present();
	    let dataToSend = {
	      mobile:this.mobile,
	      password:this.password
	    }
    	this.userServices.login(dataToSend).then( (data:any)=> {

			loader.dismiss();
			console.log(data);
			if(data['success']){
				console.log(data);
				this.userServices.toast(data['message']);
				localStorage.setItem("userDetails",JSON.stringify(data.userDetails));
				if(localStorage.getItem("userDetails")){
					this.LoginData = JSON.parse(localStorage.getItem("userDetails"))
					console.log(this.LoginData)
					if(this.LoginData.user_name && this.LoginData.user_name.trim() == "" ){
						this.navCtrl.push('PersonalinfoPage',{mobile:this.LoginData.user_mobile});
					}
					else{
						this.events.publish("login");
					}
				}
        		// this.navCtrl.setRoot('HomePage');
        		
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
