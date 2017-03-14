import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  getUsername() {
    var user = firebase.auth().currentUser;
    console.log(user)
    return user;
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };
}
