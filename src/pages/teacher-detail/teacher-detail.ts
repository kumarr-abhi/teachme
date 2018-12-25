import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { LoginPage } from '../login/login';
import { SearchTeacherPage } from '../search-teacher/search-teacher';
import { BookTimePage } from '../booking/book-time/book-time';
import { SuccessPage } from '../booking/success/success';
import { StrengthMap } from '../../models/teacher/strength-map';
import { StrengthColorMap } from '../../models/teacher/strength-color-map';
import { TeacherService } from '../../providers/teacher.service';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'page-teacher-detail',
  templateUrl: 'teacher-detail.html',
})
export class TeacherDetailPage {

  teacherDetail;
  json;
  created_at: string[];
  strengthColors = [];
  strengths = [];
  environments = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private teacherService: TeacherService, private userService: UserService, private streamingMedia: StreamingMedia) {
    this.teacherDetail = navParams.get('teacherDetail');
    this.teacherService.getJson()
      .subscribe(response => {
        this.json = response["classroom"];
        for (let key in this.teacherDetail.profile) {
          if (key.indexOf('classroom_features') != -1 && this.teacherDetail.profile[key] == 1) {
            let feature = key.replace("classroom_features_", "");
            this.environments.push({ "feature": this.json[feature], "icon": "../../assets/imgs/icons/" + key + ".png", "info": this.json[feature + "_text"] });
          }
        }
      });
    for (let key in this.teacherDetail.profile) {
      if (key.indexOf('strength') != -1 && this.teacherDetail.profile[key] == 1) {
        this.strengths.push({ "strengthTitle": StrengthMap.getStrength(key), "strengthColor": StrengthColorMap.getStrengthColor(key), "strengthIcon": "../../assets/imgs/icons/" + key + ".png" });
      }

    }
  }

  playVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log("Finished Video") },
      errorCallback: (e) => { console.log("Error: ",e) }
    }
    this.streamingMedia.playVideo(this.teacherDetail["video_url"], options);
  }

  payment() {
    this.navCtrl.setRoot(BookTimePage, { 'teacherDetail': this.teacherDetail });
  }

  trial() {
    this.navCtrl.setRoot(SuccessPage, { "page": "trialPage", "teacherDetail": this.teacherDetail });
  }

  openUserMenu() {
    this.userService.openUserMenu(this.navCtrl);
  }
}
