import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { TeacherInformation } from '../models/teacher/teacher-information';
import { ENV } from '@app/env';

@Injectable()
export class TeacherService {

    constructor(public http: HttpClient) {
    }

    getJson(){
        return this.http.get("../../assets/i18n/en.json");
    }

    teacherSearchOptions(){
        return this.http.get(ENV.teacher_search_options);
    }

    featuredTeachers() {
        return this.http.get(ENV.featured);
    }

    teacherSearch():Observable<TeacherInformation>{
        return this.http.get<TeacherInformation>(ENV.teacher_searching);
    }

    teacherSearchwithOptions(searchOptions:{}):Observable<TeacherInformation>{
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let params = new HttpParams();
        for(let key in searchOptions){
            if(searchOptions[key] != '' && searchOptions[key] != null){
                if(searchOptions[key]=='10+')
                params = params.append(key, '10');
                else
                params = params.append(key, searchOptions[key]);
            }
        }
        return this.http.get<TeacherInformation>(ENV.teacher_searching,{params});
    }

    sendTrialWeekday(weekday, teacherId){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + currentUser['access_token']);
        let params = new HttpParams();
        params = params.append('preferred_weekday', weekday);
        return this.http.post(ENV.teacher_searching+"/"+teacherId+"/trials",null,{headers, params});
    }

    sendBookingData(teacherId, childId:string, times:any, vendor: any, creditCardInfo: any){
        debugger;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + currentUser['access_token']);
        var body = {
            "child_id": +childId,
            "times": times,
            "vendor": !!vendor ? vendor : null,
            "credit_card": !!creditCardInfo ? {
                number: creditCardInfo.cardNumber,
                expiry_date: creditCardInfo.expiryDate,
                cvv: creditCardInfo.cvv,
            } :null
        }
        return this.http.post(ENV.teacher_searching+"/"+teacherId+"/booking_requests",JSON.stringify(body),{headers});
    }
}
