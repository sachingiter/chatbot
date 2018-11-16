import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
     public viewCtrl:ViewController) {
  }

  ionViewDidLoad(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.loadMap();
    });
    
  }

  ionViewDidEnter(){
    
  }

  addMarker(){
 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      draggable: true
    });
   
    let content = "<b>I am here</b>";         
   
    this.addInfoWindow(marker, content);
   
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    var self = this;
   
    google.maps.event.addListener(marker, 'click', function(data) {
      // console.log(data.latLng.lat() +" - "+data.latLng.lng())
      self.close(data.latLng.lat(), data.latLng.lng());
    });

    google.maps.event.addListener(marker, 'dragend', function(data) {
      infoWindow.open(this.map, marker);
    });
   
  }

  close(lat, long){
    console.log(lat+long);
    let data = {
  		lat: lat,
  		long: long
  	}
  	this.viewCtrl.dismiss({ location:data });
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  loadMap(lat=0, long=0){
 
    let latLng = new google.maps.LatLng(lat, long);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }

}
