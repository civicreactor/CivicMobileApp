import { Component, NgZone, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Storage } from '@ionic/storage';
import { Storage } from '@ionic/storage'
// import { API_FIREBASE_KEY } from './mock-api';

import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
// import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';

import { SchedulePage } from '../pages/schedule/schedule';
import { ReactorListPage } from '../pages/reactor-list/reactor-list';
import { ProjectListPage } from '../pages/project-list/project-list';
import { MapPage } from '../pages/map/map'
import { AboutPage } from '../pages/about/about';

import { ProjectData } from '../providers/project-data';
import { UserData } from '../providers/user-data';
import { AuthData } from '../providers/auth-data';

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import firebase from 'firebase';

export interface PageInterface {
  title: string;
  component: any;
  tabComponent?: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html',
  providers: [AuthData]
})
export class ConferenceApp {
  
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    // { title: 'Events', component: TabsPage, tabComponent: SchedulePage, icon: 'calendar' },
    { title: 'Projects', component: TabsPage, tabComponent: ProjectListPage, icon: 'filing' },
    { title: 'Reactors', component: TabsPage, tabComponent: ReactorListPage, index: 1, icon: 'contacts' },
    { title: 'Map', component: TabsPage, tabComponent: MapPage, index: 2, icon: 'map' },
    { title: 'About', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle' }
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
  // projects: FirebaseObjectObservable<any>;

  constructor(
    public events: Events,
    public userData: UserData,
    public authData: AuthData,
    public menu: MenuController,
    public platform: Platform,
    public projectData: ProjectData,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public af: AngularFire
  ) {
    this.rootPage = TabsPage;
    this.zone = new NgZone({});

    af.auth.subscribe( (user) => {
      this.zone.run( () => {
        if (user) {
          this.enableMenu(true);
        } else { 
          this.enableMenu(false);
        }
      });     
    });

    // confData.load();
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
      this.splashScreen.hide();
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
