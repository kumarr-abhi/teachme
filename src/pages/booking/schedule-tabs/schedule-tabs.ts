import { Component } from "@angular/core";
import { UserService } from "../../../providers/user.service";
import { NavController } from "ionic-angular";
import { SchedulePage } from "../schedule/schedule";

@Component({
    selector: 'page-schedule-tabs',
    templateUrl: 'schedule-tabs.html'
})

export class ScheduleTabsPage {
    schedulePage = SchedulePage;
    schedules;
    children;
    constructor(private userService: UserService, private navCtrl: NavController) {
        this.userService.getScheduleDetails()
            .subscribe(response => {
                this.children = response["children"];
            }, error => {
                console.log("Error: " + error);
            })
    }
    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}