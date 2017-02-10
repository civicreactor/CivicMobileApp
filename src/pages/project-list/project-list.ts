import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { ConferenceData } from '../../providers/conference-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { ProjectDetailPage } from '../project-detail/project-detail';


@Component({
  selector: 'page-project-list',
  templateUrl: 'project-list.html'
})
export class ProjectListPage {
  actionSheet: ActionSheet;
  speakers = [];

  constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public confData: ConferenceData, public config: Config) {}

  ionViewDidLoad() {
    this.confData.getProjects().subscribe(speakers => {
      this.speakers = speakers;
    });
  }

  goToSessionDetail(session) {
    this.navCtrl.push(ProjectDetailPage, session);
  }

  goToSpeakerDetail(speakerName: any) {
    this.navCtrl.push(ProjectDetailPage, speakerName);
  }

  goToSpeakerTwitter(speaker) {
    new InAppBrowser(`https://twitter.com/${speaker.twitter}`, '_blank');
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
