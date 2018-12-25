import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { UserService } from "../../../providers/user.service";
import { StudentInformationDetailPage } from "../student-information-detail/student-information-detail";

@Component({
    selector: 'page-student-list',
    templateUrl: 'student-list.html'
})

export class StudentListPage {
    children: any;
    gender={
        'm': 'Male',
        'f': 'Female'
    };
    constructor(private navCtrl: NavController, private userService: UserService) {
        this.userService.getChildrenInformation()
            .subscribe(response => {
                this.children = response;
            }, error => {
                console.log("Error: "+error);
            });
    }
    selectChild(child) {
        this.navCtrl.push(StudentInformationDetailPage, { 'studentDetails': child });

    }
    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}