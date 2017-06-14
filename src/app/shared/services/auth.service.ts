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

    private logoutUrl = this.appConfig.host + '/authenticate/logout';
    logout(): void {
        var params = {
            'token': this.token,
        };
        //this.http.post(this.logoutUrl, params).catch((error: any) => Observable.throw(error || 'Server error'));

        this.token = '';
        this.current_user = '';
        //delete from localStorage
        this.localStorage.set('isLoggedIn',false);
        this.localStorage.remove('token','current_user');
    }

    private forgotPasswordUrl = this.appConfig.host + '/authenticate/forgot-password';
    forgotPassword(email : string): Observable < { result: string, message: string} > {
        this.token = '';
        this.current_user = '';
        this.localStorage.set('isLoggedIn',false);
        this.localStorage.remove('token','current_user');
        var params = {
            'email': email,
        };
        return this.http.post(this.forgotPasswordUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    private resetPasswordCheckUrl = this.appConfig.host + '/authenticate/reset-password-check';
    resetPasswordCheck(token : string): Observable < { result: string, message: string} > {
        var params = {
            'token': token,
        };
        return this.http.post(this.resetPasswordCheckUrl, params)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    private resetPasswordUrl = this.appConfig.host + '/authenticate/reset-password';
    resetPassword(password : string,confirm_password: string,token:string): Observable < { result: string, message: string} > {
        var params = {
            'password': password,
            'confirm_password': confirm_password,
            'token': token
        };
        return this.http.post(this.resetPasswordUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
