import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
// import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser';

import { ConferenceApp } from './app.component';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { API_FIREBASE_KEY } from './mock-api';
import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { ReactorListPage } from '../pages/reactor-list/reactor-list';
import { ProjectDetailPage } from '../pages/project-detail/project-detail';
import { ProjectListPage } from '../pages/project-list/project-list';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';

import { AuthData } from '../providers/auth-data';
import { ProjectData } from '../providers/project-data';
import { UserData } from '../providers/user-data';
import { ProfileData } from '../providers/profile-data';
import { FavoriteData } from '../providers/favorite-data';

export const firebaseConfig = {
      apiKey: API_FIREBASE_KEY.API_FIREBASE_KEY,
      authDomain: "civic-mobile-app-46e73.firebaseapp.com",
      databaseURL: "https://civic-mobile-app-46e73.firebaseio.com",
      storageBucket: "civic-mobile-app-46e73.appspot.com",
      messagingSenderId: "839668242779"
    };

export const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    ResetPasswordPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    ReactorListPage,
    ProjectDetailPage,
    ProjectListPage,
    TabsPage,
    TutorialPage,
    SupportPage
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp),
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    ResetPasswordPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    ReactorListPage,
    ProjectDetailPage,
    ProjectListPage,
    TabsPage,
    TutorialPage,
    SupportPage
  ],
  providers: [AuthData, ProjectData, {provide: ErrorHandler, useClass: IonicErrorHandler}, UserData, InAppBrowser,
              ProfileData, SplashScreen, FavoriteData]
})
export class AppModule { }
