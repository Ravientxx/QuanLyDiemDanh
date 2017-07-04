import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { AppConfig } from '../config';

@Injectable()
export class QuizService {
    // Resolve HTTP using the constructor
    public constructor(public  http: Http,public  appService: AppService,public  appConfig:AppConfig, public  authService: AuthService,public  router:Router) {}

    public getQuizByCourseAndClassUrl = this.appConfig.apiHost + '/quiz/list';
    public getQuizByCourseAndClass(course_id: number,class_id: number): Observable < { result: string, quiz_list: Array<any>, message:string} > {
        var params = {
            'course_id': course_id,
            'class_id' : class_id,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getQuizByCourseAndClassUrl,params,options)
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