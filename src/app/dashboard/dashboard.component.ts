import { Component, OnInit } from '@angular/core';
import {  AppService, AuthService } from '../shared/shared.module';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

	//public htmlContent: string = null;
	public userType: number = null;

	public role: object = null;

	constructor(private appService: AppService,private authService: AuthService) {
	}

	ngOnInit() {}
}
