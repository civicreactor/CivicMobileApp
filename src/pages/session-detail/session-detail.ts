import { Component } from '@angular/core';

import { NavParams, ViewController, NavController } from 'ionic-angular';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;

  constructor(public navParams: NavParams,
              public navCtrl: NavController
  ) {
    this.session = navParams.data;
  }


  goToSessionDetail(sessionData) {
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(SessionDetailPage, sessionData);
  }

  goToSpeakerDetail(speakerName: any) {
    this.navCtrl.push(SpeakerDetailPage, speakerName);
  }

}
