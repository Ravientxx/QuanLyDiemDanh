import { Component, OnInit } from '@angular/core';
import {  AppService, AuthService } from '../shared/shared.module';

@Component({
	selector: 'app-programs',
	templateUrl: './programs.component.html'
})
export class ProgramsComponent implements OnInit {

	public constructor(public  appService: AppService,public  authService: AuthService) {
	}

	public ngOnInit() {}
}
