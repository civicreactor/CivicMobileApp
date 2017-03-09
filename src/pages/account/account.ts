import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import { AuthData } from '../../providers/auth-data';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  user: firebase.User;

  constructor(public alertCtrl: AlertController, public nav: NavController, public authData: AuthData, 
              public userData: UserData) {
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.user.displayName,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        // this.userData.setUsername(data.username);
        // this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.user = this.userData.getUsername();
    console.log('user: ' + this.user)
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logoutUser() {
    console.log('first call to logout...')
    this.authData.logoutUser();
    this.nav.setRoot(LoginPage);
  }

  support() {
    this.nav.push(SupportPage);
  }
}
