import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController,Platform,LoadingController, Events } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UserservicesProvider } from "../../providers/userservices/userservices";

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-personalinfo',
  templateUrl: 'personalinfo.html',
})
export class PersonalinfoPage {

  imageUrl:any;
  email:any;
  name:any;
  imageName:any;
  mobile:any;
  serverImageUrl:any;
  UserDatas:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl: ActionSheetController,
    private androidPermissions: AndroidPermissions, private camera: Camera, public platform: Platform, private file: File,
    private filePath: FilePath, public loadingCtrl:LoadingController, public userServices:UserservicesProvider,public fileTransfer:FileTransfer,
    public events:Events) {

      if(navParams.data.mobile){
        this.mobile = navParams.data.mobile;
      }
      if(localStorage.getItem("userDetails")){
          this.UserDatas = JSON.parse(localStorage.getItem("userDetails"))
          console.log(this.UserDatas)
      }
      if(this.navParams.data.redirect_from == 'menu'){
        this.email = this.UserDatas.user_email
        this.name = this.UserDatas.user_name
        this.mobile = this.UserDatas.user_mobile
        this.serverImageUrl = this.UserDatas.user_image
        
        // this.email = this.userServices.getUserEmail();
        // this.name = this.userServices.getUserName();
        // this.mobile = JSON.parse(localStorage.getItem("userDetails")).userDetails.user_mobile;
        // console.log(this.mobile)
        // this.serverImageUrl = this.userServices.getUserImage();
        // console.log(this.userServices.getUserImage());
      }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PersonalinfoPage');
  }

    // this.mobile = JSON.parse(localStorage.getItem("userDetails")).userDetails.user_mobile;
    // console.log(this.mobile)

  done(){
    let userDetails:any = localStorage.getItem('userDetails');
    if(userDetails){
      userDetails = JSON.parse(userDetails);
    }
    var dataToSend:any = {
      email : this.email,
      name : this.name,
      // mobile :this.mobile || this.userServices.getUserMobile()
      mobile : (this.mobile)?this.mobile:userDetails.user_mobile,
      id:(userDetails)?userDetails.user_id:0
    }

    if(this.imageUrl){
      console.log("Api call with image "+this.imageUrl)
      let loader = this.loadingCtrl.create();
      loader.present();
   
      var options: FileUploadOptions = {
        fileKey: "user_img",
        fileName: this.imageName,
        chunkedMode: false,
        httpMethod:"POST",
        mimeType: "multipart/form-data",
        params : dataToSend
      };
      const fileTransfer: FileTransferObject = this.fileTransfer.create();
      fileTransfer.upload(this.imageUrl, 'http://ec2-54-205-150-112.compute-1.amazonaws.com/chatbot/index.php/api/updateProfileReg', options).then(data => {
        let responses = JSON.parse(data.response);        
        loader.dismiss();
        if(responses.success){
          localStorage.setItem("isMemoryUpload","true");
          this.userServices.toast(responses.message);
          
          if(this.mobile){
            
            if(responses.userDetails){
              localStorage.setItem("userDetails", JSON.stringify(responses.userDetails));
              localStorage.setItem("isUserLogin","true");
              this.events.publish("login");
              // this.userServices.alertBox(data['message']);
              this.navCtrl.setRoot('DashboardPage');
            }
            else{
              this.navCtrl.setRoot('HomePage');
            }
          }
          if(this.navParams.data.redirect_from == 'menu'){
            this.events.publish("login");
          }
          
        }
        else{
          this.userServices.toast(responses.message);
        }                
      }, err => {
        console.log(JSON.stringify(err));
        this.userServices.toast(JSON.stringify(err));
        loader.dismiss();
      });
    }
    else{
      console.log("Api call without image")
      let loader = this.loadingCtrl.create();
      loader.present();
      this.userServices.updateProfileReg(dataToSend).then( data=> {
        loader.dismiss();
        if(data['success']){
          this.userServices.toast(data['message'])
          if(this.mobile){
            if(data['userDetails']){
              localStorage.setItem("userDetails", JSON.stringify(data['userDetails']));
              localStorage.setItem("isUserLogin","true");
              this.events.publish("login");
              this.navCtrl.setRoot('DashboardPage');
            }
            else{
              this.navCtrl.setRoot('HomePage');
            }
          }

          if(this.navParams.data.redirect_from == 'menu'){
            this.events.publish("login");
          }
        }
        else{
          this.userServices.toast(data['message'])
        }
      })
      .catch( error=> {
        loader.dismiss();
        this.userServices.toast(JSON.stringify(error));
      })
    }
  }

  choosePicker(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select memories',
      buttons: [
        {
          text: 'Load from Library',
          icon: 'image',
          handler: () => {
            if(this.platform.is('android'))
            this.checkPermission(this.camera.PictureSourceType.PHOTOLIBRARY);
            else
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          icon: 'camera',
          handler: () => {
            if(this.platform.is('android'))
            this.checkPermission(this.camera.PictureSourceType.CAMERA);
            else
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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
  }

  checkPermission(type){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        this.checkStoragePermission(type);
      },
      err => {
        this.allowCameraPermission(type);
      }
    );
  }

  checkStoragePermission(type){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        this.takePicture(type);
        console.log('Has permission?',result.hasPermission)
      },
      err => {
        this.allowStoragePermission(type);
      }
    );
  }

  allowCameraPermission(type){
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(data=>{
      this.checkStoragePermission(type);
    })
    .catch( error=> {

    })
  }

  allowStoragePermission(type){
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(data=>{
      this.takePicture(type);
    })
    .catch( error=> {

    })
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 70,
      sourceType: sourceType,
      allowEdit:true,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
        this.imageUrl = imagePath;

        //Special handling for Android library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath).then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
           
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }      
    },
    (err) => {
      // this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName = n+ ".jpg";
    this.imageName = newFileName;
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      
      this.imageUrl = this.pathForImage(newFileName);
      this.serverImageUrl = this.imageUrl;
    },
     (error) => {
      // this.presentToast('Error while storing file.'+error);
    });
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}
