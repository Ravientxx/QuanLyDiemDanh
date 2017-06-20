import { Component, OnInit, ViewChild } from '@angular/core';
import {  AppService, AuthService , CreateAbsenceRequestModalComponent , SendFeedbackModalComponent, StudentService} from '../../shared/shared.module';

@Component({
	selector: 'app-dashboard-student',
	templateUrl: './dashboard-student.component.html'
})
export class DashboardStudentComponent implements OnInit {

	//public htmlContent: string = null;
	public userType: number = null;

	public role: object = null;

	constructor(private appService: AppService,private authService: AuthService, private studentService: StudentService) {
	}

	ngOnInit() {
		this.editing_name = this.authService.current_user.first_name + ' ' + this.authService.current_user.last_name;
	}

	isEditingProfile = false;
	editing_name = '';
	editing_phone = '';
	editing_mail = '';

	apiResult;
	apiResultMessage;
	onEditProfile(){
		this.isEditingProfile = true;
		this.editing_name = this.authService.current_user.first_name + ' ' + this.authService.current_user.last_name;
		this.editing_mail = this.authService.current_user.email;
		this.editing_phone = this.authService.current_user.phone;
	}
	onCancelEditProfile(){
		this.isEditingProfile = false;
	}
	onSaveEditProfile(){
		this.studentService.updateStudent(this.authService.current_user.id, this.editing_name, this.editing_mail, this.editing_phone,null)
            .subscribe(result => {
                this.apiResult = result.result;
                this.apiResultMessage = result.message;
                if (result.result == 'success') {
                    this.isEditingProfile = false;
                    this.authService.current_user.email = this.editing_mail;
                    this.authService.current_user.phone = this.editing_phone;
                }
                //this.resultMessageModal.onOpenModal();
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }, error => { console.log(error) });
	}

	@ViewChild(CreateAbsenceRequestModalComponent)
    private createAbsenceRequestModal: CreateAbsenceRequestModalComponent;
    onCreateAbsenceRequest() {
        this.createAbsenceRequestModal.onOpenModal();
    }
    onRequestCreated(result:string){}

    @ViewChild(SendFeedbackModalComponent)
    private sendFeedbackModal: SendFeedbackModalComponent;
    onSendFeedback() {
        this.sendFeedbackModal.onOpenModal();
    }
    onFeedbackSent(result:string){}
}

