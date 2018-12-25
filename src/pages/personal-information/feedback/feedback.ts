import { Component } from "@angular/core";
import { UserService } from "../../../providers/user.service";
import { NavController, AlertController } from "ionic-angular";
import { HomePage } from "../../home/home";

@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html'
})

export class FeedbackPage {
    feedback;
    constructor(private userService: UserService, private navCtrl: NavController, private alertCtrl: AlertController) {
    }

    submit(){
        this.userService.submitFeedback(this.feedback)
            .subscribe(response => {
                let alert = this.alertCtrl.create({
                    title: 'Success !',
                    subTitle: "Thanks for your feedback !",
                    buttons: [{
                        text: 'Dismiss',
                        handler: () => {
                            this.navCtrl.setRoot(HomePage);
                        }
                    }]
                });
                alert.present();
            }, error => {
                console.log("Error: "+JSON.stringify(error));
            });
    }

    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
    }
}