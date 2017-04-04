import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class FavoriteData {
  public currentUser: string;
  public favorites: firebase.database.Reference;
  zone: NgZone;

  constructor(public af: AngularFire) {
    this.zone = new NgZone({});
    af.auth.subscribe( (user) => {
      this.zone.run( () => {
        if (user) {
          this.currentUser = user.uid;
          console.log('this user is signed in: '+user.uid)
          this.favorites = firebase.database().ref(`userProfile/${this.currentUser}/favorites`);
        } else { 
          console.log('this user is NOT signed in...')
        }
      });     
    });
  }

  createFavorite(projectName): firebase.Promise<any> {
      return this.favorites.push(projectName);
  }

  getFavoriteList(): firebase.database.Reference {
    return this.favorites;
  }

  

}