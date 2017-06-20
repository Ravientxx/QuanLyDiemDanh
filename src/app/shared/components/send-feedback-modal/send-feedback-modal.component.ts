import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { AppService } from '../../services/app.service';
declare var jQuery: any;

@Component({
  selector: 'send-feedback-modal',
  templateUrl: './send-feedback-modal.component.html',
})
export class SendFeedbackModalComponent implements OnInit {
	@Output() onSent : EventEmitter<string> = new EventEmitter<string>();

    isAnonymous = false;
    title = '';
    content = '';

    public apiResult: string;
    public apiResultMessage: string;
    public onOpenModal() {
        jQuery("#sendFeedbackModal").modal("show");
    }
    onSendFeedback() {
        this.feedbackService.sendFeedbacks(this.title, this.content, this.isAnonymous).subscribe(result => {
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            this.appService.showPNotify(this.apiResult, this.apiResultMessage, this.apiResult == 'success' ? 'success' : 'error');
            if (this.apiResult == 'success') {
                this.isAnonymous = false;
                this.title = '';
                this.content = '';
                jQuery("#sendFeedbackModal").modal("hide");
                this.onSent.emit('success');
            }
        }, error => { console.log(error) });
    }
	constructor(private feedbackService : FeedbackService,private appService: AppService) { }
	ngOnInit() {
	}

}