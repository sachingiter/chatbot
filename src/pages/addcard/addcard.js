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
import { UserservicesProvider } from "../../providers/userservices/userservices";
/**
 * Generated class for the AddcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AddcardPage = /** @class */ (function () {
    function AddcardPage(navCtrl, navParams, userServices, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userServices = userServices;
        this.loadingCtrl = loadingCtrl;
    }
    AddcardPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad AddcardPage');
    };
    AddcardPage.prototype.addCard = function () {
        var _this = this;
        var dataToSend = {
            cardno: this.cardno,
            name: this.name,
            expiry: this.expiry,
            cvv: this.cvv,
        };
        var loader = this.loadingCtrl.create();
        loader.present();
        this.userServices.addCard(dataToSend).then(function (data) {
            loader.dismiss();
            if (data['success']) {
                _this.cardno = '';
                _this.name = '';
                _this.expiry = null;
                _this.cvv = '';
                _this.userServices.toast(data['message']);
            }
            else {
                _this.userServices.toast(data['message']);
            }
        })
            .catch(function (error) {
            loader.dismiss();
            _this.userServices.errorToast(JSON.stringify(error));
        });
    };
    AddcardPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-addcard',
            templateUrl: 'addcard.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, UserservicesProvider,
            LoadingController])
    ], AddcardPage);
    return AddcardPage;
}());
export { AddcardPage };
//# sourceMappingURL=addcard.js.map