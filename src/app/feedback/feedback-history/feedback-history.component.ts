import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService, FeedbackService } from '../../shared/shared.module';
declare var jQuery:any;
@Component({
    selector: 'app-feedback-history',
    templateUrl: './feedback-history.component.html'
})
export class FeedbackHistoryComponent implements OnInit {
    
    public constructor(public  appService: AppService,public  feebackService: FeedbackService) {

    }
    public getFeedbacks(){
        this.feebackService.getFeedbackHistory(this.search_text,this.pageNumber, this.itemsPerPage).subscribe(result=>{
            this.feedbacks = result.feedbacks;
            this.totalItems = result.total_items;
        },error=>{this.appService.showPNotify('failure', "Server Error! Can't get feedbacks", 'error');});
    }
    public ngOnInit() {
        this.getFeedbacks();
    }
    public feedbacks =[];

    public search_text = '';
    public selected_feedback;
    public feedback_title = '';
    public feedback_content = '';
    public feedback_from = '';
    public feedback_id: number;
    public pageNumber: number = 1;
    public limit: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;
    public onPageChanged(event: any) {
        this.pageNumber = event.page;
        this.getFeedbacks();
    }
    public onClickFeedback(index){
        this.selected_feedback = index;
        this.feedback_content = this.feedbacks[index].content;
        this.feedback_title = this.feedbacks[index].title;
        jQuery('#feedbackDetailModal').modal('show');
    }
    public onSearchChange(){
        if(this.search_text.length > 3 || this.search_text.length == 0){
            this.getFeedbacks();
        }
    }
}
