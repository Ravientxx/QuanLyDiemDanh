import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import {AppConfig} from '../config';

@Injectable()
export class AbsenceRequestService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfig: AppConfig,private authService: AuthService,private router : Router) {}
        // private instance variable to hold base url
    private getRequestsByStudentUrl = this.appConfig.apiHost + '/absence-request/by-student';
    getRequestsByStudent(id : number,status: number ,search_text: string): Observable < { result: string, absence_requests: Array < any >, message:string} > {
        var params = {
            'id': id,
            'status': status,
            'search_text': search_text
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getRequestsByStudentUrl,params,options)
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
    private changeRequestStatusUrl = this.appConfig.apiHost + '/absence-request/change-status';
    changeRequestStatus(id : number,status : number): Observable < { result: string, message: string } > {
        var params = {
            'id': id,
            'status': status
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.changeRequestStatusUrl,params,options)
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

    private getAbsenceRequestsUrl = this.appConfig.apiHost + '/absence-request/list';
    getAbsenceRequests(status:number,search_text:string): Observable < { result: string, absence_requests: Array < any >, message:string} > {
        var params = {
            'status': status,
            'search_text': search_text
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getAbsenceRequestsUrl,params,options)
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

    private createAbsenceRequestsUrl = this.appConfig.apiHost + '/absence-request/create';
    createAbsenceRequests(reason:string,start_date:any,end_date:any): Observable < { result: string, message:string} > {
        var params = {
            'reason': reason,
            'start_date': start_date,
            'end_date': end_date
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.createAbsenceRequestsUrl,params,options)
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

    private cancelAbsenceRequestsUrl = this.appConfig.apiHost + '/absence-request/cancel';
    cancelAbsenceRequests(id:number): Observable < { result: string, message:string} > {
        var params = {
            'id': id,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.cancelAbsenceRequestsUrl,params,options)
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
