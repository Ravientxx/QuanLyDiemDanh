import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { SocketService } from '../../services/socket.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
})
export class TopNavigationComponent implements OnInit {

	public constructor(public  router:Router,public  authService : AuthService,public socketService: SocketService,
	public notificationService: NotificationService,public appService: AppService) {
	// socketService.consumeEventOnNotificationPushed();
	//    socketService.invokeNotificationPushed.subscribe(result=>{

	//     });
	}
	public notifications = [];
	public getNotification(){
		this.notificationService.getNotification(this.authService.current_user.id,this.authService.current_user.role_id).subscribe(result=>{
			if(result.result == 'success'){
				this.notifications = result.notifications;
			}else{
				this.appService.showPNotify('failure', result.message, 'error');
			}
		},error=>{this.appService.showPNotify('failure', "Server Error! Can't get notifications", 'error');});
	}

	public ngOnInit() {
		this.getNotification();
	}
	public logout(){
		this.authService.logout();
		this.router.navigate(['/login']);
	}
	public onChangePassword(){
		this.router.navigate(['/change-password']);
	}
	public onNotificationClick(index){

	}
}
	