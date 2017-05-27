import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { StudentAbsenceRequest } from './staff/student/student-absence-request.model';
import { Observable } from 'rxjs';

import {AppConfig} from '../shared/config';

@Injectable()
export class AbsenceRequestService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfig: AppConfig) {}
        // private instance variable to hold base url
    private newRequestsUrl = this.appConfig.apiHost + '/absence-request/student/new';
    getNewRequests(): Observable < StudentAbsenceRequest[] > {
        return this.http.get(this.newRequestsUrl)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private acceptedRequestsUrl = this.appConfig.apiHost + '/absence-request/student/accepted';
    getAcceptedRequests(): Observable < StudentAbsenceRequest[] > {
        return this.http.get(this.acceptedRequestsUrl)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private acceptRequestUrl = this.appConfig.apiHost + '/absence-request/student/accept';
    acceptRequest(id: number): Observable < StudentAbsenceRequest[] > {
        let bodyString = { 'id': id };
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.acceptRequestUrl, bodyString, options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res)
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
