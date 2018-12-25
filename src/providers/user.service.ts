import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { ENV } from '@app/env';
import { NavController, MenuController, App, Nav } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';

@Injectable()
export class UserService {

  constructor(public http: HttpClient, public menuCtrl: MenuController) {
  }

  getJson() {
    return this.http.get("../../assets/i18n/en.json");
  }

  getUserInformation() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser != null && currentUser != undefined) {
      return currentUser['user'];
    }
  }

  getChildrenInformation() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + currentUser['access_token']
      })
    };
    return this.http.get(ENV.child_information + currentUser['user']['id'] + '/children', httpOptions);
  }

  addChild(childData) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + currentUser['access_token']
      })
    };
    return this.http.post(ENV.child_information + currentUser['user']['id'] + '/children', childData, httpOptions);
  }

  updateChild(childId, name, gender, age) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + currentUser['access_token']
      })
    };
    let body = {
      name: name,
      gender: gender,
      age: age
    }
    return this.http.put(ENV.child_update + childId, body, httpOptions);
  }

  submitFeedback(content) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + currentUser['access_token'],
        'Accept': "application/json"
      })
    };
    return this.http.post(ENV.feedback, {content: content}, httpOptions);
  }

  getScheduleDetails(){
    return this.http.get("../../assets/schedule.json");
    // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization': 'Bearer ' + currentUser['access_token']
    //   })
    // };
    // return this.http.get(ENV.schedule, httpOptions);
  }

  openUserMenu(navCtrl) {
    if (localStorage.getItem('currentUser') == null) {
      navCtrl.setRoot(LoginPage);
    }
    else {
      this.menuCtrl.enable(true, 'user-menu');
      this.menuCtrl.toggle('right');
    }
  }
}