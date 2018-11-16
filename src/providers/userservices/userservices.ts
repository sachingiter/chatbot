import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the UserservicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

// let SERVER_URL = "http://192.168.43.15/chatbot/index.php/api/"
let SERVER_URL = "http://ec2-54-205-150-112.compute-1.amazonaws.com/chatbot/index.php/api/";
let CHAT_URL = "http://ec2-54-205-150-112.compute-1.amazonaws.com:8000/"
let LOGIN_URL = SERVER_URL+"login";
let REGISTER_URL = SERVER_URL+"register";
let VERIFY_MOBILENO_URL = SERVER_URL+"verifyMobileNo";
let UPDATE_PROFILE_REG_URL = SERVER_URL+"updateProfileReg";
let USER_CARDS_URL = SERVER_URL+"getUserCards";
let ADD_CARD_URL = SERVER_URL+"addCard";
let VALIDATE_FB_DATA_URL = SERVER_URL+"validateFbData";
let ADD_FB_USER_URL = SERVER_URL+"addFbUser";

@Injectable()
export class UserservicesProvider {

  constructor(public http: HttpClient, public alertCtrl:AlertController, public toastCtrl:ToastController) {
    // console.log('Hello UserservicesProvider Provider');
  }

  toast(message){
    let toast = this.toastCtrl.create({
      message:message,
      position:'middle',
      duration:3000,
      cssClass:"customToast"
    });
    toast.present();
  }

  errorToast(message){
    let toast = this.toastCtrl.create({
      message:message,
      position:'middle',
      duration:3000,
      cssClass:"errorToast"
    });
    toast.present();
  }

  chat(param){
    const dataToSend = new HttpParams()
    .set('message', param)
    .set('user_id', this.getUserId());

    // http://ec2-54-205-150-112.compute-1.amazonaws.com:8000/mymessage####1

    // let test = 'https://opentable.herokuapp.com/api/restaurants?address=oxford%20street'
    // CHAT_URL+param+"####"+this.getUserId()
    // CHAT_URL+param+"####"+this.getUserId()
    return new Promise((resolve, reject) => {
      this.http.post(CHAT_URL,dataToSend,{}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  rail_info(param){
    const dataToSend = new HttpParams()
    .set('message', '')
    .set('rail_info', param.data)
    .set('user_id', this.getUserId());

    return new Promise((resolve, reject) => {
      this.http.post(CHAT_URL,dataToSend,{}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  flightBook(param){
    const dataToSend = new HttpParams()
    .set('message', '')
    .set('flight_info', param)
    .set('user_id', this.getUserId());

    return new Promise((resolve, reject) => {
      this.http.post(CHAT_URL,dataToSend,{}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getCabs(lat, long){
    const dataToSend = new HttpParams()
    .set('lat', lat)
    .set('lon', long);

    let url = "https://api.tfl.gov.uk/Cabwise/search?lat="+lat+"&lon="+long;
    // let url = "https://api.tfl.gov.uk/Cabwise/search?lat=51.503134&lon=0.050119";
    console.log(url);

    return new Promise((resolve, reject) => {
      this.http.get(url,{}).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  alertBox(message){
    let alert = this.alertCtrl.create({
      message:message,
      buttons:["Ok"]
    });
    alert.present();
  }

  login(param) {
    const dataToSend = new HttpParams()
        .set('mobile', param.mobile)
        .set('password', param.password);

      return new Promise((resolve, reject) => {
        this.http.post(LOGIN_URL, dataToSend, {}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }
  
  register(param) {
    const dataToSend = new HttpParams()
        .set('mobile', param.mobile)
        .set('password', param.password);
        
      return new Promise((resolve, reject) => {
        this.http.post(REGISTER_URL, dataToSend, {}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }
  
  verifyMobileNo(param) {
    const dataToSend = new HttpParams()
        .set('mobile', param.mobile)
        .set('code', param.code);
        
      return new Promise((resolve, reject) => {
        this.http.post(VERIFY_MOBILENO_URL, dataToSend, {}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }
  
  updateProfileReg(param) {
    const dataToSend = new HttpParams()
        .set('mobile', param.mobile)
        .set('name', param.name)
        .set('email', param.email);
        
      return new Promise((resolve, reject) => {
        this.http.post(UPDATE_PROFILE_REG_URL, dataToSend, {}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }

  getUserCards(){
    const dataToSend = new HttpParams()
        .set('user_id', btoa( this.getUserId()));
        
    return new Promise((resolve, reject) => {
      this.http.get(USER_CARDS_URL, { params:dataToSend }).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  addCard(param) {
    const dataToSend = new HttpParams()
        .set('cardno', param.cardno)
        .set('name', param.name)
        .set('expiry', param.expiry)
        .set('cvv', param.cvv)
        .set('user_id', this.getUserId());
        
      return new Promise((resolve, reject) => {
        this.http.post(ADD_CARD_URL, dataToSend, {}).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }

  validateFbLogin(param){
    const dataToSend = new HttpParams()
        .set('name', param.name)
        .set('email', param.email)
        .set('id', param.id);

      return new Promise((resolve, reject) => {
        this.http.post(VALIDATE_FB_DATA_URL, dataToSend, { }).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }

  addFbUser(param){
    const dataToSend = new HttpParams()
        .set('userID', param.userID);

      return new Promise((resolve, reject) => {
        this.http.post(ADD_FB_USER_URL, dataToSend, { }).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
  }

  getStations(queryString){
    const dataToSend = new HttpParams()
        .set('modes', 'bus,tube,national-rail,dlr,overground,tflrail,river-bus,tram,cable-car,coach' )
        .set('maxResults', '25')
        .set('faresOnly', 'false')
        .set('includeHubs', 'true')
        .set('app_id', '8268063a')
        .set('app_key', '14f7f5ff5d64df2e88701cef2049c804')
        .set('tflOperatedNationalRailStationsOnly', 'false');
        
    return new Promise((resolve, reject) => {
      this.http.get('https://api.tfl.gov.uk/StopPoint/search/'+queryString, { params:dataToSend }).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getHotelList(data){
    let URL = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle";
    
    const dataToSend = new HttpParams()
      .set("latitude", data.lat)
      .set("longitude", data.long)
      .set("radius", data.radius)
      .set("check_in", data.check_in)
      .set("check_out", data.check_out)
      .set("number_of_results", "10")
      .set("apikey", "7FARtFvTPumt5gAs1oTJpphZEarPAarQ");

      return new Promise((resolve, reject) => {
        this.http.get(URL, { params:dataToSend }).subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });

  }
  
  getUserId(){
    return JSON.parse(localStorage.getItem("userDetails")).user_id
  }

  getUserName(){
    return JSON.parse(localStorage.getItem("userDetails")).user_name
  }

  getUserEmail(){
    return JSON.parse(localStorage.getItem("userDetails")).user_email
  }

  getUserMobile(){
    return JSON.parse(localStorage.getItem("userDetails")).user_mobile
  }

  getUserImage(){
    return JSON.parse(localStorage.getItem("userDetails")).user_image
  }

}



// aNJpQvzqZM5EEKgGdXdlmtmexDA=
/**
 * 
 * cordova plugin add cordova-plugin-facebook4 --variable APP_ID=237108050390055 --variable APP_NAME=ChatBot --save
 * ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="237108050390055" --variable APP_NAME="ChatBot"
 */
