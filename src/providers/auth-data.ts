import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

import firebase from 'firebase';


@Injectable()
export class AuthData {

  constructor(public af: AngularFire) {}

  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
    
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        email: email
      });
    });
  }


  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<any> {
    return this.af.auth.logout();
  }

}