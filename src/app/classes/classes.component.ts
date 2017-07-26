import { Component, OnInit } from '@angular/core';
import {  AppService, AuthService } from '../shared/shared.module';

@Component({
	selector: 'app-classes',
	templateUrl: './classes.component.html'
})
export class ClassesComponent implements OnInit {

	public constructor(public  appService: AppService,public  authService: AuthService) {
	}

	public ngOnInit() {}
}
