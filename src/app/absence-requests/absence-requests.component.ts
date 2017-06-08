import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService , AbsenceRequestService} from '../shared/shared.module';
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
    }

    public ngOnInit(): void {
    }

}
