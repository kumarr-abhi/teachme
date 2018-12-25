import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeacherInformation } from '../../models/teacher/teacher-information';
import { Teacher } from '../../models/teacher/teacher';
import { TeacherService } from '../../providers/teacher.service';
import { LoginPage } from '../login/login';
import { TeacherDetailPage } from '../teacher-detail/teacher-detail';
import { StrengthMap } from '../../models/teacher/strength-map';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'page-search-teacher',
  templateUrl: 'search-teacher.html',
})
export class SearchTeacherPage {

  private teacherInformation: TeacherInformation;
  private teachers: Teacher[];
  private searchOptions = {
    gender: '',
    country: '',
    strength: '',
    min_teaching_years: '',
    max_teaching_years: ''
  };
  private gender;
  private country;
  private strength;
  private experience;
  private teacherStrengthInJson;

  private teacherSearchOptions = {};
  private teacherStrength: { [id: string]: string[] } = {};
  constructor(public navCtrl: NavController, public teacherService: TeacherService, public userService: UserService) {
  }

  ngOnInit() {
    this.teacherService.getJson()
      .subscribe(response => {
        this.teacherStrengthInJson = response['landing']['teacher_strength'];
      });
    this.teacherService.teacherSearch()
      .subscribe((response: TeacherInformation) => {
        this.teacherInformation = { ...response };
        this.teachers = this.teacherInformation.data;
        for (let teacher of this.teachers) {
          this.teacherStrength[teacher.profile.id] = [];
          for (let key in teacher.profile) {
            if (key.indexOf('strength') != -1 && teacher.profile[key] == 1)
              this.teacherStrength[teacher.profile.id].push(StrengthMap.getStrength(key));
          }
        }
      }
      );
    this.teacherService.teacherSearchOptions()
      .subscribe(response => {
        this.teacherSearchOptions = response;
        this.teacherSearchOptions['genders'].splice(0, 0, 'All');
        this.teacherSearchOptions['countries'].splice(0, 0, 'All');
        this.setStrengthsArray(this.teacherSearchOptions['strengths']);
        this.teacherSearchOptions['strengths'].splice(0, 0, 'All');
        this.teacherSearchOptions['experiences'].splice(0, 0, 'All');
        let index = this.teacherSearchOptions['experiences'].indexOf('10-1000');
        if (index != -1)
          this.teacherSearchOptions['experiences'][index] = '10+';
      });
  }

  setStrengthsArray(strengths) {                       // Restructures strengths received (strength_) in simple form ( after removing strength_)
    let index = 0;
    for (let strength of strengths) {
      let str = strength.slice(9, strength.length);
      if (this.teacherStrengthInJson[str]) {
        this.teacherSearchOptions['strengths'][index] = this.teacherStrengthInJson[str]['title'];
        index++;
      }
    }
  }

  setOption(key: string, value: string) {
    switch (key) {
      case 'gender':
        if (value === 'All')
          this.gender = this.searchOptions.gender = '';
        else
          this.searchOptions.gender = value.substr(0,1);
        break;
      case 'country':
        if (value === 'All')
          this.country = this.searchOptions.country = '';
        else
          this.searchOptions.country = value;
        break;
      case 'strength':
        if (value === 'All')
          this.strength = this.searchOptions.strength = '';
        else {                                                          //sending request as "strength_****" format
          for (let strength in this.teacherStrengthInJson) {
            if (this.teacherStrengthInJson[strength]['title'] == value) {
              this.searchOptions.strength = 'strength_' + strength;
              break;
            }
          }
        }
        break;
      case 'experience':
        if (value === 'All')
          this.experience = this.searchOptions.min_teaching_years = this.searchOptions.max_teaching_years = '';
        else {
          let range = value.split('-');
          this.searchOptions.min_teaching_years = range[0];
          this.searchOptions.max_teaching_years = range[1];
        }
        break;
    }
    this.teacherService.teacherSearchwithOptions(this.searchOptions)
      .subscribe((response: TeacherInformation) => {
        this.teachers = null;
        this.teacherInformation = { ...response };
        this.teachers = this.teacherInformation.data;
      });
  }

  openUserMenu() {
    this.userService.openUserMenu(this.navCtrl);
  }

  cardClicked(teacher) {
    this.navCtrl.setRoot(TeacherDetailPage, { 'teacherDetail': teacher });
  }

}