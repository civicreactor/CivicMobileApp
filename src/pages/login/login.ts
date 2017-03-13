import { 
  NavController, 
  LoadingController, 
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { EmailValidator } from '../../app/validators/email';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm;
  loading: any;

  constructor(public nav: NavController, public authData: AuthData, public formBuilder: FormBuilder,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    /**
     * Creates a ControlGroup that declares the fields available, their values and the validators that they are going
     * to be using.
     *
     * I set the password's min length to 6 characters because that's Firebase's default, feel free to change that.
     */
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  /**
   * If the form is valid it will call the AuthData service to log the user in displaying a loading component while
   * the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  loginUser(): void {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.loading.dismiss().then( () => {
          this.nav.setRoot(TabsPage);
        });
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }

  goToSignup(): void {
    this.nav.push(SignupPage);
  }

  goToResetPassword(): void {
    this.nav.push(ResetPasswordPage);
  }

}


// import { Component } from '@angular/core';

// import { NavController } from 'ionic-angular';

// import { SignupPage } from '../signup/signup';
// import { TabsPage } from '../tabs/tabs';
// import { UserData } from '../../providers/user-data';


// @Component({
//   selector: 'page-user',
//   templateUrl: 'login.html'
// })
// export class LoginPage {
//   login: {username?: string, password?: string} = {};
//   submitted = false;

//   constructor(public navCtrl: NavController, public userData: UserData) { }

//   onLogin(form) {
//     this.submitted = true;

//     if (form.valid) {
//       this.userData.login(this.login.username);
//       this.navCtrl.push(TabsPage);
//     }
//   }

//   onSignup() {
//     this.navCtrl.push(SignupPage);
//   }
// }
