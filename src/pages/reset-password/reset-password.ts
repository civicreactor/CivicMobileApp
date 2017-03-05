import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../app/validators/email'

@Component({
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html'
})

export class ResetPasswordPage {
    public resetPasswordForm;
    
    constructor (public authData: AuthData, public formBuilder: FormBuilder, public nav: NavController, 
                 public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
      this.resetPasswordForm = formBuilder.group({
          email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      })
    }

    resetPassword() {
        if (!this.resetPasswordForm.valid) {
            console.log(this.resetPasswordForm.value);
        } else {
            this.authData.resetPassword(this.resetPasswordForm.value.email).
            then( (user) => {
                let alert = this.alertCtrl.create({
                    message: "We just sent you a reset link to your email",
                    buttons: [{
                        text: 'Ok',
                        role: 'cancel',
                        handler: () => {
                            this.nav.pop();
                        }
                    }]
                });
                alert.present();
            }, (error) => {
                var errorMessage: string = error.message;
                let errorAlert = this.alertCtrl.create({
                    message: errorMessage,
                    buttons: [{
                        text: 'Ok',
                        role: 'cancel'
                    }]
                });
                errorAlert.present();
            });
        }
    }
}
