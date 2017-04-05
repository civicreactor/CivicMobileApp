import { Component } from '@angular/core';

import { AlertController, ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ProjectData } from '../../providers/project-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { ProjectDetailPage } from '../project-detail/project-detail';
import { UserData } from '../../providers/user-data';
import { FavoriteData } from '../../providers/favorite-data';
import { AuthData } from '../../providers/auth-data';

import {AngularFire, FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';

@Component({
  selector: 'page-project-list',
  templateUrl: 'project-list.html'
})
export class ProjectListPage {
  actionSheet: ActionSheet;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks = [];
  shownProjects: any;
  projects: FirebaseListObservable<any>;
  public currentUser: string;
  public favoritesList: firebase.database.Reference;
  public hide: boolean;
  public favs: any;

  constructor(
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public projectData: ProjectData,
    public config: Config,
    public user: UserData,
    public inAppBrowser: InAppBrowser,
    public favoriteData: FavoriteData,
    public authData: AuthData,
    public af: AngularFire
    ) {
      this.projects = af.database.list('/projects'); 
    }

  updateProject(segment) {
    console.log(segment)
    if (segment === 'all') {
      console.log(segment)
      this.projects = this.af.database.list('/projects');
    }
    if (segment === 'favorites') {
      console.log(segment)
      this.projects = this.af.database.list('projects', {
      query: {
        orderByChild: 'isFavorite',
        equalTo: true
      }
    });
    }
  }

  createFavorite(projectData) {
    this.favoriteData.createFavorite(projectData.name);
    this.projects.update(projectData.$key, {isFavorite: true});
    let alert = this.alertCtrl.create({
      title: 'Favorite Added',
      buttons: [{
        text: 'OK'
      }]
    });
    alert.present();
  }

  goToSessionDetail(session) {
    this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speakerName: any) {
    this.navCtrl.push(ProjectDetailPage, speakerName);
  }

  goToSpeakerTwitter(speaker) {
    this.inAppBrowser.create(`https://twitter.com/${speaker.twitter}`, '_blank');
  }

  openSpeakerShare(speaker) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: ($event) => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openContact(speaker) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }

}

