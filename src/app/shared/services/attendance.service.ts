import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable()
export class AttendanceService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appConfig: AppConfig, private authService: AuthService,private router:Router) {}
    private getAttendanceListByCourseUrl = this.appConfig.apiHost + '/attendance/list-by-course';
    getAttendanceListByCourse(course_id: number, classes_id: Array<number>): Observable < { result: string, attendance_lists: Array<any>, message:string} > {
        var params = {
            'course_id': course_id,
            'classes_id' : classes_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getAttendanceListByCourseUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private checkAddToCourseUrl = this.appConfig.apiHost + '/attendance/check-add-to-course';
    checkAddToCourse(course_id: number,student_code: string,student_name: string): Observable < { result: string, message:string} > {
        var params = {
            'course_id': course_id,
            'student_code' : student_code,
            'student_name' : student_name,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.checkAddToCourseUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private updateAttendanceListByCourseUrl = this.appConfig.apiHost + '/attendance/update-list-by-course';
    updateAttendanceListByCourse(course_id: number,classes_id: Array<number>,attendance_lists: Array<any>): Observable < { result: string, message:string} > {
        var params = {
            'course_id': course_id,
            'classes_id': classes_id,
            'attendance_lists' : attendance_lists
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.updateAttendanceListByCourseUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }

    private getOpeningAttendanceUrl = this.appConfig.apiHost + '/attendance/opening-by-teacher';
    getOpeningAttendanceCourse(teacher_id: number): Observable < { result: string, opening_attendances: Array<any>, message:string} > {
        var params = {
            'teacher_id': teacher_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getOpeningAttendanceUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }

    private createAttendanceUrl = this.appConfig.apiHost + '/attendance/create';
    createAttendance(course_id:number,classes_id:number,teacher_id:number): Observable < { result: string, message:string} > {
        var params = {
            'course_id': course_id,
            'class_id': classes_id,
            'created_by' : teacher_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.createAttendanceUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private cancelAttendanceUrl = this.appConfig.apiHost + '/attendance/delete';
    cancelAttendance(attendance_id:number): Observable < { result: string, message:string} > {
        var params = {
            'attendance_id': attendance_id,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.cancelAttendanceUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private closeAttendanceUrl = this.appConfig.apiHost + '/attendance/close';
    closeAttendance(attendance_id:number): Observable < { result: string, message:string} > {
        var params = {
            'attendance_id': attendance_id,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.closeAttendanceUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }

    private getCheckAttendanceListUrl = this.appConfig.apiHost + '/attendance/check-attendance-list';
    getCheckAttendanceList(course_id: number, class_id: number): Observable < { result: string, check_attendance_list: Array<any>, message:string} > {
        var params = {
            'course_id': course_id,
            'class_id' : class_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getCheckAttendanceListUrl,params,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    
}