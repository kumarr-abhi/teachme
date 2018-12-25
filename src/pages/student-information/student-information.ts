import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { SearchTeacherPage } from '../search-teacher/search-teacher';
import { UserService } from '../../providers/user.service';

@Component({
    selector: 'page-student-information',
    templateUrl: 'student-information.html',
})
export class StudentInformationPage {

    nameErrorMessage = '';
    genderErrorMessage = '';
    ageErrorMessage = '';
    validName = false;
    validGender = false;
    validAge = false;
    gender = {};
    age = {};
    childData = {
        name: '',
        age_range_min: '',
        age_range_max: '',
        gender: ''
    };

    childInformationAdded = false;

    studentForm: FormGroup;

    constructor(private navCtrl: NavController, private userService: UserService, public alertCtrl: AlertController) {
        this.initializeForm();
        this.userService.getJson()
            .subscribe(response => {
                this.gender = response["user"]["student_information"]["inputs"]["gender"];
                this.age = response["user"]["student_information"]["inputs"]["age"];
            });
    }

    initializeForm() {
        this.studentForm = new FormGroup({
            name: new FormControl(''),
            gender: new FormControl(''),
            age: new FormControl('')
        });
    }

    setChildData() {
        this.childData.name = this.studentForm.value.name;
        this.childData.age_range_min = this.studentForm.value.age.age_range_min;
        this.childData.age_range_max = this.studentForm.value.age.age_range_max,
            this.childData.gender = this.studentForm.value.gender;
    }

    validateNameGenderAndAge() {
        if (this.studentForm.value.name == '' || this.studentForm.value.name == null) {
            this.validName = false;
            this.nameErrorMessage = "Please enter your child's name";
        }
        else {
            this.validName = true;
            this.nameErrorMessage = '';
        }
        if (this.studentForm.value.gender == '' || this.studentForm.value.gender == null) {
            this.validGender = false;
            this.genderErrorMessage = 'Please specify gender';
        }
        else {
            this.validGender = true;
            this.genderErrorMessage = '';
        }
        if (this.studentForm.value.age == '' || this.studentForm.value.age == null) {
            this.validAge = false;
            this.ageErrorMessage = 'Please specify age';
        }
        else {
            this.validAge = true;
            this.ageErrorMessage = '';
        }
    }

    done() {
        this.validateNameGenderAndAge();
        if (this.validName && this.validGender && this.validAge) {
            this.setChildData();
            this.userService.addChild(this.childData)
                .subscribe(response => {
                    this.navCtrl.setRoot(SearchTeacherPage);
                }, error => {
                    console.log("Error in userService.addChild(): " + JSON.stringify(error));
                }
                );
        }
        else {
            this.navCtrl.setRoot(SearchTeacherPage);
        }
    }
    add() {
        this.validateNameGenderAndAge();
        if (this.validName && this.validGender && this.validAge) {
            this.childInformationAdded = false;
            this.setChildData();
            this.userService.addChild(this.childData)
                .subscribe(response => {
                    this.studentForm.controls.name.reset();
                    this.studentForm.controls.gender.reset();
                    this.studentForm.controls.age.reset();
                    this.childInformationAdded = true;
                }, error => {
                    console.log("Error in userService.addChild() on adding child information: " + JSON.stringify(error));
                }
                );
        }

    }
    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}