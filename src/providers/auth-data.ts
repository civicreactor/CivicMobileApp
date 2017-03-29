import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

import firebase from 'firebase';


@Injectable()
export class AuthData {
  // Here we declare the variables we'll be using.
  // public fireAuth: any;
  // private userProfile: any;
  fireAuth: any;
  private authState: FirebaseAuthState;

  constructor(public af: AngularFire) {
    af.auth.subscribe(user => {
      if (user) {
        this.fireAuth = user.auth;
        console.log(user);
      }
    })
  }

  loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.af.auth.login({email: newEmail , password: newPassword});
  }

  signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
    return this.af.auth.createUser({email: newEmail, password: newPassword});
  }

  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<any> {
    return this.af.auth.logout();
  }

}