import { Component } from "@angular/core";
import { NavParams, NavController, AlertController } from "ionic-angular";
import { UserService } from "../../../providers/user.service";
import { FormGroup, FormControl } from "@angular/forms";
import { StudentListPage } from "../student-list/student-list";

@Component({
    selector: 'page-student-information-detail',
    templateUrl: 'student-information-detail.html'
})

export class StudentInformationDetailPage {
    studentDetails = {};
    studentInformationDetailForm: FormGroup;
    gender = {
        'm': 'Male',
        'f': 'Female'
    }
    constructor(private navParams: NavParams, private userService: UserService, private navCtrl: NavController, private alertCtrl: AlertController) {
        let studentDetails = this.navParams.get('studentDetails');
        this.studentInformationDetailForm = new FormGroup({
            name: new FormControl(''),
            gender: new FormControl(''),
            age: new FormControl('')
        });
        this.studentDetails['id'] = studentDetails['id'];
        this.studentDetails['name'] = studentDetails['name'];
        this.studentDetails['gender'] = studentDetails['gender'];
        this.studentDetails['age'] = studentDetails['age'];
    }
    save(){
        let values = this.studentInformationDetailForm.value;
        this.userService.updateChild(this.studentDetails['id'], values['name'], values['gender'], values['age'])
            .subscribe(response => {
                let alert = this.alertCtrl.create({
                    title: 'Success !',
                    subTitle: "You have successfully updated student's information",
                    buttons: [{
                        text: 'Dismiss',
                        handler: () => {
                            this.navCtrl.setRoot(StudentListPage);
                        }
                    }]
                });
                alert.present();
            });
    }
    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}