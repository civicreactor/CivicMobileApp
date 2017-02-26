import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SessionDetailPage } from '../session-detail/session-detail';


@Component({
  selector: 'page-project-detail',
  templateUrl: 'project-detail.html'
})
export class ProjectDetailPage {
  project: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.project = this.navParams.data;
  }

  goToSessionDetail(session) {
    this.navCtrl.push(SessionDetailPage, session);
  }
}
