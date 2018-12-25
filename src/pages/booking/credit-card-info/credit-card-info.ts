import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { UserService } from "../../../providers/user.service";
import { FormGroup, FormControl } from "@angular/forms";
import { TeacherService } from "../../../providers/teacher.service";

@Component({
    selector: 'page-credit-card-info',
    templateUrl: 'credit-card-info.html'
})

export class CreditCardInfoPage {

    nameErrorMessage = '';
    cardNumberErrorMessage = '';
    expiryDateErrorMessage = '';
    cvvErrorMessage = '';

    teacherId;
    childId;
    times = {};

    creditCardInfoForm: FormGroup;

    constructor(private navCtrl: NavController, private navParams: NavParams, private userService: UserService, private teacherService: TeacherService, private alertCtrl: AlertController) {
        this.initializeForm();
        this.teacherId = this.navParams.get('teacherId');
        this.times = this.navParams.get('times');
        this.childId = this.navParams.get('childId');
    }

    initializeForm() {
        this.creditCardInfoForm = new FormGroup({
            cardNumber: new FormControl(''),
            expiryDate: new FormControl(''),
            name: new FormControl(''),
            cvv: new FormControl('')
        });
    }


    pay() {
        this.nameErrorMessage = '';
        this.cardNumberErrorMessage = '';
        this.expiryDateErrorMessage = '';
        this.cvvErrorMessage = '';
        if (this.validateInputs()) {
            this.teacherService.sendBookingData(this.teacherId, this.childId, this.times, null, this.creditCardInfoForm.value)
            .subscribe(response => {
                console.log("response: " + JSON.stringify(response));
                this.navCtrl.setRoot('success-page');
            }, error => {
                console.log("Error: " + JSON.stringify(error));
                let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'Fail to pay with credit card information provided!',
                    buttons: ['Dismiss']
                });
                alert.present();
            });
        }
    }

    validateInputs() {
        let valid = true;
        if (this.creditCardInfoForm.value.cardNumber == '' || this.creditCardInfoForm.value.cardNumber == null) {
            this.cardNumberErrorMessage = 'Card number is mandatory';
            valid = false;
        }
        if (this.creditCardInfoForm.value.name == '' || this.creditCardInfoForm.value.name == null) {
            this.nameErrorMessage = 'Name is mandatory';
            valid = false;
        }
        if (this.creditCardInfoForm.value.expiryDate == '' || this.creditCardInfoForm.value.expiryDate == null) {
            this.expiryDateErrorMessage = 'Expiry date is mandatory';
            valid = false;
        }
        if (this.creditCardInfoForm.value.cvv == '' || this.creditCardInfoForm.value.cvv == null) {
            this.cvvErrorMessage = 'cvv is mandatory';
            valid = false;
        }
        return valid;
    }

    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}
