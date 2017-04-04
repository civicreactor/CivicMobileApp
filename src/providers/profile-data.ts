import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ProfileData {
    public userProfile: firebase.database.Reference;
    public currentUser: firebase.User;

    constructor() {
        this.userProfile = firebase.database().ref('/userProfile');
        this.currentUser = firebase.auth().currentUser;   
        console.log(this.currentUser) 
    }

    getUserProfile(): firebase.database.Reference {
        return this.userProfile.child(this.currentUser.uid);
    }

    updateName(firstName: string, lastName: string): firebase.Promise<any> {
        return this.userProfile.child(this.currentUser.uid).update({
            firstName: firstName,
            lastName: lastName,
        });
    }

    updateDOB(birthDate: string): firebase.Promise<any> {
        return this.userProfile.child(this.currentUser.uid).update({
            birthDate: birthDate,
        });
    }

    updateEmail(newEmail: string, password: string): firebase.Promise<any> {
        const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, password);

        return this.currentUser.reauthenticate(credential).then(user => {
            this.currentUser.updateEmail(newEmail).then(user => {
                this.userProfile.child(this.currentUser.uid).update({
                    email: newEmail
                });
            });
        });
    }

    updatePasword(newPassword: string, oldPassword: string): firebase.Promise<any> {
        const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, oldPassword);

        return this.currentUser.reauthenticate(credential).then(user => {
            this.currentUser.updatePassword(newPassword).then(user => {
                    console.log('Password Changed');
                }, error => {
                    console.log(error);  
                }
            );
        });
    }

    // updateFavorites(projectName: string): firebase.Promise<any> {
    //     return firebase.database().ref('/userProfile').child(this.currentUser.uid).update({
    //             favorites: [projectName]
    //         });
    // }

    
    // signupUser(email: string, password: string): firebase.Promise<any> {
    //     return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
    //     firebase.database().ref('/userProfile').child(newUser.uid).set({
    //         email: email
    //     });
    //     });
    // }


}