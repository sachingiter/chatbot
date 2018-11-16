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
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, LoadingController, Events } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { UserservicesProvider } from "../../providers/userservices/userservices";
var PersonalinfoPage = /** @class */ (function () {
    function PersonalinfoPage(navCtrl, navParams, actionSheetCtrl, androidPermissions, camera, platform, file, filePath, loadingCtrl, userServices, fileTransfer, events) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.actionSheetCtrl = actionSheetCtrl;
        this.androidPermissions = androidPermissions;
        this.camera = camera;
        this.platform = platform;
        this.file = file;
        this.filePath = filePath;
        this.loadingCtrl = loadingCtrl;
        this.userServices = userServices;
        this.fileTransfer = fileTransfer;
        this.events = events;
        if (navParams.data.mobile) {
            this.mobile = navParams.data.mobile;
        }
        if (this.navParams.data.redirect_from == 'menu') {
            this.email = this.userServices.getUserEmail();
            this.name = this.userServices.getUserName();
            this.serverImageUrl = this.userServices.getUserImage();
            console.log(this.userServices.getUserImage());
        }
    }
    PersonalinfoPage.prototype.ionViewDidLoad = function () {
        // console.log('ionViewDidLoad PersonalinfoPage');
    };
    PersonalinfoPage.prototype.done = function () {
        var _this = this;
        var dataToSend = {
            email: this.email,
            name: this.name,
            mobile: this.mobile || this.userServices.getUserMobile()
        };
        if (this.imageUrl) {
            console.log("Api call with image " + this.imageUrl);
            var loader_1 = this.loadingCtrl.create();
            loader_1.present();
            var options = {
                fileKey: "user_img",
                fileName: this.imageName,
                chunkedMode: false,
                httpMethod: "POST",
                mimeType: "multipart/form-data",
                params: dataToSend
            };
            var fileTransfer = this.fileTransfer.create();
            fileTransfer.upload(this.imageUrl, 'http://ec2-54-205-150-112.compute-1.amazonaws.com/chatbot/index.php/api/updateProfileReg', options).then(function (data) {
                var responses = JSON.parse(data.response);
                loader_1.dismiss();
                if (responses.success) {
                    localStorage.setItem("isMemoryUpload", "true");
                    _this.userServices.toast(responses.message);
                    if (_this.mobile) {
                        if (responses.userDetails) {
                            localStorage.setItem("userDetails", JSON.stringify(responses.userDetails));
                            localStorage.setItem("isUserLogin", "true");
                            _this.events.publish("login");
                            // this.userServices.alertBox(data['message']);
                            _this.navCtrl.setRoot('DashboardPage');
                        }
                        else {
                            _this.navCtrl.setRoot('HomePage');
                        }
                    }
                    if (_this.navParams.data.redirect_from == 'menu') {
                        _this.events.publish("login");
                    }
                }
                else {
                    _this.userServices.toast(responses.message);
                }
            }, function (err) {
                console.log(JSON.stringify(err));
                _this.userServices.toast(JSON.stringify(err));
                loader_1.dismiss();
            });
        }
        else {
            console.log("Api call without image");
            var loader_2 = this.loadingCtrl.create();
            loader_2.present();
            this.userServices.updateProfileReg(dataToSend).then(function (data) {
                loader_2.dismiss();
                if (data['success']) {
                    _this.userServices.toast(data['message']);
                    if (_this.mobile) {
                        if (data['userDetails']) {
                            localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
                            localStorage.setItem("isUserLogin", "true");
                            _this.events.publish("login");
                            _this.navCtrl.setRoot('DashboardPage');
                        }
                        else {
                            _this.navCtrl.setRoot('HomePage');
                        }
                    }
                    if (_this.navParams.data.redirect_from == 'menu') {
                        _this.events.publish("login");
                    }
                }
                else {
                    _this.userServices.toast(data['message']);
                }
            })
                .catch(function (error) {
                loader_2.dismiss();
                _this.userServices.toast(JSON.stringify(error));
            });
        }
    };
    PersonalinfoPage.prototype.choosePicker = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Select memories',
            buttons: [
                {
                    text: 'Load from Library',
                    icon: 'image',
                    handler: function () {
                        if (_this.platform.is('android'))
                            _this.checkPermission(_this.camera.PictureSourceType.PHOTOLIBRARY);
                        else
                            _this.takePicture(_this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    icon: 'camera',
                    handler: function () {
                        if (_this.platform.is('android'))
                            _this.checkPermission(_this.camera.PictureSourceType.CAMERA);
                        else
                            _this.takePicture(_this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    };
    PersonalinfoPage.prototype.checkPermission = function (type) {
        var _this = this;
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(function (result) {
            _this.checkStoragePermission(type);
        }, function (err) {
            _this.allowCameraPermission(type);
        });
    };
    PersonalinfoPage.prototype.checkStoragePermission = function (type) {
        var _this = this;
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(function (result) {
            _this.takePicture(type);
            console.log('Has permission?', result.hasPermission);
        }, function (err) {
            _this.allowStoragePermission(type);
        });
    };
    PersonalinfoPage.prototype.allowCameraPermission = function (type) {
        var _this = this;
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(function (data) {
            _this.checkStoragePermission(type);
        })
            .catch(function (error) {
        });
    };
    PersonalinfoPage.prototype.allowStoragePermission = function (type) {
        var _this = this;
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(function (data) {
            _this.takePicture(type);
        })
            .catch(function (error) {
        });
    };
    PersonalinfoPage.prototype.takePicture = function (sourceType) {
        var _this = this;
        // Create options for the Camera Dialog
        var options = {
            quality: 70,
            sourceType: sourceType,
            allowEdit: true,
            destinationType: this.camera.DestinationType.NATIVE_URI,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
        // Get the data of an image
        this.camera.getPicture(options).then(function (imagePath) {
            _this.imageUrl = imagePath;
            //Special handling for Android library
            if (_this.platform.is('android') && sourceType === _this.camera.PictureSourceType.PHOTOLIBRARY) {
                _this.filePath.resolveNativePath(imagePath).then(function (filePath) {
                    var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    var currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
                });
            }
            else {
                var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                _this.copyFileToLocalDir(correctPath, currentName, _this.createFileName());
            }
        }, function (err) {
            // this.presentToast('Error while selecting image.');
        });
    };
    PersonalinfoPage.prototype.createFileName = function () {
        var d = new Date(), n = d.getTime(), newFileName = n + ".jpg";
        this.imageName = newFileName;
        return newFileName;
    };
    PersonalinfoPage.prototype.copyFileToLocalDir = function (namePath, currentName, newFileName) {
        var _this = this;
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
            _this.imageUrl = _this.pathForImage(newFileName);
            _this.serverImageUrl = _this.imageUrl;
        }, function (error) {
            // this.presentToast('Error while storing file.'+error);
        });
    };
    PersonalinfoPage.prototype.pathForImage = function (img) {
        if (img === null) {
            return '';
        }
        else {
            return cordova.file.dataDirectory + img;
        }
    };
    PersonalinfoPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-personalinfo',
            templateUrl: 'personalinfo.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ActionSheetController,
            AndroidPermissions, Camera, Platform, File,
            FilePath, LoadingController, UserservicesProvider, FileTransfer,
            Events])
    ], PersonalinfoPage);
    return PersonalinfoPage;
}());
export { PersonalinfoPage };
//# sourceMappingURL=personalinfo.js.map