import { Component, SimpleChanges } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../login/login';
import { SearchTeacherPage } from '../../search-teacher/search-teacher';
import { PaymentPage } from '../payment/payment';
import { BookingService } from '../../../providers/booking.service';
import { PayLessonPage } from '../pay-lesson/pay-lesson';
import { UserService } from '../../../providers/user.service';

@Component({
  selector: 'page-book-time',
  templateUrl: 'book-time.html',
})
export class BookTimePage {
  day: string;                                            //currently selected day
  merediem: string = "pm";                                //initially selected merediem
  time: string;                                           //currently selected time
  days = [];                                              //days for display = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  times = [];                                             //times for display = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00']
  selectedDaysIndex = [];                                 //stores index of selected days in order to change the background color
  selectedTimes = {};                                     //stores selected times in order to change the background color
  selectedDatesIndex: { [key: string]: string[] } = {};   //stores index of selected dates corresponding to each Day and Time in order to change the background color
  dates: any = {};                                        //stores dates returned in response for each Day/Time combination in format {{"Mon 08:00":["2018-08-06", "2018-08-13", "2018-08-20"]},{......}}
  timesForRequest = [];                                   //times for sending data in request in the format [["2018-03-18 09:30:00"],["2018-03-25 09:30:00"],["2018-04-01 09:30:00"]]
  backgroundColor = '#ffffff';
  color = '#06B9FC';
  selectedDayIndex;                                            //keeps index of selected day
  teacherDetail;
  isDaySelected = false;                                  //set to true to avoid selection of time before selection of day
  discount = "5%";
  numberOfDatesSelected = 0;                              //needed for calculating discount related info
  remainingDateForNextDiscount = 10;
  currency;
  packageInformation;
  bookingData = {};                                       //data returned from json in assets' json file(en.json)
  discountedPrice: string;
  originalPrice: string;
  pricePerClass: string;
  disablePaymentButton = true;
  disableQuickSelectButton = true;
  isPackageSelected = false;
  selectedPackage;
  dotIndexForDays = [];
  dotIndexForTimes = [];
  dayAndIndexMap = {};
  timeAndIndexMap = {};
  countOfDatesPerDay = {};
  countOfDatesPerTime = [];
  selectedPackageIndex;

  availableTimes;
  availableWeekdays = [];
  weekdayAndTimeMap = {};
  timeFlag = false;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public bookingService: BookingService, public navParams: NavParams, public userService: UserService) {
    this.teacherDetail = navParams.get("teacherDetail");
    this.bookingService.getBookingJson()
      .subscribe((response) => {
        this.bookingData = response["booking"];
        this.days = this.bookingData["days"];
        this.times = this.bookingData["times"][this.merediem];
        this.currency = this.bookingData["currency"];
        this.packageInformation = this.bookingData["quick_select_info"];
        let count = 0;
        for (let day of this.days) {
          this.dayAndIndexMap[day] = count++;
        }
        count = 0;
        for (let time of this.times) {
          this.timeAndIndexMap[time] = count++;
        }
      });
    this.bookingService.getAvailabelTimes(this.teacherDetail['id'])
      .subscribe((response) => {
        this.availableTimes = response;
        for (let availableDay in this.availableTimes) {
          let weekday = this.availableTimes[availableDay]["weekday"];
          if (this.availableWeekdays.indexOf(weekday) < 0)
            this.availableWeekdays.push(weekday);
        }
        for (let availableDay in this.availableTimes) {
          let weekday = this.availableTimes[availableDay]["weekday"];
          this.weekdayAndTimeMap[weekday] = [];
          for (let availableTime of this.availableTimes[availableDay]["times"]) {
            if (this.weekdayAndTimeMap[weekday].indexOf(availableTime) < 0)
              this.weekdayAndTimeMap[weekday].push(availableTime);
          }
        }
      });
  }

  selectDay(index, day) {                                         //invoked when user selects day
    this.timeFlag = true;
    if (this.selectedDaysIndex.indexOf(index) < 0)
      this.selectedDaysIndex.push(index);
    this.selectedDayIndex = index;
    this.day = day;
    this.isDaySelected = true;
    if (this.selectedTimes[this.day] == null || this.selectedTimes[this.day] == undefined)
      this.selectedTimes[this.day] = [];
    if (this.countOfDatesPerDay[day] == null || this.countOfDatesPerDay[day] == undefined)
      this.countOfDatesPerDay[day] = 0;
  }

  isTimeAvailable(time) {
    if (this.weekdayAndTimeMap[this.selectedDayIndex] != undefined) {
      return this.weekdayAndTimeMap[this.selectedDayIndex].indexOf(time) < 0 && this.timeFlag;
    }
  }

  selectMeridiem(meridiem: string) {                              //invoked when user selects AM / PM button
    this.merediem = meridiem;
    this.times = this.bookingData["times"][this.merediem];
    if (this.selectedTimes[this.day] == null || this.selectedTimes[this.day] == undefined)
      this.selectedTimes[this.day] = [];
  }

  selectTime(index, time) {                                       //invoked when user selects time
    if (this.isDaySelected) {
      this.time = time;
      if (this.countOfDatesPerTime[time] == null || this.countOfDatesPerTime[time] == undefined)
        this.countOfDatesPerTime[time] = 0;
      let selectedTimeIndex = this.selectedTimes[this.day].indexOf(time);
      if (selectedTimeIndex < 0) {
        this.selectedTimes[this.day].push(time);
        this.dates[this.day + " " + this.time] = [];
        for (let availableTime in this.availableTimes) {
          if (this.availableTimes[availableTime]["times"].indexOf(time) > -1) {
            this.dates[this.day + " " + this.time].push(this.availableTimes[availableTime]["date"]);
          }
        }
        this.dates = Object.assign({}, this.dates);
        this.disableQuickSelectButton = false;
      }
      else {
        this.selectedTimes[this.day].splice(selectedTimeIndex, 1);
        let localDates = {};
        for (let key in this.dates) {
          if (key == (this.days[this.selectedDayIndex] + " " + this.time)) {
            this.remainingDateForNextDiscount = this.remainingDateForNextDiscount + this.selectedDatesIndex[key].length;
            this.numberOfDatesSelected = this.numberOfDatesSelected - this.selectedDatesIndex[key].length;
            this.countOfDatesPerDay[this.day] = this.countOfDatesPerDay[this.day] - this.selectedDatesIndex[this.day + " " + this.time].length;
            this.countOfDatesPerTime[time] = this.countOfDatesPerTime[time] - this.selectedDatesIndex[this.day + " " + this.time].length;
            this.setIndexForDots(this.day + " " + time);
            delete this.dates[this.days[this.selectedDayIndex] + " " + this.time];
            if (this.numberOfDatesSelected == 0)
              this.disableQuickSelectButton = true;
          }
        }
        this.dates = Object.assign({}, this.dates);
      }
      this.selectDiscount();
      this.selectedDatesIndex[this.day + " " + this.time] = [];
    }
  }

  selectDate(index, dayTime: string, date: string) {                //invoked when user selects date
    for (let dayKey in this.selectedDatesIndex) {
      if (dayTime == dayKey) {                                                        //Logic for changing backgroung of selected date
        if (this.selectedDatesIndex[dayKey].indexOf(index) < 0) {
          this.selectedDatesIndex[dayKey].push(index);
          this.numberOfDatesSelected = this.numberOfDatesSelected + 1;
          this.countOfDatesPerDay[dayKey.slice(0, 3)] = this.countOfDatesPerDay[dayKey.slice(0, 3)] + 1;
          this.countOfDatesPerTime[dayKey.slice(4, 9)] = this.countOfDatesPerTime[dayKey.slice(4, 9)] + 1;
          this.addTimeInRequestObject(dayTime, date);
        }
        else {
          this.selectedDatesIndex[dayKey].splice(this.selectedDatesIndex[dayKey].indexOf(index), 1);
          this.numberOfDatesSelected = this.numberOfDatesSelected - 1;
          this.countOfDatesPerDay[dayKey.slice(0, 3)] = this.countOfDatesPerDay[dayKey.slice(0, 3)] - 1;
          this.countOfDatesPerTime[dayKey.slice(4, 9)] = this.countOfDatesPerTime[dayKey.slice(4, 9)] - 1;
          this.removeTimeFromRequestObject(dayKey, date);
        }
        this.setIndexForDots(dayTime);
      }
    }
    if (this.timesForRequest.length == 0) {
      this.disablePaymentButton = true;
    }
    else {
      this.disablePaymentButton = false;
    }
    this.selectDiscount();
  }

  setIndexForDots(dayTime) {
    let day = dayTime.slice(0, 3);
    let time = dayTime.slice(4, 9);
    let timeInNumber = dayTime.slice(4, 6);

    if (this.countOfDatesPerDay[day] == 0) {
      if (this.dotIndexForDays.indexOf(this.dayAndIndexMap[day]) > -1) {
        this.dotIndexForDays.splice(this.dotIndexForDays.indexOf(this.dayAndIndexMap[day]), 1);
      }
    }
    else {
      if (this.dotIndexForDays.indexOf(this.dayAndIndexMap[day]) < 0) {
        this.dotIndexForDays.push(this.dayAndIndexMap[day]);
      }
    }
    if (this.countOfDatesPerTime[time] == 0) {
      if (this.dotIndexForTimes.indexOf(time) > -1) {
        this.dotIndexForTimes.splice(this.dotIndexForTimes.indexOf(time), 1);
      }
    }
    else {
      if (this.dotIndexForTimes.indexOf(time) < 0) {
        this.dotIndexForTimes.push(time);
      }
    }
  }

  addTimeInRequestObject(dayTime: string, date: string) {
    for (let localDate of this.dates[dayTime]) {                                   //if selected date is found in this.dates then restructuring the date into MM-DD format
      let d = date.slice(0, 2) + "-" + date.slice(3, 5);
      if (localDate.indexOf(d) > -1) {
        this.timesForRequest.push(localDate + " " + dayTime.slice(4, 9) + ":00");
      }
    }
  }

  removeTimeFromRequestObject(dayTime: string, date: string) {
    for (let localDate of this.dates[dayTime]) {
      let d = date.slice(0, 2) + "-" + date.slice(3, 5);
      if (localDate.indexOf(d) > -1) {
        let dateToRemove = localDate + " " + dayTime.slice(4, 9) + ":00";
        if (this.timesForRequest.indexOf(dateToRemove) > -1)
          this.timesForRequest.splice(this.timesForRequest.indexOf(dateToRemove), 1);
      }
    }
  }

  selectDiscount() {
    if (this.numberOfDatesSelected > 0 && this.numberOfDatesSelected < 6) {
      this.remainingDateForNextDiscount = 6 - this.numberOfDatesSelected;
      this.discount = "12%";
      this.calculatePrice('discount_0');
    }
    else if (this.numberOfDatesSelected >= 6 && this.numberOfDatesSelected < 12) {
      this.remainingDateForNextDiscount = 12 - this.numberOfDatesSelected;
      this.discount = "17%";
      this.calculatePrice('discount_12');
    }
    else if (this.numberOfDatesSelected >= 12 && this.numberOfDatesSelected < 24) {
      this.remainingDateForNextDiscount = 24 - this.numberOfDatesSelected;
      this.discount = "22%";
      this.calculatePrice('discount_17');
    }
    else if (this.numberOfDatesSelected >= 24) {
      this.calculatePrice('discount_22');
    }
    else {
      this.originalPrice = '';
      this.discountedPrice = '';
      this.pricePerClass = '';
      this.remainingDateForNextDiscount = 10;
    }
  }

  calculatePrice(discount) {
    let isSpecialPackage = false;
    for (let packageInfo of this.packageInformation) {
      if (packageInfo["classes"] == this.numberOfDatesSelected) {
        this.discountedPrice = packageInfo["discounted_price"] + this.currency;;
        this.originalPrice = packageInfo["original_price"] + this.currency;;
        this.pricePerClass = "x " + this.numberOfDatesSelected + " " + this.currency + packageInfo["price_per_class"] + "/each class";
        isSpecialPackage = true;
      }
    }
    if (!isSpecialPackage) {
      this.discountedPrice = (this.numberOfDatesSelected * this.bookingData['discount'][discount]) + this.currency;
      this.originalPrice = (discount == 'discount_0') ? '' : ((this.numberOfDatesSelected * this.bookingData['discount']['discount_0']) + this.currency);
      this.pricePerClass = "x " + this.numberOfDatesSelected + " " + this.currency + this.bookingData['discount'][discount] + "/each class";
    }
  }

  isWeekdayAvailable(index) {
    return this.availableWeekdays.indexOf(index) < 0;
  }

  /********* Mehod which will change background color of selected day to #06B9FC **********/
  isSelectedDay(index) {
    return this.selectedDayIndex;
  }

  showDaysDots(index) {
    if (index != this.selectedDayIndex && this.dotIndexForDays.indexOf(index) > -1) {
      return true;
    }
  }

  showTimesDots(time) {
    if (this.dotIndexForTimes.indexOf(time) > -1) {
      if (!this.isSelectedTime(time)) {
        return true;
      }
    }
  }

  /********* Mehod which will check mefidiem to change background color of AM/PM button **********/
  checkMeridiem() {
    return this.merediem;
  }

  /********* Mehod which will change background color of selected time to #06B9FC **********/
  isSelectedTime(time) {
    if (this.selectedTimes[this.day] != null || this.selectedTimes[this.day] != undefined)
      return this.selectedTimes[this.day].indexOf(time) > - 1;
  }

  /********* Mehod which will change background color of selected date to #06B9FC **********/
  isSelectedDate(index, dayAndTime) {
    for (let dayKey in this.selectedDatesIndex) {
      if (dayAndTime == dayKey) {
        return this.selectedDatesIndex[dayKey].indexOf(index) > -1;
      }
    }
  }

  quickSelect() {
    let paymentModal = this.modalCtrl.create(PaymentPage, { 'selectedPackage': this.selectedPackage, 'selectedPackageIndex': this.selectedPackageIndex });
    paymentModal.onDidDismiss(data => {
      if (data != null) {
        if (data['selectedPackageIndex'] != null && data['selectedPackageIndex'] != undefined) {
          this.isPackageSelected = true;
          this.selectedPackageIndex = data['selectedPackageIndex'];
          this.selectedPackage = data["selectedPackage"];
          this.discount = "the";
          this.disablePaymentButton = true;
          this.autoSelectDates(this.selectedPackage);
        }
        else {
          this.isPackageSelected = false;
        }
      }
    });
    paymentModal.present();
  }

  payment() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != null && currentUser != undefined) {
      this.navCtrl.push(PayLessonPage, { 'teacherId': this.teacherDetail['id'], 'times': this.timesForRequest, 'price': this.discountedPrice.slice(0, this.discountedPrice.length - 1) });
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  openUserMenu() {
    this.userService.openUserMenu(this.navCtrl);
  }

  autoSelectDates(selectedPackage) {
    for (let dayKey in this.selectedDatesIndex) {
      this.selectedDatesIndex[dayKey] = [];
    }
    for (let key in this.countOfDatesPerTime) {
      this.countOfDatesPerTime[key] = 0;
    }
    for (let day in this.countOfDatesPerDay) {
      this.countOfDatesPerDay[day] = 0;
    }
    this.dotIndexForDays = [];
    this.dotIndexForTimes = [];
    this.numberOfDatesSelected = 0;
    this.originalPrice = '';
    this.discountedPrice = '';
    this.pricePerClass = '';
    let count = +selectedPackage["classes"];
    this.remainingDateForNextDiscount = count;
    outerloop:
    for (let dayTime in this.dates) {
      let index = 0;
      for (let date of this.dates[dayTime]) {
        if (count <= 0)
          break outerloop;
        this.selectDate(index++, dayTime, date.slice(5, 7) + "/" + date.slice(8, 10));
        count--;
      }
    }
    this.disablePaymentButton = false;
  }
}