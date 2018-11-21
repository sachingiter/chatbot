import { Component } from '@angular/core';
import { IonicPage,NavController, LoadingController, MenuController, Events } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';
import { Facebook } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mobile:any;
  password:any;
  passwordType:any = 'password';

  constructor(public navCtrl: NavController, public userServices:UserservicesProvider,public loadingCtrl:LoadingController,
     public menuCtrl: MenuController, public events:Events, public facebook:Facebook) {
       console.log("isUserLogin - "+localStorage.getItem("isUserLogin"));
    if(localStorage.getItem("isUserLogin") == "true"){
      this.events.publish("login");
		}
  }

  login(){
    let loader = this.loadingCtrl.create();
    loader.present();

    var dataToSend = {
      mobile:this.mobile,
      password:this.password
    };

    this.userServices.login(dataToSend).then( data=> {
			loader.dismiss();
			if(data['success']){
        localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
        localStorage.setItem("isUserLogin","true");
        this.events.publish("login");
				// this.userServices.alertBox(data['message']);
				this.navCtrl.setRoot('DashboardPage');
			}
			else{
				this.userServices.alertBox( data['message']);
			}
		})
		.catch( error=> {
			loader.dismiss();
			this.userServices.alertBox( JSON.stringify(error));
    });
    
  }

  fbLogin(){
    
      this.facebook.login(['public_profile','email']).then(res => {
        if(res.status === "connected") {
          console.log('res 2 '+ localStorage.setItem("fbdata", JSON.stringify(res)) );
          let params = new Array<string>();
          this.facebook.api("/me?fields=name,gender,email", params).then( user=> {
            console.log(user);
            localStorage.setItem("user",JSON.stringify(user));
            this.getUserDetail(user);
          })
          // this.getUserDetail(res.authResponse, res.status);
        } else {
        //   this.isLoggedIn = false;
        }
      })
      .catch(e => {
        console.log('Error logging into Facebook', e);
          this.fbLogout();
      });
    
  } 
  // {name: "Praveen Patel", email: "praveenptl71@yahoo.com.au", id: "1673149249438619"}

  getUserDetail(data){
    let loader = this.loadingCtrl.create();
    loader.present();
    // if(status == 'connected'){
      // let dataToSend = {
      //   userID: data.userID
      // }

      this.userServices.validateFbLogin(data).then( data=> {
        loader.dismiss();
        if(data['success']){
          localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
          localStorage.setItem("isUserLogin","true");
          this.events.publish("login");
          this.navCtrl.setRoot('DashboardPage');
        }
        else{
          this.fbLogout();
          this.userServices.alertBox( data['message']);
        }
      })
      .catch( error=> {
        loader.dismiss();
        this.userServices.alertBox( JSON.stringify(error) );
      })

    // }
    // else{
    //   let dataToSend = {
    //     userID: data.userID
    //   }

    //   this.userServices.addFbUser(dataToSend).then( data=> {
    //     loader.dismiss();
    //     if(data['success']){
    //       localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
    //       localStorage.setItem("isUserLogin","true");
    //       this.events.publish("login");
    //       this.navCtrl.setRoot('DashboardPage');
    //     }
    //     else{
    //       this.fbLogout();
    //       this.userServices.alertBox( data['message']);
    //     }
    //   })
    //   .catch( error=> {
    //     loader.dismiss();
    //     this.userServices.alertBox( JSON.stringify(error) );
    //   })
    // }
  }

  fbLogout(){
    this.facebook.logout().then(data=>{}).catch(error=>{});
  }

  signup(){
    this.navCtrl.push('SignupPage');
  }

  logIn(){
    this.navCtrl.push('LoginPage');
  }

  showHide(){
    console.log(this.passwordType);
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  registerFbLogin(){

  }

}

/*

{"status":"connected","authResponse":{"accessToken":"EAADXpgUd7CcBAMdlaZBmxcGT2lkfSwiR8vUmtuuGdjpbY2Eip4Ihzgx4RZBJZCZCWy9beEjOagcdqTZCT9sZAwpdVRyntcau3F2sxJX1kltZC8sncnydFmTltapozzNxTPazceqLKCx5lxn3KbuAmZBZApgUhd9c60L56t0oyeySBzNHd6iWKmxeP4YO2w0CIbY96DZCLNiOOwkZAeMsEArOSz9oqonFJ7YyV8ZD","expiresIn":"5183997","session_key":true,"sig":"...","userID":"1673149249438619"}}

*/
