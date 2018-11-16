import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserservicesProvider } from "../../providers/userservices/userservices";

/**
 * Generated class for the VerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class VerificationPage {

  code1:any;
  code2:any;
  code3:any;
  code4:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices:UserservicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerificationPage');
  }

  verify(){
    let dataToSend = {
      code : this.code1+""+this.code2+""+this.code3+""+this.code4,
      mobile: this.userServices.getUserMobile()
    }

    this.userServices.verifyMobileNo(dataToSend).then( data=> {

    })
    .catch( error=> {
      
    })
  }

}
