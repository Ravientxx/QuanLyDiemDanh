import { Component, OnInit } from '@angular/core';
import {  AppService, AuthService } from '../shared/shared.module';

@Component({
	selector: 'app-semesters',
	templateUrl: './semesters.component.html'
})
export class SemestersComponent implements OnInit {

	public constructor(public  appService: AppService,public  authService: AuthService) {
	}

	public ngOnInit() {}
}
