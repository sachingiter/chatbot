import { Component, ViewChild } from '@angular/core';
import { Nav,Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserservicesProvider } from '../providers/userservices/userservices';
import * as firebase from 'firebase';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';

// import { HomePage } from '../pages/home/home';

const config = {
  apiKey: 'AIzaSyDUTor5Ej8M1J1X5ellJHb_J9cYHYJzpHI',
  // authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'https://chatbot-64513.firebaseio.com/',
  projectId: 'chatbot-64513',
  // storageBucket: 'YOUR_STORAGE_BUCKET',
};


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = 'HomePage';
  // rootPage:any = 'SignupPage';

  user_name:any;
  user_mobile:any;
  user_image:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public menuCtrl: MenuController,
    public events:Events, public userServices:UserservicesProvider, private geolocation: Geolocation) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.menuCtrl.swipeEnable(false);
      this.events.subscribe("login", data=>{
        this.loginEvent();
      })
      // let apps = document.getElementsByTagName("body");
      // apps[0].style.fontFamily = "Arial, Helvetica, sans-serif";
      // console.log(apps);
      let htmlRoot:HTMLElement = <HTMLElement> document.getElementsByTagName("html")[0];
      htmlRoot.style.fontFamily = "Courier New";
      console.log( document.getElementsByTagName("html")[0].style.fontFamily)
      firebase.initializeApp(config);

      let options:GeolocationOptions = {
        enableHighAccuracy : true,
      }
      this.geolocation.getCurrentPosition(options).then((resp) => {
        console.log(resp.coords);
      // resp.coords.latitude
      // resp.coords.longitude
      localStorage.setItem("latitude", resp.coords.latitude+"");
      localStorage.setItem("longitude",  resp.coords.longitude+"");
      }).catch((error) => {
        console.log('Error getting location', error);
      });

    });
  }

  loginEvent(){
    setTimeout(()=>{
      this.menuCtrl.swipeEnable(true);
    }, 500);
    this.user_name = this.userServices.getUserName();
    this.user_mobile = this.userServices.getUserMobile();
    console.log("image1 - "+this.userServices.getUserImage());
    if(this.userServices.getUserImage()){
      // console.log("image2 - "+this.user_image);
      this.user_image = this.userServices.getUserImage();
      console.log("image2 - "+this.user_image);
    }
    else{
      this.user_image = 'assets/imgs/mobile.png';
    }
    this.nav.setRoot('DashboardPage');
  }

  logout(){
    console.log('logout');
    localStorage.removeItem("userDetails");
    localStorage.removeItem("isUserLogin");
    this.menuCtrl.swipeEnable(false);
    this.nav.setRoot('HomePage');
  }

  profile(){
    this.nav.push('PersonalinfoPage',{ redirect_from:'menu' });
  }

  billing(){
    this.nav.push('BillinginfoPage');
  }

  boking(){

  }

  history(){

  }

  about(){

  }

  faq(){

  }
}

