import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SearchTeacherPage } from '../pages/search-teacher/search-teacher';
import { StudentListPage } from '../pages/personal-information/student-list/student-list';
import { FeedbackPage } from '../pages/personal-information/feedback/feedback';
import { CustomerServicePage } from '../pages/personal-information/customer-service/customer-service';
import { UserService } from '../providers/user.service';
import { ScheduleTabsPage } from '../pages/booking/schedule-tabs/schedule-tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, push: boolean}>;
  userPages: Array<{ title: string, component: any }>;
  activePageMenu= null;
  activeUserMenu= null;
  user: {};

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, translate: TranslateService, private userService: UserService, public menuCtrl: MenuController) {
    this.initializeApp();

    translate.setDefaultLang('en');
    translate.use('zh');

    this.user = this.userService.getUserInformation();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'home', component: HomePage, push: false },
      { title: 'find teachers', component: SearchTeacherPage, push: false },
      { title: 'schedule', component: ScheduleTabsPage, push: false },
      { title: 'about', component: 'about-us-page', push: true }
    ];

    this.userPages = [
      { title: 'student information', component: StudentListPage },
      { title: 'feedback', component: FeedbackPage },
      { title: 'customer service', component: CustomerServicePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.activeUserMenu = null;
    this.activePageMenu = page;
      if (page.push) {
          this.nav.push(page.component);
      } else {
        this.nav.setRoot(page.component);
      }
  }

  checkActivePageMenu(page){
    return page == this.activePageMenu;
  }

  openPageForUser(userPage) {
    this.activePageMenu = null;
    this.activeUserMenu = userPage;
    this.nav.setRoot(userPage.component);
  }

  signout(){
    localStorage.clear();
    this.activePageMenu = null;
    this.activeUserMenu = null;
    this.nav.setRoot(HomePage);
  }

  checkActiveUserMenu(userPage) {
    return userPage == this.activeUserMenu;
  }
  redirectTo(url) {
    window.open(url);
  }
}