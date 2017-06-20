import { Component, OnInit } from '@angular/core';
import {  AppService, AuthService } from '../../shared/shared.module';

@Component({
	selector: 'app-dashboard-staff',
	templateUrl: './dashboard-staff.component.html'
})
export class DashboardStaffComponent implements OnInit {

	//public htmlContent: string = null;
	public userType: number = null;

	public role: object = null;

	constructor(private appService: AppService,private authService: AuthService) {
	}

	ngOnInit() {}
}
