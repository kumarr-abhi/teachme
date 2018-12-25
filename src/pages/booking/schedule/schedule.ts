import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../login/login';
import { SearchTeacherPage } from '../../search-teacher/search-teacher';
import { UserService } from '../../../providers/user.service';
import * as moment from 'moment';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  classes;
  merediem = "am";
  schedules = [];
  weekdayIndexMap = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday"
  };
  weekdayDateMap = {};
  constructor(public navParams: NavParams, public userService: UserService, public navCtrl: NavController) {
    this.schedules = navParams.data;
    this.restructureClasses();
  }

  restructureClasses() {
    for (let schedule of this.schedules) {
      schedule["dayWiseClasses"] = {};
      let classes = schedule["classes"];
      for (let eachClass of classes) {
        let day = new Date(eachClass["start"]).getDay();
        let time = eachClass["start"].slice(11,16);
        let key = this.weekdayIndexMap[day] + " " + time;
        if (schedule["dayWiseClasses"][key] == undefined) {
          schedule["dayWiseClasses"][key] = [];
        }
        schedule["dayWiseClasses"][key].push(eachClass);
      }
      //Sort
      // var orderedSchedule = {};
      // Object.keys(schedule["dayWiseClasses"]).sort().forEach(function(key) {
      //   orderedSchedule[key] = schedule["dayWiseClasses"][key];
      // });
      // schedule["dayWiseClasses"] = orderedSchedule;
    }
  }

  startTime(index, day) {
    this.merediem = "am";
    let currentLesson = this.schedules[index]["dayWiseClasses"][day][0]["start"];
    currentLesson = moment.utc(currentLesson).local().format('YYYY-MM-DD HH:mm:ss');
    let time = currentLesson.slice(11, 13);
    if (time >= 12) {
      this.merediem = "pm";
      if (time > 12)
        time = time - 12;
    }
    time = time + ":" + currentLesson.slice(14, 16);
    return time;
  }

  endTime(index, day) {
    let currentLesson = this.schedules[index]["dayWiseClasses"][day][0]["end"];
    currentLesson = moment.utc(currentLesson).local().format('YYYY-MM-DD HH:mm:ss');
    let time = currentLesson.slice(11, 13);
    if (time >= 12) {
      if (time > 12)
        time = time - 12;
    }
    time = time + ":" + currentLesson.slice(14, 16) + " " + this.merediem;
    return time;
  }

  nextLesson(index, day) {
      let nextLesson = this.schedules[index]["dayWiseClasses"][day][0]["start"];
      let nextLessonDate = nextLesson.slice(0, 4) + "." + nextLesson.slice(5, 7) + "." + nextLesson.slice(8, 10);
      return nextLessonDate;
  }

  finalLesson(index, day) {
    let lengthOfClass = this.schedules[index]["dayWiseClasses"][day].length;
    let finalLesson = this.schedules[index]["dayWiseClasses"][day][lengthOfClass - 1]["start"];
    let finalLessonDate = finalLesson.slice(0, 4) + "." + finalLesson.slice(5, 7) + "." + finalLesson.slice(8, 10);
    return finalLessonDate;
  }
}