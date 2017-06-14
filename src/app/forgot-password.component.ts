import { Component, OnInit } from '@angular/core';
import { AppService, AuthService } from './shared/shared.module';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
    constructor(private route: ActivatedRoute, private appService: AppService, private authService: AuthService, private router: Router, private localStorage: LocalStorageService) {}

    ngOnInit() {
        this.route.params.subscribe(params => { this.reset_token = params['token'] });
        if (this.reset_token) {
            this.authService.resetPasswordCheck(this.reset_token).subscribe(result => {
                this.reset_password_check = result.result;
                this.error_message = result.message;
            }, error => { console.log(error) });
        }
    }
    email: string = '';
    reset_token: string;
    reset_password_check;
    password: string = '';
    confirm_password: string = '';
    resetPassword() {
        this.error_message = '';
        this.authService.resetPassword(this.password, this.confirm_password, this.reset_token).subscribe(result => {
            if (result.result == 'success') {
                this.success_message = "Successfully changed your password ! Returning to login page...";
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            } else {
                this.error_message = result.message;
            }
        }, error => { console.log(error) });
    }

    public error_message: any;
    success_message;
    public apiResult = 'failure';
    forgotPassword() {
        this.authService.forgotPassword(this.email).subscribe(results => {
            this.apiResult = results.result;
            if (results.result == 'failure') {
                this.error_message = results.message;
            }
        }, error => { console.log(error) });
    }
    continue () {
        this.router.navigate(['/login']);
    }
}
