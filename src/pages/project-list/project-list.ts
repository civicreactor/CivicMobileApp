import { Component } from '@angular/core';

import { AlertController, ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { ProjectDetailPage } from '../project-detail/project-detail';
import { UserData } from '../../providers/user-data';

import {AngularFire, FirebaseListObservable} from 'angularfire2';

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

  constructor(
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public user: UserData,
    public inAppBrowser: InAppBrowser,
    af: AngularFire
    ) {
     this.projects = af.database.list('/projects'); 
    }

  ionViewDidLoad() {
    // this.updateProject();
    // this.projects;
    // this.confData.getProjects();

  }

  updateProject() {
    // this.confData.getProjectLine(this.queryText, this.segment).subscribe(projects => {
    //   // console.log(projects);
    //   this.shownProjects = projects.shownProjects;
    //   this.projects = projects;
    // });
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

  addFavorite(card, projectData) {
    if (this.user.hasFavorite(projectData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(card, projectData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(projectData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK'
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(card, projectData, title) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(projectData.name);
            this.updateProject();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }
}

