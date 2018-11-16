import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserservicesProvider } from "../../providers/userservices/userservices";

/**
 * Generated class for the AddcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addcard',
  templateUrl: 'addcard.html',
})
export class AddcardPage {

  cardno:any
  name:any;
  expiry:any;
  cvv:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices:UserservicesProvider,
    public loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AddcardPage');
  }

  addCard(){
    let dataToSend = {
      cardno:this.cardno,
      name:this.name,
      expiry:this.expiry,
      cvv:this.cvv,
    }
    let loader = this.loadingCtrl.create();
    loader.present();

    this.userServices.addCard(dataToSend).then( data=> {
      loader.dismiss();
      if(data['success']){
        this.cardno = '';
        this.name = '';
        this.expiry = null;
        this.cvv = '';
        this.userServices.toast(data['message'])
      }
      else{
        this.userServices.toast(data['message']);
      }
    })
    .catch( error=> {
      loader.dismiss();
      this.userServices.errorToast(JSON.stringify(error));
    })
  }

}
