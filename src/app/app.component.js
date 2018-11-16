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
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserservicesProvider } from '../providers/userservices/userservices';
// import { HomePage } from '../pages/home/home';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, menuCtrl, events, userServices) {
        var _this = this;
        this.menuCtrl = menuCtrl;
        this.events = events;
        this.userServices = userServices;
        this.rootPage = 'HomePage';
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            _this.menuCtrl.swipeEnable(false);
            _this.events.subscribe("login", function (data) {
                _this.loginEvent();
            });
        });
    }
    MyApp.prototype.loginEvent = function () {
        var _this = this;
        setTimeout(function () {
            _this.menuCtrl.swipeEnable(true);
        }, 500);
        this.user_name = this.userServices.getUserName();
        this.user_mobile = this.userServices.getUserMobile();
        if (this.userServices.getUserImage()) {
            this.user_image = this.userServices.getUserImage();
            console.log(this.user_image);
        }
        else {
            this.user_image = 'assets/imgs/mobile.png';
        }
    };
    MyApp.prototype.logout = function () {
        console.log('logout');
        localStorage.removeItem("userDetails");
        localStorage.removeItem("isUserLogin");
        this.menuCtrl.swipeEnable(false);
        this.nav.setRoot('HomePage');
    };
    MyApp.prototype.profile = function () {
        this.nav.push('PersonalinfoPage', { redirect_from: 'menu' });
    };
    MyApp.prototype.billing = function () {
        this.nav.push('BillinginfoPage');
    };
    MyApp.prototype.boking = function () {
    };
    MyApp.prototype.history = function () {
    };
    MyApp.prototype.about = function () {
    };
    MyApp.prototype.faq = function () {
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, StatusBar, SplashScreen, MenuController,
            Events, UserservicesProvider])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map