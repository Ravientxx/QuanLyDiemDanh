import { Component, OnInit } from '@angular/core';
import { AppService, AuthService } from './shared/shared.module';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    constructor(private appService: AppService, private authService: AuthService, private router: Router,private localStorage : LocalStorageService) {}

    ngOnInit() {
        if (this.localStorage.get('isLoggedIn')) {
            this.authService.current_user = this.localStorage.get('current_user');
            this.authService.token = this.localStorage.get('token').toString();
            this.router.navigate(['/dashboard']);
        }
    }
    email :string = '';
    password :string = '';

    public error_message: any;

    login() {
        this.authService.login(this.email,this.password).subscribe(results => {
            if(results.result == 'success'){
                this.authService.token = results.token;
                this.authService.current_user = results.user;

                //save to localStorage
                this.localStorage.set('isLoggedIn',true);
                this.localStorage.set('token',results.token);
                this.localStorage.set('current_user',results.user);

                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/dashboard';
                this.router.navigate([redirect]);
            }else{
                this.error_message = results.message;
            }
        },error=>{console.log(error)});
    }
}
