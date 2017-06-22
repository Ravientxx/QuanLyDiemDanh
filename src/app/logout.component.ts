import { Component, OnInit } from '@angular/core';
import { AppService, AuthService } from './shared/shared.module';
import { Router } from '@angular/router';
@Component({
    selector: 'app-logout',
    template: '<div></div>',
})
export class LogoutComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
