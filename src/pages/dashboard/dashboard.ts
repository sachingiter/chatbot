import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content, ModalController, ActionSheetController } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';
import * as firebase from 'Firebase';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  @ViewChild(Content) content: Content;

  loader:boolean = false;

  compose:any;
  messages:any = [];
  // messages:any = [{resturant:[{name:"Sayaji"}]}];
  chats:any;

  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  i = 10;
  dbName:any;

  fromStation:any;
  toStation:any;
  fromicsId:any;
  toicsId:any;

  openForm:boolean = false;


  openFlightForm:boolean = false;
  journeyStartDate:any = '2018-07-16';
  journeyEndDate:any;
  isTwoWayJourney:boolean = false;
  flightSource:any = '';
  flightDestination:any = '';

  // Hotel
  hotelRadius:number;
  checkIn:any;
  checkOut:any;
  openHotelForm:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userServices:UserservicesProvider, private callNumber: CallNumber,
    public modalCtrl:ModalController, private geolocation: Geolocation, public actionSheet:ActionSheetController) {
    // this.ref.on('value', resp => {
    //   this.rooms = [];
    //   this.rooms = snapshotToArray(resp);
    // });
    // let geo = new Geoposition();
  }

  ionViewDidEnter() {
    setTimeout( ()=>{
      if(this.userServices.getUserName())
        this.dbName = this.userServices.getUserName().replace(" ", "_")+this.userServices.getUserId();
      else
        this.dbName = this.userServices.getUserId();
      this.loadOldChat();
    }, 1000);
    
  }

  loadOldChat(){
    this.loader = true;
    firebase.database().ref('chatrooms/'+this.dbName).on('value', resp => {
      this.loader = false;
      this.messages = snapshotToArray(resp);
      console.log(this.messages);
      this.scrolltoBottom();
    });
    this.i ++;
  }

  createChat(from,message,restaurants = null, flights=null, cabs=null, hotels=null){
    // let newData = this.ref.push();
    // newData.set({
    //   roomname:"praveen"
    // });
    let splitedMsg = message.split('@@@@');
    if(message){
        message = splitedMsg[0];
    }
      let firebaseMessageObj: any ={
      from : from,
      message : message,
      restaurants : (restaurants)?restaurants:'',
      flights : (flights)?flights:'',
      cabs : (cabs)?cabs:'',
      hotels : (hotels)?hotels:'',
      time:Date(),
      question_id:''
    };
      if(splitedMsg.length > 1){
        firebaseMessageObj.question_id = splitedMsg[1];
      }

    let dbName = this.userServices.getUserName().replace(" ", "_")+this.userServices.getUserId();
    let joinData = firebase.database().ref('chatrooms/'+this.dbName).push();
    joinData.set(firebaseMessageObj);    
  }

  clearSession(){
    let msg = {
      message:"new",
      from:'user'
    }
    this.messages.push(msg);
    this.scrolltoBottom();

    let dataToSend = "new"; 
    this.compose = null;

    this.userServices.chat(dataToSend).then( data=> {
      console.log(data);
      let fromsms = {
        message : data['message'],
        from : 'bot',
        action : data['action'],
        restaurants : data['restaurants']
      }
      this.createChat('bot', fromsms.message);
      this.messages.push(fromsms);
      this.scrolltoBottom();
      this.compose = null;
    })
    .catch( error=> {

    })
  }

  chat(){
    this.loader = true;
    let msg = {
      message:this.compose,
      from:'user'
    }
    this.messages.push(msg);
    this.scrolltoBottom();
    let dataToSend = this.compose; 
      this.compose = null;
      this.createChat(this.userServices.getUserId(), msg.message);
      this.userServices.chat(dataToSend).then( data=> {
      this.loader = false;
      let splitMsg = data['message'].split('@@@@');
      console.log(data['message']);
      let fromsms = {
        message : splitMsg[0],
        from : 'bot',
        action : data['action'],
        restaurants : data['restaurants'],
        flights : ""
      }
      if(data['action'] == 'train'){
        this.openForm = true;
        this.scrolltoBottom();
      }
      if(data['action'] == 'cab'){
        console.log('cab1');
        fromsms.message = "Getting your location..."
        this.askLocationOptions();
      }
      if(data['action'] == 'flight_confirmation'){
        this.flightSource = data['flight_details'].source;
        this.flightDestination = data['flight_details'].destination;
        this.journeyStartDate = data['flight_details'].date;
        this.openFlightForm = true;
        this.scrolltoBottom();
      }
      if(data['action'] == 'hotel_confirmation'){
        this.openHotelForm = true;
        this.hotelRadius = data['hotel_details'].range.value;
        fromsms.message = 'Please fill following details for you city "'+ data['hotel_details'].city + '"...';
      }
      this.messages.push(fromsms);
      console.log(fromsms);
      this.createChat('bot', data['message'], fromsms.restaurants);
      this.scrolltoBottom();
      this.compose = null;
    })
    .catch( error=> {
      console.log(error);
      this.loader = false;
    })
  }

  scrolltoBottom(){
    setTimeout( ()=>{
        try{
          this.content.scrollToBottom();
        }catch(error){}
      },300);
  }

  askLocationOptions(){
    let actionSheet = this.actionSheet.create({
      title:"Options",
      buttons: [{
        text:"Use current Location",
        handler: ()=>{
          this.geolocation.getCurrentPosition().then( resp=>{
            this.sendLocation(resp.coords.latitude, resp.coords.longitude)
          })
          .catch(error=>{
            this.userServices.errorToast("Unable to fetch your location, Plaese select ");
          });
        }
      },{
        text: "Choose on map",
        handler: ()=>{
          this.openMap();
        }
      },{
        text:"cancel",
        role:"Cancel",
        handler: ()=>{
          actionSheet.dismiss();
        }
      }]
    });
    actionSheet.present();
  }

  openMap(){
    let modal = this.modalCtrl.create('MapPage');
    modal.onDidDismiss( data=>{
      if(data && data.location){
        this.sendLocation(data.location.lat, data.location.long);
      }
      else{
        this.userServices.errorToast("You did not select location");
      }
    });
    modal.present();
  }

  sendLocation(lat, long){

    // if(localStorage.getItem("latitude") && localStorage.getItem("longitude") ){
      this.getCabs(lat, long);
    // }
    // else{
    //   let options:GeolocationOptions = {
    //     enableHighAccuracy : true,
    //   }
    //   this.geolocation.getCurrentPosition(options).then((resp) => {
    //     console.log(resp.coords);
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //   this.getCabs(resp.coords.latitude, resp.coords.longitude);
    //   }).catch((error) => {
    //     console.log('Error getting location', error);
    //   });
    // }
  }

  getCabs(lat, long){
    console.log("getCabs fn");
    this.loader = true;
    this.userServices.getCabs(lat, long).then( data=> {
      this.loader = false;
      console.log(data['Operators'].OperatorList.length);
      if(data['Operators'].OperatorList.length > 0){
        if(data['Operators'].OperatorList.length >= 5){
          let cabs:any = [];

          for (var i = 0; i <5 ; i++) {
            cabs.push(data['Operators'].OperatorList[i]);
          }
          console.log(cabs);
          let fromsms = {
            message : 'Available Cabs are',
            from : 'bot',
            action : null,
            restaurants : null,
            flights : null,
            cabs : cabs
          }

          this.messages.push(fromsms);

          this.createChat('bot', fromsms.message, null, null, fromsms.cabs);
        
          setTimeout( ()=>{
            this.content.scrollToBottom();
          },300);
          this.compose = null;
        }
        else{
          let cabs:any = [];

          for (var j = 0; j < data['Operators'].OperatorList.length ; j++) {
            cabs.push(data['Operators'].OperatorList[j]);
          }
          console.log(cabs);
          let fromsms = {
            message : 'Available Cabs are',
            from : 'bot',
            action : null,
            restaurants : null,
            flights : null,
            cabs : cabs
          }

          this.messages.push(fromsms);

          this.createChat('bot', fromsms.message, null, null, fromsms.cabs);
        
          setTimeout( ()=>{
            this.content.scrollToBottom();
          },300);
        }
      }
      else{
        console.log("cab else array 0")
        let fromsms = {
            message : 'Sorry, no cabs available at your location',
            from : 'bot',
            action : null,
            restaurants : null,
            flights : null,
            cabs : null
          }

          this.messages.push(fromsms);

          this.createChat('bot', fromsms.message, null, null, null);
        
          setTimeout( ()=>{
            this.content.scrollToBottom();
          },300);
      }
      
    })
    .catch( error=>{
      console.log(error);
      this.loader = false;
    })
  }

  callCabService(BookingsPhoneNumber, from=null){
    let phoneno = BookingsPhoneNumber;
    if(from == 'fromHotel'){
      phoneno = "+"+BookingsPhoneNumber.replace("/","");
    }
    console.log(phoneno);
    this.callNumber.callNumber(phoneno, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  openMapApplication(lat, long){
    // window
  }

  fromModal(){
    this.fromStation = null;
    let modal = this.modalCtrl.create('StationSearchPage');
    modal.onDidDismiss( data=>{
      console.log(data)
      if(data.station)
        {this.fromStation = data.station.name;
                this.fromicsId = data.station.icsId;}
    });
    modal.present();
  }

  toModal(){
    this.toStation = null;
    let modal = this.modalCtrl.create('StationSearchPage');
    modal.onDidDismiss( data=>{
      console.log(data)
      if(data.station)
        {this.toStation = data.station.name;
                this.toicsId = data.station.icsId}
    });
    modal.present();
  }

  sendStations(){

    this.openForm = false;
    this.loader = true;
    // Acton Town Underground Station@@@1000002@@@Stamford Hill Rail Station@@@1001265
    let query = {
      data:this.fromStation+'@@@'+this.fromicsId+'@@@'+this.toStation+'@@@'+this.toicsId
    };
    this.userServices.rail_info(query).then( data=>{
      this.loader = false;
      this.fromStation = null;
      this.toStation = null;
      this.toicsId = null;
      this.fromicsId = null;
      let splitMsg = data['message'].split('@@@@');
      let fromsms = {
        message : splitMsg[0],
        from : 'bot',
        action : data['action'],
        restaurants : data['restaurants'],
        flights : ''
      }
      if(data['action']){
        this.openForm = true;
        this.scrolltoBottom();
      }
      if(data['action'] == 'flight_confirmation'){
        this.flightSource = data['flight_details'].source;
        this.openFlightForm = true;
        this.scrolltoBottom();
      }
      this.messages.push(fromsms);
      console.log(fromsms);
      this.createChat('bot', fromsms.message, fromsms.restaurants);
      
      setTimeout( ()=>{
        this.content.scrollToBottom();
      },300);
      this.compose = null;

    })
    .catch( error=>{
      console.log(error);
      this.loader = false;
    })
  }

  openTwoWay(){
    this.isTwoWayJourney = true;
    setTimeout( ()=>{
        this.content.scrollToBottom();
      },300);
  }

  submitJourneydate(){
    this.openFlightForm = false;
    this.loader = true;
    let param ='';
    if(this.journeyEndDate)
      param = this.flightSource+"@@@"+this.flightDestination+"@@@"+this.journeyStartDate+"@@@"+this.journeyEndDate;
    else
      param = this.flightSource+"@@@"+this.flightDestination+"@@@"+this.journeyStartDate;
  
    this.userServices.flightBook(param).then( data=>{
      this.loader = false;
      this.flightSource = null;
      this.flightDestination = null;
      let splitMsg = data['message'].split('@@@@');
      let fromsms = {
        message : splitMsg[0],
        from : 'bot',
        action : data['action'],
        restaurants : data['restaurants'],
        flights : data['flights'],
      }
      console.log(fromsms);
      // if(data['action'] == ''){
      //   this.openForm = true;
      //   this.scrolltoBottom();
      // }
      if(data['action'] == 'flight_confirmation'){
        this.openFlightForm = true;
        this.scrolltoBottom();
      }
      this.messages.push(fromsms);
      console.log(fromsms);
      this.createChat('bot', fromsms.message, null, fromsms.flights);
      
      setTimeout( ()=>{
        this.content.scrollToBottom();
      },300);
      this.compose = null;
    })
    .catch( error=>{
      console.log(error);
      this.loader = false;
    })

  }

  bookHotel(){
    this.loader = true;
    let dataToSend :any = {
      lat : '43.6',
      long : '7.2', 
      radius : this.hotelRadius,
      check_in : this.checkIn,
      check_out : this.checkOut
    };
    this.openHotelForm = false;
    this.geolocation.getCurrentPosition().then( resp=>{
      // this.sendLocation(resp.coords.latitude, resp.coords.longitude)
      dataToSend.lat = resp.coords.latitude;
      dataToSend.long = resp.coords.longitude;
      
      this.userServices.getHotelList(dataToSend).then( data=>{
        this.loader = false;
        this.hotelRadius = 0;
        this.checkIn = null;
        this.checkOut = null;

        let fromsms = {
          message : "Available Hotel are",
          from : 'bot',
          action : null,
          restaurants : null,
          flights : null,
          hotels: data['results']
        };
        if(data['results'].length == 0){
          fromsms.message = "No Hotels available at your location";
        }
        this.messages.push(fromsms);
        this.createChat('bot', fromsms.message, null,null,null, fromsms.hotels);
        this.scrolltoBottom();
      })
      .catch( error=>{
        this.loader = false;
      })
    })
    .catch(error=>{
      this.loader = false;
      this.userServices.errorToast("Unable to fetch your location, Plaese select ");
    })
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

/*
http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude=43.6&longitude=7.2&radius=50&check_in=2018-07-25&check_out=2018-07-30&number_of_results=50&apikey=7FARtFvTPumt5gAs1oTJpphZEarPAarQ
*/
