import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../shared/shared.module';
import { AbsenceRequestService } from './absence-request.service';
@Component({
    selector: 'app-absence-requests',
    templateUrl: './absence-requests.component.html'
})
export class AbsenceRequestsComponent implements OnInit {
    public selectedRequest;
    public confirm_modal_title: string;
    public newRequests = [];
    public action: any;
    public acceptedRequests=[];
    public serverResponse;
    public userType: number = null;
    public role: object = null;

    public constructor(private router: Router, private AbsenceRequestService: AbsenceRequestService, private appService: AppService) {
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
        this.role = appService.userType;
    }

    public ngOnInit(): void {
        this.loadRequests();
    }
    public loadRequests() {
        this.AbsenceRequestService.getNewRequests()
            .subscribe(requests => this.newRequests = requests, err => { console.log(err) });
        this.AbsenceRequestService.getAcceptedRequests()
            .subscribe(requests => this.acceptedRequests = requests, err => { console.log(err) });
    }
    public clickRequest(request, action) {
        this.selectedRequest = request;
        let title: string;
        this.action = action;
        switch (action) {
            case "accept":
                title = "Accept Absence Request";
                break;
            case "reject":
                title = "Reject Absence Request";
                break;
            case "undo":
                title = "Undo Absence Request";
                break;
        }
        this.confirm_modal_title = title;
    }

    public confirmAction() {
        switch (this.action) {
            case "accept":
                this.AbsenceRequestService.acceptRequest(this.selectedRequest.id)
                    .subscribe(requests => {
                            this.serverResponse = requests;
                            this.loadRequests();
                        },
                        err => {
                            console.log(err)
                        });
                break;
            case "reject":
                break;
            case "undo":
                break;
        }
    }
}
