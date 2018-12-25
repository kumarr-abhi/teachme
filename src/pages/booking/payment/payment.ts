import { Component, Renderer } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { PayLessonPage } from '../pay-lesson/pay-lesson';
import { UserService } from '../../../providers/user.service';
import { BookTimePage } from '../book-time/book-time';


@Component({
    selector: 'page-payment',
    templateUrl: 'payment.html',
})

export class PaymentPage{

    packages;
    currency;
    selectedPackage;
    selectedPackageIndex;
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public userService: UserService){
        this.selectedPackageIndex = navParams.get('selectedPackageIndex');
        this.selectedPackage = navParams.get('selectedPackage');
        this.userService.getJson()
            .subscribe(response => {
                this.packages = response["booking"]["quick_select_info"];
                this.currency = response["booking"]["currency"];
            });
    }
    closeModal(){
        let data = {'selectedPackage':this.selectedPackage, 'selectedPackageIndex': this.selectedPackageIndex};
        this.viewCtrl.dismiss(data);
    }
    isSelectedIndex(index){
        return  index == this.selectedPackageIndex;
    }
    selectPackage(index,selectedPackage){
        this.selectedPackageIndex = index;
        this.selectedPackage = selectedPackage;
        this.closeModal();
    }
}