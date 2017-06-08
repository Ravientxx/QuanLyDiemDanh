import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
})
export class TopNavigationComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }
  logout(){
  	this.authService.logout();
  }
}
