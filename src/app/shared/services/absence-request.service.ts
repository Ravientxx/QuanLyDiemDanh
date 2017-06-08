import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import {AppConfig} from '../config';

@Injectable()
export class AbsenceRequestService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfig: AppConfig,private authService: AuthService) {}
        // private instance variable to hold base url
    private getRequestsByStudentUrl = this.appConfig.apiHost + '/absence-request/by-student';
    getRequestsByStudent(id : number): Observable < { result: string, absence_requests: Array < any >, message:string} > {
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${this.getRequestsByStudentUrl}/${id}`,options)
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
}
