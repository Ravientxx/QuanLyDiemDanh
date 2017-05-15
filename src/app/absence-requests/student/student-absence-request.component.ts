import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { StudentAbsenceRequest } from './student-absence-request.model';
import { AbsenceRequestService } from '../absence-request.service';

@Component({
    selector: 'student-absence-request',
    templateUrl: './student-absence-request.component.html',
})
export class StudentAbsenceRequestComponent implements OnInit {
    public selectedRequest: StudentAbsenceRequest;
    public confirm_modal_title: string;
    public newRequests: StudentAbsenceRequest[];
    public action: any;
    public acceptedRequests: StudentAbsenceRequest[];
    public serverResponse;

    public constructor(private router: Router, private AbsenceRequestService: AbsenceRequestService) {}

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
                    .subscribe(requests => { this.serverResponse = requests;
                            this.loadRequests(); },
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
