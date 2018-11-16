import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';

/**
 * Generated class for the StationSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-station-search',
  templateUrl: 'station-search.html',
})
export class StationSearchPage {
	stationQuery:any;
	stations:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, public services:UserservicesProvider) {
  	// this.services.getStations('london').then( data=>{
  	// 	console.log(data);
  	// })
  	// .catch( error=>{
  	// 	console.error(error);
  	// })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad StationSearchPage');
  }

  close(){
  	this.viewCtrl.dismiss();
  }

  onInput(event){
  	if(this.stationQuery){
  		this.stations.length = 0;
  		this.services.getStations(this.stationQuery).then( data=>{
	  		this.stations = data['matches']
	  	})
	  	.catch( error=>{
	  		console.error(error);
	  	})
  	}
  }

  selectStation(station){
  	let str = {
  		name: station.name,
  		icsId: station.icsId
  	}
  	this.viewCtrl.dismiss({ station:str});
  }

}
