import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';

@Component({
	selector: 'app-side-menu',
	templateUrl: './side-menu.component.html',
})
export class SideMenuComponent implements OnInit {

	constructor(private authService: AuthService,private appService: AppService) {
		switch (authService.current_user.role_id){
			case appService.userType.admin:
				this.sideMenu = this.adminMenu;
				break;
			case appService.userType.staff:
				this.sideMenu = this.staffMenu;
				break;
			case this.appService.userType.student:
				this.sideMenu = this.studentMenu;
				break;
			case this.appService.userType.teacher:
				this.sideMenu = this.teacherMenu;
				break;
		}
	}

	ngOnInit() {}

	public sideMenu: Array < any > = [];

	public adminMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Students', url: '/students', icon: 'fa-users'},
		{title: 'Courses', url: '/courses', icon: 'fa-book'},
		{title: 'Teachers', url: '/teachers', icon: 'fa-graduation-cap'},
		{title: 'Schedule', url: '/schedule', icon: 'fa-calendar'},
		{title: 'Absence Requests', url: '/absence-requests', icon: 'fa-envelope'},
		{title: 'Feedbacks',url: '/feedbacks', icon: 'fa-comments'},
		{title: 'Administration', url: '/administration', icon: 'fa-key', 
			subMenu: [{title: 'Users', url: '/administration/users'},		  
					{title: 'Activity Logs', url: '/administration/logs'}]},
		{title: 'Settings', url: '/settings', icon: 'fa-cog'}		  
	];
	public staffMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Students', url: '/students', icon: 'fa-users'},
		{title: 'Courses', url: '/courses', icon: 'fa-book'},
		{title: 'Teachers', url: '/teachers', icon: 'fa-graduation-cap'},
		{title: 'Schedule', url: '/schedule', icon: 'fa-calendar'},
		{title: 'Absence Requests', url: '/absence-requests', icon: 'fa-envelope'},
		{title: 'Feedbacks',url: '/feedbacks', icon: 'fa-comments'},
		{title: 'Settings', url: '/settings', icon: 'fa-cog'}		  
	];

	public studentMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Profile', url: '/profile', icon: 'fa-users'},
		{title: 'Absence Requests', url: '/absence-request', icon: 'fa-envelope'},
		{title: 'Feedback', url: '/feedback', icon: 'fa-comments'},
	];

	public teacherMenu = [
		{title: 'Dashboard', url: '/', icon: 'fa-home'},
		{title: 'Attendance', url: '/attendance', icon: 'fa-key', 
			subMenu: [{title: 'QR Code', url: '/attendance/qrcode'},		  
					{title: 'Checklist', url: '/attendance/checklist'}]},
		{title: 'Profile', url: '/profile', icon: 'fa-users'},
		{title: 'Feedback', url: '/feedback', icon: 'fa-comments'},
	];
}
