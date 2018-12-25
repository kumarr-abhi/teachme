import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../../../providers/user.service';
import { TeacherService } from '../../../providers/teacher.service';
import { LoginPage } from '../../login/login';
import { SearchTeacherPage } from '../../search-teacher/search-teacher';
import { SuccessPage } from '../success/success';
import { CreditCardInfoPage } from '../credit-card-info/credit-card-info';

@Component({
  selector: 'page-pay-lesson',
  templateUrl: 'pay-lesson.html',
})
export class PayLessonPage {

  studentName;
  children: any;
  teacherId;
  times = {};
  price;
  currency = " yuan";
  studentForm: FormGroup;
  paymentForm: FormGroup;
  paymentOption = {};
  paymentOptionKeys = [];
  paymentMethod;
  firstLesson;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, public teacherService: TeacherService) {
    this.studentForm = new FormGroup({
      childId: new FormControl('')
    });
    this.paymentForm = new FormGroup({
      formControlPaymentMethod: new FormControl('')
    });
    this.teacherId = this.navParams.get('teacherId');
    this.times = this.navParams.get('times');
    this.price = this.navParams.get('price') + this.currency;
    this.userService.getChildrenInformation()
      .subscribe(response => {
        this.children = response;
      }, error => {
        console.log("Error: " + error);
      });
    this.paymentOption = {
      "wechatPay": {
        "icon": "../../../assets/imgs/icons/wechat.png",
        "label": "Wechat Pay",
      },
      "aliPay": {
        "icon": "../../../assets/imgs/icons/alipay.png",
        "label": "Alipay"
      },
      "creditCard": {
        "icon": "../../../assets/imgs/icons/credit_card.png",
        "label": "Credit Card"
      }
    }
    this.paymentOptionKeys = Object.keys(this.paymentOption);
  }
  buttonDisabled() {
    if (this.studentForm.value.childId == "" || this.studentForm.value.childId == undefined || this.paymentForm.value.formControlPaymentMethod == "" || this.paymentForm.value.formControlPaymentMethod == undefined)
      return true;
    else
      return false;
  }

  pay() {
      if (this.paymentForm.value.formControlPaymentMethod === 'creditCard') {
          this.navCtrl.push(CreditCardInfoPage, {
              teacherId: this.teacherId,
              times: this.times,
              childId: this.studentForm.value.childId
          });
      } else {
          this.teacherService.sendBookingData(this.teacherId, this.studentForm.value.childId, this.times, this.paymentForm.value.formControlPaymentMethod, null)
          .subscribe(response => {
              console.log("response: " + JSON.stringify(response));
              document.write(response['payment_html']);
          }, error => {
              debugger;
              console.log("Error: " + JSON.stringify(error));
          });
      }
  }
}
