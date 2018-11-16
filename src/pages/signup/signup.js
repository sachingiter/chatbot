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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SignupPage = /** @class */ (function () {
    function SignupPage(navCtrl, navParams, userServices, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userServices = userServices;
        this.loadingCtrl = loadingCtrl;
    }
    SignupPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad SignupPage');
    };
    SignupPage.prototype.checkPassword = function () {
        if (this.confirmpassword) {
            if (this.password != this.confirmpassword) {
                this.passmatch = true;
            }
            else {
                this.passmatch = false;
            }
        }
    };
    SignupPage.prototype.verify = function () {
        this.navCtrl.push('VerificationPage');
    };
    SignupPage.prototype.signup = function () {
        var _this = this;
        var loader = this.loadingCtrl.create();
        loader.present();
        var dataToSend = {
            mobile: this.mobile,
            password: this.password
        };
        this.userServices.register(dataToSend).then(function (data) {
            loader.dismiss();
            if (data['success']) {
                _this.userServices.toast(data['message']);
                // this.navCtrl.setRoot('HomePage');
                _this.navCtrl.push('PersonalinfoPage', { mobile: _this.mobile });
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
    SignupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-signup',
            templateUrl: 'signup.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, UserservicesProvider,
            LoadingController])
    ], SignupPage);
    return SignupPage;
}());
export { SignupPage };
//# sourceMappingURL=signup.js.map