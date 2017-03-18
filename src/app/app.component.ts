import { Component, NgZone, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { API_FIREBASE_KEY } from './mock-api';

import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';

import { SchedulePage } from '../pages/schedule/schedule';
import { ReactorListPage } from '../pages/reactor-list/reactor-list';
import { ProjectListPage } from '../pages/project-list/project-list';
import { MapPage } from '../pages/map/map'
import { AboutPage } from '../pages/about/about';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { AuthData } from '../providers/auth-data';

// import firebase from 'firebase';
import * as firebase from 'firebase';

export interface PageInterface {
  title: string;
  component: any;
  tabComponent?: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Events', component: TabsPage, tabComponent: SchedulePage, icon: 'calendar' },
    { title: 'Reactors', component: TabsPage, tabComponent: ReactorListPage, index: 1, icon: 'contacts' },
    { title: 'Projects', component: TabsPage, tabComponent: ProjectListPage, index: 2, icon: 'filing' },
    { title: 'Map', component: TabsPage, tabComponent: MapPage, index: 3, icon: 'map' },
    { title: 'About', component: TabsPage, tabComponent: AboutPage, index: 4, icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', component: AccountPage, icon: 'person' },
    { title: 'Support', component: SupportPage, icon: 'help' },
    { title: 'Logout', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
    { title: 'Support', component: SupportPage, icon: 'help' },
    { title: 'Signup', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;
  zone: NgZone;
  public fireAuth: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public authData: AuthData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public storage: Storage
  ) {
    this.rootPage = TabsPage;
    this.zone = new NgZone({});
    console.log(API_FIREBASE_KEY.API_FIREBASE_KEY)
      firebase.initializeApp({
      apiKey: API_FIREBASE_KEY.API_FIREBASE_KEY,
      authDomain: "civic-mobile-app-46e73.firebaseapp.com",
      databaseURL: "https://civic-mobile-app-46e73.firebaseio.com",
      storageBucket: "civic-mobile-app-46e73.appspot.com",
      messagingSenderId: "839668242779"
    });
    
    firebase.auth().onAuthStateChanged( (user) => {
      this.zone.run( () => {
        if (user) {
          this.enableMenu(true);
        } else { 
          this.enableMenu(false);
        }
      });     
    });

    confData.load();
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.authData.logoutUser();
      }, 1000);
    }
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      Splashscreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
}
