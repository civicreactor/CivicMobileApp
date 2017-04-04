import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { ResetPasswordPage } from '../reset-password/reset-password';
import { SupportPage } from '../support/support';
import { UserData } from '../../providers/user-data';
import { AuthData } from '../../providers/auth-data';
import { ProfileData } from '../../providers/profile-data'
import { TabsPage } from '../tabs/tabs';

import { AngularFire } from 'angularfire2';
import firebase from 'firebase';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  public userProfile: any;
  public birthDate: string;

  constructor(public alertCtrl: AlertController, public nav: NavController, public authData: AuthData, 
              public userData: UserData, public profileData: ProfileData, public af: AngularFire) {}

  ionViewDidEnter() {
    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.birthDate = this.userProfile.birthDate;

    });
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

  goToResetPassword() {
    this.nav.push(ResetPasswordPage);
  }


  logoutUser() {
    this.af.auth.logout();
    this.nav.push(TabsPage);
  }

  support() {
    this.nav.push(SupportPage);
  }

  updateName() {
    let alert = this.alertCtrl.create({
      message: "Your first name and last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate) {
    this.profileData.updateDOB(birthDate);
  }

  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateEmail(data.newEmail, data.password);
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePasword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }

}
