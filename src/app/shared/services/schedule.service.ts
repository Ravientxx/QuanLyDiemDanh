import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable()
export class ScheduleService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appConfig: AppConfig, private authService: AuthService,private router: Router) {}
    private updateScheduleUrl = this.appConfig.apiHost + '/schedule/update/';
    updateSchedule(classes : any): Observable < { result: string, message : string} > {
        var params = {
            'classes': classes
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.updateScheduleUrl,params,options)
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
    private getSchedulesAndCoursesUrl = this.appConfig.apiHost + '/schedule/schedules-and-courses/';
    getSchedulesAndCourses(program_id:number, class_id : number, semester_id : number): Observable < { result: string, courses: Array<any> ,message : string} > {
        var params = {
            'program_id': program_id,
            'class_id': class_id,
            'semester_id': semester_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getSchedulesAndCoursesUrl,params,options)
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