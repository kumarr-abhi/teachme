import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentInformationPage } from '../student-information/student-information';
import { UserInformation } from '../../models/user/user-information';
import { SearchTeacherPage } from '../search-teacher/search-teacher';
import { LoginService } from '../../providers/login.service';
import { UserService } from '../../providers/user.service';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    private phoneCallingCode: string;
    private validPhoneCallingCode = false;
    private phoneNumber: string;
    private validPhoneNumber = false;
    private verificationCode: string;
    private validVerificationCodeDigit = false;
    private hasSentVerificationCode = false;
    private errorMessage;
    private phoneData: { [k: string]: any } = {};
    private userInformation: UserInformation;
    constructor(public navCtrl: NavController, public loginService: LoginService, public userService: UserService) {
        this.verificationCode = '';
        this.phoneNumber = '';
    }

    checkPhoneCallingCode() {
        this.validPhoneCallingCode = (this.phoneCallingCode.length > 0) ? true : false;
    }

    checkPhoneNumber() {
        this.validPhoneNumber = (this.phoneNumber.length == 10) ? true : false;
    }

    checkVerificationDigit() {
        this.validVerificationCodeDigit = (this.verificationCode.length == 5) ? true : false;
    }

    verifyPhoneNumber() {
        this.errorMessage = "";
        this.phoneData.phone_calling_code = (this.phoneCallingCode[0] == "+") ? (this.phoneCallingCode.slice(1, this.phoneCallingCode.length)) : this.phoneCallingCode;
        this.phoneData.phone_number = this.phoneNumber;
        this.loginService.verifyPhoneNumber(this.phoneData)
            .subscribe(response => {
                this.hasSentVerificationCode = true;
                this.validVerificationCodeDigit = false;
            }, error => {
                this.errorMessage = "Invalid contry code or phone number";
            });
    }

    verifyVerificationCode() {
        this.errorMessage = "";
        this.phoneData.verification_code = this.verificationCode;
        this.loginService.verifyVerificationCode(this.phoneData)
            .subscribe((response) => {
                this.userInformation = { ...response };
                localStorage.setItem('currentUser', JSON.stringify(this.userInformation));
                if (this.userInformation['user']['children'].length == 0)
                    this.navCtrl.setRoot(StudentInformationPage);
                else
                    this.navCtrl.setRoot(SearchTeacherPage);
            }, error => {
                this.errorMessage = "Invalid input";
            });
    }

    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}