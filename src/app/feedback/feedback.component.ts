import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService, FeedbackService } from '../shared/shared.module';
declare var jQuery:any;
@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit {
    
    constructor(private appService: AppService,private feebackService: FeedbackService) {

    }
    ngOnInit() {
    }
}
