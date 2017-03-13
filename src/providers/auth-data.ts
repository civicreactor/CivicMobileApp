import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

// import firebase from 'firebase';
import * as firebase from 'firebase';

@Injectable()
export class AuthData {
  // Here we declare the variables we'll be using.
  // public fireAuth: any;
  // public userProfile: any;

  constructor() {
    // this.userProfile = firebase.database().ref('/userProfile');
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    console.log('loggin in.....')
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((newUser) => {
        firebase.database().ref('/userProfile').child(newUser.uid).set({email: email});
        });
  }

  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

}