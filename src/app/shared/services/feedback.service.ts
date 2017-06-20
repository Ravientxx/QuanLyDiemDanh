import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AppService } from './app.service';
import { AppConfig } from '../config';

@Injectable()
export class FeedbackService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appService: AppService,private appConfig:AppConfig, private authService: AuthService,private router:Router) {}

    private getFeedbacksUrl = this.appConfig.apiHost + '/feedback/list';
    getFeedbacks(search_text:string, role_id: number): Observable < { result: string, feedbacks: Array<any>, message:string} > {
        var params = {
            'search_text': search_text,
            'role_id' : role_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getFeedbacksUrl,params,options)
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
    private readFeedbacksUrl = this.appConfig.apiHost + '/feedback/read';
    readFeedbacks(feedback_id: number): Observable < { result: string, message:string} > {
        var params = {
            'feedback_id' : feedback_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.readFeedbacksUrl,params,options)
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
    private sendFeedbacksUrl = this.appConfig.apiHost + '/feedback/send';
    sendFeedbacks(title: string, content:string, isAnonymous: boolean): Observable < { result: string, message:string} > {
        var params = {
            'title' : title,
            'content' :content,
            'isAnonymous': isAnonymous
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.sendFeedbacksUrl,params,options)
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