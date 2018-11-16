import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Facebook } from '@ionic-native/facebook';

import { MyApp } from './app.component';
// import { HomePage } from '../pages/home/home';
import { UserservicesProvider } from '../providers/userservices/userservices';
import { HttpClientModule } from '@angular/common/http';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
  declarations: [
    MyApp,
    // HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode : 'ios',
      backButtonIcon : 'md-arrow-back',
      backButtonText: '',
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserservicesProvider,AndroidPermissions,Camera,File,FilePath,FileTransfer,
    Facebook,
    CallNumber,
    Geolocation
  ]
})
export class AppModule {}
