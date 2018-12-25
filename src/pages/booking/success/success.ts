import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { LoginPage } from '../../login/login';
import { SearchTeacherPage } from '../../search-teacher/search-teacher';
import { UserService } from '../../../providers/user.service';
import { TeacherService } from '../../../providers/teacher.service';
import { ScheduleTabsPage } from '../schedule-tabs/schedule-tabs';

@IonicPage({
  name: 'success-page',
  segment: 'payment-result'  
})

@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  
  page = 'paymentSuccessPage' ;
  weekdays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  selectedDay=0;
  teacherDetail;
  trialBookingSuccess:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, public teacherService: TeacherService) {
    this.trialBookingSuccess = false;
    this.teacherDetail = navParams.get('teacherDetail');
    if (this.navParams.get('page') == 'trialPage') {
      this.page = "trialPage";
    }
    else if (this.navParams.get('page') == 'paymentSuccessPage') {
      this.page = "paymentSuccessPage";
    }
  }

  checkSchedule() {
    this.navCtrl.setRoot(ScheduleTabsPage);
  }

  openUserMenu() {
    this.userService.openUserMenu(this.navCtrl);
  }

  selectDay(day){
    this.selectedDay = this.weekdays.indexOf(day)+1;
  }

  buttonDisabled(){
    return this.selectedDay == 0;
  }

  sure(){
    this.teacherService.sendTrialWeekday(this.selectedDay, this.teacherDetail['id'])
    .subscribe(response => {
      this.trialBookingSuccess = true;
      this.page = null;
    }, error => {
      console.log("Error: "+error);
    });
  }
}