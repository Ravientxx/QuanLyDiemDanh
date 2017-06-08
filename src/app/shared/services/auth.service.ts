import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs';
import { AppConfig } from '../config'
import { Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class AuthService {
	constructor(private http: Http,private appConfig : AppConfig,private router:Router,private localStorage : LocalStorageService) {}
    // isLoggedIn: boolean = false;
    token :string = '';
    // store the URL to redirect after logging in
    redirectUrl: string;
    redirectMessage: string;
    current_user : any;

    tokenExpired(redirectUrl: string){
        this.redirectUrl = redirectUrl;
        this.redirectMessage = 'Your session is expired. Please login again!';
        this.logout();
    }

    private loginUrl = this.appConfig.host + '/authenticate/login';
    login(email : string, password: string): Observable < { result: string, message: string ,token: string, user: any} > {
        var params = {
            'email': email,
            'password': password
        };
        return this.http.post(this.loginUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    logout(): void {
        this.token = '';
        this.current_user = '';
        //delete from localStorage
        this.localStorage.set('isLoggedIn',false);
        this.localStorage.remove('token','current_user');

        this.router.navigate(['/login']);
    }
}
