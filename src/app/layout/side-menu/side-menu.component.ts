import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import * as globalVariable from '../../global-variable';


@Component({
	selector: 'app-side-menu',
	templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements OnInit {

	constructor(private appService: AppService) {
		switch (appService.current_userType){
			case globalVariable.userType.staff:
				this.sideMenu = this.staffMenu;
				break;
			case globalVariable.userType.student:
				this.sideMenu = this.studentMenu;
				break;
			case globalVariable.userType.teacher:
				this.sideMenu = this.teacherMenu;
				break;	
		}
	}

	ngOnInit() {}

	public sideMenu: Array < any > = [];

	public staffMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Students', url: '/students', icon: 'fa-users'},
		{title: 'Courses', url: '/courses', icon: 'fa-book'},
		{title: 'Teachers', url: '/teachers', icon: 'fa-graduation-cap'},
		{title: 'Schedule', url: '/schedule', icon: 'fa-calendar'},
		{title: 'Absence Requests', icon: 'fa-envelope', 
			subMenu: [{title: 'Student', url: '/absence-requests/student'},
					{title: 'Teacher', url: '/absence-requests/teacher'}]},
		{title: 'Admin', icon: 'fa-key', 
			subMenu: [{title: 'Create User', url: '/admin/create-user'},
					{title: 'User Management', url: '/admin/users'},			  
					{title: 'Activity Logs', url: '/admin/logs'}]},
		{title: 'Settings', url: '/settings', icon: 'fa-cog'}		  
	];

	public studentMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Profile', url: '/profile', icon: 'fa-users'},
		{title: 'Absence Requests', url: '/absence-request', icon: 'fa-envelope'},
		{title: 'Feedback', url: '/feedback', icon: 'fa-envelope'},
	];

	public teacherMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Profile', url: '/profile', icon: 'fa-users'},
		{title: 'Absence Requests', url: '/absence-request', icon: 'fa-envelope'},
		{title: 'Feedback', url: '/feedback', icon: 'fa-envelope'},
	];


}
