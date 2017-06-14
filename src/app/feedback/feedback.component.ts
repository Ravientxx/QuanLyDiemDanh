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
    getFeedbacks(){
        this.feebackService.getFeedbacks(this.search_text,this.selected_role).subscribe(result=>{
            this.feedbacks = result.feedbacks;
        },error=>{console.log(error)});
    }
    ngOnInit() {
        this.getFeedbacks();
    }
    feedbacks =[];
    roles = [
        {
            id: 0,
            name: 'All'
        },
        {
            id: 1,
            name: 'Student' 
        },
        {
            id: 2,
            name: 'Teacher'
        },
        {
            id: 3,
            name: 'Anonymous'
        },
    ];

    search_text = '';
    selected_role = 0;
    selected_feedback;
    feedback_title = '';
    feedback_content = '';
    onChangeRole(){
        this.getFeedbacks();
    }
    onClickFeedback(index){
        this.selected_feedback = index;
        this.feedback_content = this.feedbacks[index].content;
        this.feedback_title = this.feedbacks[index].title;
        this.feebackService.readFeedbacks(this.feedbacks[index].id).subscribe(result=>{
            this.getFeedbacks();
            jQuery('#feedbackDetailModal').modal('show');
        },error=>{console.log(error)});
    }
    onSearchChange(){
        if(this.search_text.length > 3 || this.search_text.length == 0){
            this.getFeedbacks();
        }
    }
}
