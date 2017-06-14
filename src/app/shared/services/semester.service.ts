import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config'
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable()
export class SemesterService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfig: AppConfig,private authService: AuthService,private router :Router) {}

    private getSemesterUrl = this.appConfig.apiHost + '/semester';
    getSemester(id: number): Observable < { result: string, semester : any , message:string} > {
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${this.getSemesterUrl}/${id}`,options)
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
