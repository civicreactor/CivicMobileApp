import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../app/validators/email';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  public signupForm;
  loading: any;

  constructor(public nav: NavController, public authData: AuthData, public formBuilder: FormBuilder, 
  public loadingCtrl: LoadingController, public alertCtrl: AlertController) 
  {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  signupUser() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then( () => {
        this.loading.dismiss().then( () => {
          this.nav.setRoot(TabsPage);
        });
      }, (error) => {
        this.loading.dismiss().then( () => {
          this.alertCtrl.create({
            message: error.message,
            buttons: [{
              text: 'Ok',
              role: 'cancel'
            }]
          });
        });
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}

