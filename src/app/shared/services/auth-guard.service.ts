import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'angular-2-local-storage';
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
    constructor(private authService: AuthService, private router: Router,private localStorage : LocalStorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }
    canLoad(route: Route): boolean {
        let url = `/${route.path}`;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.localStorage.get('isLoggedIn')) {
            this.authService.current_user = this.localStorage.get('current_user');
            this.authService.token = this.localStorage.get('token').toString();
            return true;
        }

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
        this.authService.redirectMessage = 'You have to login first!';
        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    }
}
