import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserservicesProvider } from "../../providers/userservices/userservices";

/**
 * Generated class for the BillinginfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-billinginfo',
  templateUrl: 'billinginfo.html',
})
export class BillinginfoPage {

  cards:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices:UserservicesProvider) {
  }

  ionViewDidEnter() {
    // console.log('ionViewDidLoad BillinginfoPage');
    this.getCards();
  }

  addCard(){
    this.navCtrl.push('AddcardPage');
  }

  getCards(){
    this.userServices.getUserCards().then( data=>{
      if(data['success']){
        this.cards = data['cards'];
      }
      else{
        this.userServices.toast(data['message']);
      }
    })
    .catch( error=> {
      this.userServices.toast(JSON.stringify(error));
    })
  }

}
