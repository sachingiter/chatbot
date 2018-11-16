var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
/*
  Generated class for the UserservicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
// let SERVER_URL = "http://192.168.43.15/chatbot/index.php/api/"
var SERVER_URL = "http://ec2-54-205-150-112.compute-1.amazonaws.com/chatbot/index.php/api/";
var CHAT_URL = "http://ec2-54-205-150-112.compute-1.amazonaws.com:8000/";
var LOGIN_URL = SERVER_URL + "login";
var REGISTER_URL = SERVER_URL + "register";
var VERIFY_MOBILENO_URL = SERVER_URL + "verifyMobileNo";
var UPDATE_PROFILE_REG_URL = SERVER_URL + "updateProfileReg";
var USER_CARDS_URL = SERVER_URL + "getUserCards";
var ADD_CARD_URL = SERVER_URL + "addCard";
var VALIDATE_FB_DATA_URL = SERVER_URL + "validateFbData";
var ADD_FB_USER_URL = SERVER_URL + "addFbUser";
var UserservicesProvider = /** @class */ (function () {
    function UserservicesProvider(http, alertCtrl, toastCtrl) {
        this.http = http;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        // console.log('Hello UserservicesProvider Provider');
    }
    UserservicesProvider.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            position: 'middle',
            duration: 3000,
            cssClass: "customToast"
        });
        toast.present();
    };
    UserservicesProvider.prototype.errorToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            position: 'middle',
            duration: 3000,
            cssClass: "errorToast"
        });
        toast.present();
    };
    UserservicesProvider.prototype.chat = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('message', param)
            .set('user_id', this.getUserId());
        // http://ec2-54-205-150-112.compute-1.amazonaws.com:8000/mymessage####1
        // let test = 'https://opentable.herokuapp.com/api/restaurants?address=oxford%20street'
        // CHAT_URL+param+"####"+this.getUserId()
        // CHAT_URL+param+"####"+this.getUserId()
        return new Promise(function (resolve, reject) {
            _this.http.get(CHAT_URL + param, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.alertBox = function (message) {
        var alert = this.alertCtrl.create({
            message: message,
            buttons: ["Ok"]
        });
        alert.present();
    };
    UserservicesProvider.prototype.login = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('mobile', param.mobile)
            .set('password', param.password);
        return new Promise(function (resolve, reject) {
            _this.http.post(LOGIN_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.register = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('mobile', param.mobile)
            .set('password', param.password);
        return new Promise(function (resolve, reject) {
            _this.http.post(REGISTER_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.verifyMobileNo = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('mobile', param.mobile)
            .set('code', param.code);
        return new Promise(function (resolve, reject) {
            _this.http.post(VERIFY_MOBILENO_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.updateProfileReg = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('mobile', param.mobile)
            .set('name', param.name)
            .set('email', param.email);
        return new Promise(function (resolve, reject) {
            _this.http.post(UPDATE_PROFILE_REG_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.getUserCards = function () {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('user_id', btoa(this.getUserId()));
        return new Promise(function (resolve, reject) {
            _this.http.get(USER_CARDS_URL, { params: dataToSend }).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.addCard = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('cardno', param.cardno)
            .set('name', param.name)
            .set('expiry', param.expiry)
            .set('cvv', param.cvv)
            .set('user_id', this.getUserId());
        return new Promise(function (resolve, reject) {
            _this.http.post(ADD_CARD_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.validateFbLogin = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('name', param.name)
            .set('email', param.email)
            .set('id', param.id);
        return new Promise(function (resolve, reject) {
            _this.http.post(VALIDATE_FB_DATA_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.addFbUser = function (param) {
        var _this = this;
        var dataToSend = new HttpParams()
            .set('userID', param.userID);
        return new Promise(function (resolve, reject) {
            _this.http.post(ADD_FB_USER_URL, dataToSend, {}).subscribe(function (data) {
                resolve(data);
            }, function (err) {
                reject(err);
            });
        });
    };
    UserservicesProvider.prototype.getUserId = function () {
        return JSON.parse(localStorage.getItem("userDetails")).user_id;
    };
    UserservicesProvider.prototype.getUserName = function () {
        return JSON.parse(localStorage.getItem("userDetails")).user_name;
    };
    UserservicesProvider.prototype.getUserEmail = function () {
        return JSON.parse(localStorage.getItem("userDetails")).user_email;
    };
    UserservicesProvider.prototype.getUserMobile = function () {
        return JSON.parse(localStorage.getItem("userDetails")).user_mobile;
    };
    UserservicesProvider.prototype.getUserImage = function () {
        return JSON.parse(localStorage.getItem("userDetails")).user_image;
    };
    UserservicesProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, AlertController, ToastController])
    ], UserservicesProvider);
    return UserservicesProvider;
}());
export { UserservicesProvider };
// aNJpQvzqZM5EEKgGdXdlmtmexDA=
/**
 *
 * cordova plugin add cordova-plugin-facebook4 --variable APP_ID=237108050390055 --variable APP_NAME=ChatBot --save
 * ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="237108050390055" --variable APP_NAME="ChatBot"
 */
//# sourceMappingURL=userservices.js.map