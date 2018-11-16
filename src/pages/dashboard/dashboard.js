var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { UserservicesProvider } from '../../providers/userservices/userservices';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DashboardPage = /** @class */ (function () {
    function DashboardPage(navCtrl, navParams, userServices) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userServices = userServices;
        this.messages = [];
    }
    DashboardPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad DashboardPage');
    };
    DashboardPage.prototype.chat = function () {
        var _this = this;
        var msg = {
            sms: this.compose,
            from: 'user'
        };
        this.messages.push(msg);
        setTimeout(function () {
            _this.content.scrollToBottom();
        }, 300);
        // let fromsms = {
        //   sms:'hiii.....'+this.compose,
        //   from:'bot'
        // }
        // this.messages.push(fromsms);
        var dataToSend = this.compose;
        this.compose = null;
        this.userServices.chat(dataToSend).then(function (data) {
            console.log(data);
            var fromsms = {
                sms: data['message'],
                from: 'bot',
                restaurants: data['restaurants']
            };
            _this.messages.push(fromsms);
            setTimeout(function () {
                _this.content.scrollToBottom();
            }, 300);
            _this.compose = null;
        })
            .catch(function (error) {
        });
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], DashboardPage.prototype, "content", void 0);
    DashboardPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-dashboard',
            templateUrl: 'dashboard.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, UserservicesProvider])
    ], DashboardPage);
    return DashboardPage;
}());
export { DashboardPage };
//# sourceMappingURL=dashboard.js.map