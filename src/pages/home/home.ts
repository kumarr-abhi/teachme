import { Component } from '@angular/core';
import { NavController, MenuController, IonicPage } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SearchTeacherPage } from '../search-teacher/search-teacher';
import { TeacherDetailPage } from '../teacher-detail/teacher-detail';
import { TeacherService } from '../../providers/teacher.service';
import {Observable} from 'rxjs/Rx';

import { StudentInformationPage } from '../student-information/student-information';
import { BookTimePage } from '../booking/book-time/book-time';
import { AboutUsPage } from '../about-us/about-us';
import { MiscService } from '../../providers/misc.service';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import { UserService } from '../../providers/user.service';

@IonicPage({
    name: 'home-page',
    segment: 'home'
})
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    strengthColorMap = {
        'strength_phonetic': '#FE7372',
        'strength_pronunciation': '#FDD657',
        'strength_tpr': '#F9690A',
        'strength_behavior_management': '#FF9999',
        'strength_early_childhood': '#FF9999',
        'strength_writing': '#9B9B9B',
        'strength_english_test_prep': '#FD7676',
        'strength_grammar_training': '#2AB6FB',
        'strength_conversation_training': '#B8E986',
        'strength_personalized_lesson': '#B8E986'
    };
    featuredTeachers: any
    cloudFrontUrl = 'https://d33y6lpccd7zn3.cloudfront.net';
    currentReviewIndex = 1;
    ticks = 0;
    currentBannerBGIndex = 0;
    featuredTeacherOffset = 0;
    classroomKeys = ['manipulatives', 'reward_system', 'educational_environment', 'class_notes', 'community_interaction', 'set_curriculum'];
    strengths = ['english_test_prep','conversation_training', 'phonetic', 'pronunciation', 'tpr', 'behavior_management', 'early_childhood', 'writing',  'grammar_training',  'personalized_lesson'];

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public teacherService: TeacherService, public miscService: MiscService, public translateService: TranslateService, public userService: UserService) {
    }

    ngOnInit() {
        this.featuredTeachers = [];
        this.teacherService.featuredTeachers().subscribe(response => {
            this.featuredTeachers = response;
            this.setFeatureTeacherOffset(0);
        });

        this.focusToPage(1);
        this.prepareBannerSlider();
        this.prepareStrengthScroller();
    }

    prepareStrengthScroller() {
        setTimeout(() => {
            let containerWidth = $('.scroller-container').parent().width();
            let itemWidth = containerWidth * 0.3;
            let zoomedItemWidth = itemWidth * 1.15;
            let maxScale = zoomedItemWidth / itemWidth - 1;
            let radiusToStartZoom = 100;
            let margin = 0.025 * containerWidth / 2;

            $('.scroller-container').css({
                margin: '0 auto',
                width: (containerWidth - 8),
                padding: '32px ' + margin + 'px',
                overflow: 'scroll',
            });
            $('.scroller-container .scroller-item').width(itemWidth);
            $('.scroller-container .scroller-item').each((index, item) => {
                this.updateItemScale(item, maxScale, radiusToStartZoom, itemWidth, margin);
            });
            $('.scroller-container').scroll(() => {
                $('.scroller-container .scroller-item').each((index, item) => {
                    this.updateItemScale(item, maxScale, radiusToStartZoom, itemWidth, margin);
                });
            });
        }, 600);
    }

    postContactForm() {
        this.miscService.postContactForm({
            name: $('input[name="name"]').val(),
            email: $('input[name="email"]').val(),
            contact_method: $('input[name="contact_method"]').val(),
            company: $('input[name="company"]').val(),
            message: $('textarea[name="message"]').val(),
        }).subscribe(response => {
            this.translateService.get('contact.success').subscribe((value) => {
                alert(value);
            }, err => {
                console.log(err);
            });
        });
    }

    updateItemScale(item, maxScale, radiusToStartZoom, itemWidth, margin) {
        let $item = $(item);
        let $parent = $item.parent();
        let parentCenter = $parent.offset().left + $parent.width() / 2 ;
        let itemCenter = $item.offset().left + $item.width() / 2 ;

        let distance = Math.abs(parentCenter - itemCenter);
        var scale = 1;
        if (distance <= 100) {
            scale = 1 + maxScale * (radiusToStartZoom - distance) / radiusToStartZoom;
        }
        $item.css({
            margin: margin + 'px',
            'transform': 'scale(' + scale + ')',
            'z-index': scale == 1 ? 100 : 200,
        });
    }

    goToLogin() {
        // this.navCtrl.setRoot(StudentInformationPage);
        // this.navCtrl.setRoot(BookTimePage);
        if(localStorage.getItem('currentUser') == null){
            this.navCtrl.setRoot(LoginPage);
        }
        else{
            this.navCtrl.setRoot(SearchTeacherPage);
        }
    }

    focusToPage(page) {
        this.currentReviewIndex = page;
    }

    setFeatureTeacherOffset(offset) {
        this.featuredTeacherOffset = offset;
    }

    shouldShowFeatureTeacher(index) {
        var diff = index - this.featuredTeacherOffset;
        var ret = diff >= 0 && diff < 3;
        return ret;
    }

    nextTeacher() {
        this.featuredTeacherOffset++;
    }

    previousTeacher() {
        this.featuredTeacherOffset--;
    }

    prepareBannerSlider() {
        let timer = Observable.timer(5000, 5000);
        timer.subscribe((t) => {
            this.ticks = t;
            this.currentBannerBGIndex = t % 2;
        });
    }

    openUserMenu() {
        this.userService.openUserMenu(this.navCtrl);
      }

    teacherClicked(teacher) {
        this.navCtrl.push(TeacherDetailPage, { 'teacherDetail': teacher });
    }
}
