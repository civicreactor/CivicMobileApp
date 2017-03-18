import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import { AuthData } from '../../providers/auth-data';
import { TabsPage } from '../tabs/tabs';

import * as firebase from 'firebase';

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
      title: 'Change your Name',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      placeholder: 'Change your name'
    });
    alert.addButton({
      text: 'Ok',
      handler: data => {
        firebase.auth().currentUser.updateProfile({
          displayName: data.username,
          photoURL: ''
        });
      }
    });
    alert.present();
  }

  getUsername() {
    this.user = this.userData.getUsername();
    console.log('user: ' + this.user)
  }

  goToResetPassword(): void {
    this.nav.push(ResetPasswordPage);
  }

  changePassword() {
    // var newPassword = getASecureRandomPassword();
    // firebase.auth().currentUser.updatePassword(newPassword);
  }

  logoutUser() {
    this.authData.logoutUser();
    this.nav.push(TabsPage);
  }

  support() {
    this.nav.push(SupportPage);
  }
}
