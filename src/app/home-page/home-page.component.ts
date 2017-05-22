import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import * as globalVariable from '../global-variable';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

	//public htmlContent: string = null;
	public userType: number = null;

	public role: object = null;

	constructor(private appService: AppService) {
		/*switch (appService.current_userType){
			case globalVariable.userType.staff:
				this.htmlContent = '<staff-home-page></staff-home-page>';
				break;
			case globalVariable.userType.student:
				this.htmlContent = '<student-home-page></student-home-page>';
				break;
			case globalVariable.userType.teacher:
				this.htmlContent = '<teacher-home-page></teacher-home-page>';
				break;
		}*/

		this.userType = appService.current_userType;
		this.role = globalVariable.userType;
	}

	ngOnInit() {}
}
