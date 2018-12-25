import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { VideoPlayer } from '@ionic-native/video-player';
import { TranslateModule } from '@ngx-translate/core';
import { HomePageModule } from './home/home.module';
import { ListPage } from './list/list';
import { LoginPage } from './login/login';
import { StudentInformationPage } from './student-information/student-information';
import { SearchTeacherPage } from './search-teacher/search-teacher';
import { TeacherDetailPage } from './teacher-detail/teacher-detail';
import { BookTimePage } from './booking/book-time/book-time';
import { PaymentPage } from './booking/payment/payment';
import { PayLessonPage } from './booking/pay-lesson/pay-lesson';
import { CreditCardInfoPage } from './booking/credit-card-info/credit-card-info';
import { ScheduleTabsPage } from './booking/schedule-tabs/schedule-tabs';
import { SchedulePage } from './booking/schedule/schedule';
import { StudentListPage } from './personal-information/student-list/student-list';
import { StudentInformationDetailPage } from './personal-information/student-information-detail/student-information-detail';
import { FeedbackPage } from './personal-information/feedback/feedback';
import { CustomerServicePage } from './personal-information/customer-service/customer-service';

import { PipesModule } from '../pipes/pipes.module';
import { SuccessPageModule } from './booking/success/success.module';

@NgModule({
    declarations: [
        ListPage,
        LoginPage,
        StudentInformationPage,
        SearchTeacherPage,
        TeacherDetailPage,
        BookTimePage,
        PaymentPage,
        PayLessonPage,
        CreditCardInfoPage,
        ScheduleTabsPage,
        SchedulePage,
        StudentListPage,
        StudentInformationDetailPage,
        FeedbackPage,
        CustomerServicePage
    ],
    providers: [
        VideoPlayer
    ],
    imports: [
        TranslateModule,
        PipesModule,
        HomePageModule,
        SuccessPageModule,
        IonicModule.forRoot(ListPage),
        IonicModule.forRoot(LoginPage),
        IonicModule.forRoot(StudentInformationPage),
        IonicModule.forRoot(SearchTeacherPage),
        IonicModule.forRoot(TeacherDetailPage),
        IonicModule.forRoot(BookTimePage),
        IonicModule.forRoot(PaymentPage),
        IonicModule.forRoot(PayLessonPage),
        IonicModule.forRoot(CreditCardInfoPage),
        IonicModule.forRoot(ScheduleTabsPage),
        IonicModule.forRoot(SchedulePage),
        IonicModule.forRoot(StudentListPage),
        IonicModule.forRoot(StudentInformationDetailPage),
        IonicModule.forRoot(FeedbackPage),
        IonicModule.forRoot(CustomerServicePage)
    ],
    exports: [
        ListPage,
        LoginPage,
        StudentInformationPage,
        SearchTeacherPage,
        TeacherDetailPage,
        BookTimePage,
        PaymentPage,
        PayLessonPage,
        CreditCardInfoPage,
        ScheduleTabsPage,
        SchedulePage,
        StudentListPage,
        StudentInformationDetailPage,
        FeedbackPage,
        CustomerServicePage
    ]
})

export class PagesModule{}