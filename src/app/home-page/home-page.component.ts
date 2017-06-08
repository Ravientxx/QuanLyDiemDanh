import { Component, OnInit } from '@angular/core';
import {  AppService, AuthService } from '../shared/shared.module';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

	//public htmlContent: string = null;
	public userType: number = null;

	public role: object = null;

	constructor(private appService: AppService,private authService: AuthService) {
	}

	ngOnInit() {}
}
