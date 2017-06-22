import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService, AttendanceService, AuthService, CheckAttendanceSocketService, AppConfig, CheckAttendanceService } from '../shared/shared.module';
import { LocalStorageService } from 'angular-2-local-storage';
declare var jQuery:any;
@Component({
    selector: 'app-check-attendance',
    templateUrl: './check-attendance.component.html'
})
export class CheckAttendanceComponent implements OnInit {
    stopped_modal_message;
    constructor(private checkAttendanceService : CheckAttendanceService,private appConfig: AppConfig,private checkAttendanceSocketService: CheckAttendanceSocketService ,private authService: AuthService, private attendanceService: AttendanceService, private localStorage: LocalStorageService, private appService: AppService, private router: Router) {
        checkAttendanceSocketService.consumeEventOnCheckAttendanceUpdated();
        checkAttendanceSocketService.invokeCheckAttendanceUpdated.subscribe(result=>{
            this.getOpeningAttendance();
        });
        checkAttendanceSocketService.consumeEventOnCheckAttendanceCreated();
        checkAttendanceSocketService.invokeCheckAttendanceCreated.subscribe(result=>{
            this.getOpeningAttendance();
        });
        checkAttendanceSocketService.consumeEventOnCheckAttendanceStopped();
        checkAttendanceSocketService.invokeCheckAttendanceStopped.subscribe(result=>{
            this.stopped_modal_message = "Session is " + result;
            jQuery('#sessionStoppedModal').modal({backdrop: 'static', keyboard: false}) ;
        });
    }

    apiResult;
    apiResultMessage;

    selected_course_id;
    selected_class_id;
    selected_number_of_sessions;

    opening_attendances = [];
    selected_attendance = {};
    selected_attendance_id = 0;

    check_attendance_list: Array < any > = [];

    public getCheckAttendanceList() {
        this.selected_class_id = this.selected_attendance['class_id'];
        this.selected_course_id = this.selected_attendance['course_id'];
        this.attendanceService.getCheckAttendanceList(this.selected_course_id,this.selected_class_id).subscribe(result => {
            this.apiResult = result.result;
            this.check_attendance_list = result.check_attendance_list;
        }, error => { this.appService.showPNotify('failure',"Server Error! Can't get check_attendance_list",'error'); });
    }
    ngOnInit() {
        this.attendanceService.getOpeningAttendanceCourse(this.authService.current_user.id)
            .subscribe(result => {
                this.opening_attendances = result.opening_attendances;
                this.selected_course_id = this.localStorage.get('check_attendance_course_id');
                this.selected_class_id = this.localStorage.get('check_attendance_class_id');
                this.localStorage.remove('check_attendance_course_id', 'check_attendance_class_id');

                if (this.opening_attendances.length == 0) {
                    if(this.selected_course_id && this.selected_class_id){
                        this.createAttendance();
                    }else{
                        this.router.navigate(['/dashboard']);
                        this.appService.showPNotify('info', "There are no opening attendance! Select one first", 'info');
                    }
                } else {
                    if (!this.selected_course_id) {
                        //show first opening
                        this.selected_attendance_id = this.opening_attendances[0].id;
                        this.selected_attendance = this.opening_attendances[0];
                        this.getCheckAttendanceList();
                    } else {
                        //check if new or not
                        var i;
                        for (i = 0; i < this.opening_attendances.length; i++) {
                            if (this.opening_attendances[i].course_id == this.selected_course_id && this.opening_attendances[i].class_id == this.selected_class_id) {
                                this.selected_attendance = this.opening_attendances[i];
                                this.selected_attendance_id = this.opening_attendances[i].id;
                                break;
                            }
                        }
                        if (i == this.opening_attendances.length) {
                            //new
                            this.createAttendance();
                        }
                        else{
                            this.getCheckAttendanceList();
                        }
                    }
                    setTimeout(()=>{
                        //
                    },1000);
                }
            }, error => { this.appService.showPNotify('failure', "Server Error! Can't get opening attendances", 'error'); });
    }

    getOpeningAttendance(){
        this.attendanceService.getOpeningAttendanceCourse(this.authService.current_user.id).subscribe(result => {
            this.opening_attendances = result.opening_attendances;
            for (var j = 0; j < this.opening_attendances.length; j++) {
                if (this.opening_attendances[j].course_id == this.selected_course_id && this.opening_attendances[j].class_id == this.selected_class_id) {
                    this.selected_attendance = this.opening_attendances[j];
                    this.selected_attendance_id = this.opening_attendances[j].id;
                    break;
                }
            }
            this.getCheckAttendanceList();
        }, error => { this.appService.showPNotify('failure', "Server Error! Can't get opening attendances", 'error'); });
    }
    createAttendance(){
        this.attendanceService.createAttendance(this.selected_course_id, this.selected_class_id, this.authService.current_user.id)
            .subscribe(result => {
                this.getOpeningAttendance();
                this.checkAttendanceSocketService.emitEventOnCheckAttendanceCreated(null);
            }, error => { this.appService.showPNotify('failure', "Server Error! Can't create new attendances", 'error'); });
    }
    onChangeAttendance() {
        for (var j = 0; j < this.opening_attendances.length; j++) {
            if (this.opening_attendances[j].id == this.selected_attendance_id) {
                this.selected_attendance = this.opening_attendances[j];
                break;
            }
        }
        this.getCheckAttendanceList();
    }

    onCancelAttendanceSession(){
        jQuery('#confirmCancelModal').modal('show');
    }
    onCloseAttendanceSession(){
        jQuery('#confirmEndModal').modal('show');
    }
    confirmCancelAttendanceSession(){
        this.attendanceService.cancelAttendance(this.selected_attendance['id']).subscribe(result=>{
            this.checkAttendanceSocketService.emitEventOnCheckAttendanceStopped('cancelled by ' + this.authService.current_user.first_name + ' ' + this.authService.current_user.last_name);
            this.router.navigate(['/dashboard']);
        },error=>{this.appService.showPNotify('failure', "Server Error! Can't cancel attendance session", 'error');});
    }
    confirmCloseAttendanceSession(){
        this.attendanceService.closeAttendance(this.selected_attendance['id']).subscribe(result=>{
            this.checkAttendanceSocketService.emitEventOnCheckAttendanceStopped('closed by ' + this.authService.current_user.first_name + ' ' + this.authService.current_user.last_name);
            this.router.navigate(['/dashboard']);
        },error=>{this.appService.showPNotify('failure', "Server Error! Can't close attendance session", 'error');});
    }
    showQRCode(){
        var check_attendance_url = this.appConfig.apiHost + "/check-attendance/qr-code/" + this.selected_attendance_id;
        this.localStorage.set('qrCodeData',check_attendance_url);
        window.open(this.appConfig.host + '/qr-code', '_blank', 'height=300,width=300,scrollbars=yes,status=0,toolbar=0,menubar=0,location=0');
    }

    onAttendanceCheckClick(student_index: number, attendance_detail_index: number) {
        var type;
        if (this.check_attendance_list[student_index].attendance_details[attendance_detail_index].attendance_type) {
            type = 0;
        } else {
            type = 1;
        }
        this.checkAttendanceService.checkList(this.check_attendance_list[student_index].attendance_details[attendance_detail_index].attendance_id,this.check_attendance_list[student_index].id,type).subscribe(result=>{
            this.check_attendance_list[student_index].attendance_details[attendance_detail_index].attendance_type = type;
            this.checkAttendanceSocketService.emitEventOnCheckAttendanceUpdated(null);
        },error=>{this.appService.showPNotify('failure',"Server Error! Can't check_list",'error');});
    }
}
