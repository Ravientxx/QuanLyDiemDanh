import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService , AbsenceRequestService} from '../../shared/shared.module';
declare var jQuery: any;
@Component({
    selector: 'app-absence-requests-staff',
    templateUrl: './absence-requests-staff.component.html'
})
export class AbsenceRequestsStaffComponent implements OnInit {

    public constructor(private router: Router, private absenceRequestService: AbsenceRequestService, private appService: AppService) {
    }

    public ngOnInit(): void {
        this.getAbsenceRequests();
        this.absence_request_status.push(this.appService.absence_request_status.new);
        this.absence_request_status.push(this.appService.absence_request_status.accepted);
        this.absence_request_status.push(this.appService.absence_request_status.rejected);

        this.selectedStatus = this.appService.absence_request_status.new.id;
    }

    absence_requests = [];
    selectedStatus;
    absence_request_status = [];
    search_text = '';
    getAbsenceRequests(){
        this.absenceRequestService.getAbsenceRequests(this.selectedStatus,this.search_text).subscribe(result=>{
            this.absence_requests = result.absence_requests;
        },error=>{console.log(error)});
    }
    onChangeStatus(){
        this.getAbsenceRequests();
    }
    current_request_id = 0;
    current_request_status = 0;
    confirm_modal_title = '';
    public onAcceptRequest(id: number) {
        jQuery('#confirmModal').modal("show");
        this.confirm_modal_title = 'Accept this request ?';
        this.current_request_id = id;
        this.current_request_status = this.appService.absence_request_status.accepted.id;
    }
    public onUndoRequest(id: number) {
        jQuery('#confirmModal').modal("show");
        this.confirm_modal_title = 'Undo this request ?';
        this.current_request_id = id;
        this.current_request_status = this.appService.absence_request_status.new.id;
    }
    public onRejectRequest(id: number) {
        jQuery('#confirmModal').modal("show");
        this.confirm_modal_title = 'Reject this request ?';
        this.current_request_id = id;
        this.current_request_status = this.appService.absence_request_status.rejected.id;
    }
    public confirmAction() {
        this.absenceRequestService.changeRequestStatus(this.current_request_id, this.current_request_status)
            .subscribe(result => {
                this.absenceRequestService.getAbsenceRequests(this.selectedStatus,this.search_text)
                    .subscribe(result => {
                        this.absence_requests = result.absence_requests;
                        jQuery('#confirmModal').modal("hide");
                    }, error => { console.log(error) });
            }, error => { console.log(error) });
    }
    onSearchChange(){
        if(this.search_text.length > 3 || this.search_text.length == 0){
            this.getAbsenceRequests();
        }
    }
}
