import { Component, OnInit,HostListener } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-quiz-display',
  templateUrl: './quiz-display.component.html'
})
export class QuizDisplayComponent implements OnInit {
	public quiz_id;
	public constructor(public  localStorage: LocalStorageService,public  router: Router) {}
	public ngOnInit() {
		this.quiz_id = this.localStorage.get('displayQuizId').toString();
		if(!this.quiz_id || this.quiz_id == undefined){
			this.router.navigate(['/dashboard']);
		}
		this.localStorage.remove('displayQuizId');
	}
	
}