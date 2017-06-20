import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService, AbsenceRequestService, AuthService, CreateAbsenceRequestModalComponent } from '../../shared/shared.module';
declare var jQuery: any;
@Component({
    selector: 'app-absence-requests-student',
    templateUrl: './absence-requests-student.component.html'
})
export class AbsenceRequestsStudentComponent implements OnInit {

    public constructor(private router: Router, private absenceRequestService: AbsenceRequestService, private appService: AppService, private authService: AuthService) {}

    public ngOnInit(): void {
        this.getAbsenceRequests();
        this.absence_request_status.push(this.appService.absence_request_status.new);
        this.absence_request_status.push(this.appService.absence_request_status.accepted);
        this.absence_request_status.push(this.appService.absence_request_status.rejected);

        this.selectedStatus = this.appService.absence_request_status.new.id;
    }

    public apiResult: string;
    public apiResultMessage: string;
    absence_requests = [];
    selectedStatus;
    absence_request_status = [];
    search_text = '';
    getAbsenceRequests() {
        this.absenceRequestService.getRequestsByStudent(this.authService.current_user.id, this.selectedStatus, this.search_text).subscribe(result => {
            this.absence_requests = result.absence_requests;
        }, error => { console.log(error) });
    }
    onChangeStatus() {
        this.getAbsenceRequests();
    }
    current_request_id = 0;
    current_request_status = 0;
    confirm_modal_title = '';
    public onCancelRequest(id: number) {
        jQuery('#confirmModal').modal("show");
        this.confirm_modal_title = 'Cancel this request ?';
        this.current_request_id = id;
    }


    @ViewChild(CreateAbsenceRequestModalComponent)
    private createAbsenceRequestModal: CreateAbsenceRequestModalComponent;
    onCreateRequest() {
        this.createAbsenceRequestModal.onOpenModal();
    }
    onRequestCreated(result:string){
        if(result == 'success'){
            this.getAbsenceRequests();
        }
    }
    public confirmAction() {
        this.absenceRequestService.cancelAbsenceRequests(this.current_request_id)
            .subscribe(result => {
                this.apiResult = result.result;
                this.apiResultMessage = result.message;
                this.appService.showPNotify(this.apiResult, this.apiResultMessage, this.apiResult == 'success' ? 'success' : 'error');
                if (this.apiResult == 'success') {
                    jQuery('#confirmModal').modal("hide");
                    this.getAbsenceRequests();
                }
            }, error => { console.log(error) });
    }
    onSearchChange() {
        if (this.search_text.length > 3 || this.search_text.length == 0) {
            this.getAbsenceRequests();
        }
    }
}
