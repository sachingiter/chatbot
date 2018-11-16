var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, MenuController, Events } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';
import { Facebook } from '@ionic-native/facebook';
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, userServices, loadingCtrl, menuCtrl, events, facebook) {
        this.navCtrl = navCtrl;
        this.userServices = userServices;
        this.loadingCtrl = loadingCtrl;
        this.menuCtrl = menuCtrl;
        this.events = events;
        this.facebook = facebook;
        this.passwordType = 'password';
        if (localStorage.getItem("isUserLogin") == "true") {
            this.events.publish("login");
            this.navCtrl.setRoot('DashboardPage');
        }
    }
    HomePage.prototype.login = function () {
        var _this = this;
        var loader = this.loadingCtrl.create();
        loader.present();
        var dataToSend = {
            mobile: this.mobile,
            password: this.password
        };
        this.userServices.login(dataToSend).then(function (data) {
            loader.dismiss();
            if (data['success']) {
                localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
                localStorage.setItem("isUserLogin", "true");
                _this.events.publish("login");
                // this.userServices.alertBox(data['message']);
                _this.navCtrl.setRoot('DashboardPage');
            }
            else {
                _this.userServices.alertBox(data['message']);
            }
        })
            .catch(function (error) {
            loader.dismiss();
            _this.userServices.alertBox(JSON.stringify(error));
        });
    };
    HomePage.prototype.fbLogin = function () {
        var _this = this;
        this.facebook.login(['public_profile', 'email']).then(function (res) {
            if (res.status === "connected") {
                console.log('res 2 ' + localStorage.setItem("fbdata", JSON.stringify(res)));
                var params = new Array();
                _this.facebook.api("/me?fields=name,gender,email", params).then(function (user) {
                    console.log(user);
                    localStorage.setItem("user", JSON.stringify(user));
                    _this.getUserDetail(user);
                });
                // this.getUserDetail(res.authResponse, res.status);
            }
            else {
                //   this.isLoggedIn = false;
            }
        })
            .catch(function (e) {
            console.log('Error logging into Facebook', e);
            _this.fbLogout();
        });
    };
    // {name: "Praveen Patel", email: "praveenptl71@yahoo.com.au", id: "1673149249438619"}
    HomePage.prototype.getUserDetail = function (data) {
        var _this = this;
        var loader = this.loadingCtrl.create();
        loader.present();
        // if(status == 'connected'){
        // let dataToSend = {
        //   userID: data.userID
        // }
        this.userServices.validateFbLogin(data).then(function (data) {
            loader.dismiss();
            if (data['success']) {
                localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
                localStorage.setItem("isUserLogin", "true");
                _this.events.publish("login");
                _this.navCtrl.setRoot('DashboardPage');
            }
            else {
                _this.fbLogout();
                _this.userServices.alertBox(data['message']);
            }
        })
            .catch(function (error) {
            loader.dismiss();
            _this.userServices.alertBox(JSON.stringify(error));
        });
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
    };
    HomePage.prototype.fbLogout = function () {
        this.facebook.logout().then(function (data) { }).catch(function (error) { });
    };
    HomePage.prototype.signup = function () {
        this.navCtrl.push('SignupPage');
    };
    HomePage.prototype.showHide = function () {
        console.log(this.passwordType);
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    };
    HomePage.prototype.registerFbLogin = function () {
    };
    HomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NavController, UserservicesProvider, LoadingController,
            MenuController, Events, Facebook])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
/*

{"status":"connected","authResponse":{"accessToken":"EAADXpgUd7CcBAMdlaZBmxcGT2lkfSwiR8vUmtuuGdjpbY2Eip4Ihzgx4RZBJZCZCWy9beEjOagcdqTZCT9sZAwpdVRyntcau3F2sxJX1kltZC8sncnydFmTltapozzNxTPazceqLKCx5lxn3KbuAmZBZApgUhd9c60L56t0oyeySBzNHd6iWKmxeP4YO2w0CIbY96DZCLNiOOwkZAeMsEArOSz9oqonFJ7YyV8ZD","expiresIn":"5183997","session_key":true,"sig":"...","userID":"1673149249438619"}}

*/
//# sourceMappingURL=home.js.map