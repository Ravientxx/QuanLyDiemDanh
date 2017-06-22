import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AttendanceService, AppService, EditScheduleModalComponent, ScheduleService, ResultMessageModalComponent } from '../../../shared/shared.module';
declare let jQuery: any;
@Component({
    selector: 'course-detail-staff',
    templateUrl: './course-detail-staff.component.html'
})
export class CourseDetailStaffComponent implements OnInit {
    public schedules = [];

    course_id: any;
    course: Array < any > = [];
    lecturers: Array < any > = [];
    TAs: Array < any > = [];
    class_has_course: Array < any > = [{
        classId: 0,
        class_name: '',
        schedule: '',
        isAddStudentFromCLass: true,
        addStudentFromFile: '',
        studentListFromFile: [],
    }];
    attendance_lists: Array < any > = [];
    attendance_list: Array < any > = [];
    public apiResult: string;
    public apiResultMessage: string;
    @ViewChild(ResultMessageModalComponent)
    private resultMessageModal: ResultMessageModalComponent;

    public constructor(private route: ActivatedRoute, private router: Router,private appService: AppService, private courseService: CourseService, private attendanceSerivce: AttendanceService, private scheduleService: ScheduleService) {}

    public getAttendanceList() {
        var classes_id : Array<number> = [];
        for(var i = 0 ; i < this.class_has_course.length; i++){
            classes_id.push(this.class_has_course[i].class_id);
        }
        this.attendanceSerivce.getAttendanceListByCourse(this.course_id,classes_id).subscribe(result => {
            this.apiResult = result.result;
            this.attendance_lists = result.attendance_lists;
            this.attendance_list = this.attendance_lists[0];
            this.cloneAttendanceList(true);
        }, error => { this.appService.showPNotify('failure',"Server Error! Can't get attendance_list",'error'); });
    }
    public ngOnInit(): void {
        this.route.params.subscribe(params => { this.course_id = params['id'] });
        //get course info
        this.courseService.getCourseDetail(this.course_id).subscribe(result => {
            this.course = result.course;
            this.lecturers = result.lecturers;
            this.TAs = result.TAs;
            this.class_has_course = result.class_has_course;
            //get list student
            this.getAttendanceList();
        }, error => { this.appService.showPNotify('failure',"Server Error! Can't get course detail",'error'); });
    }

    public onEditCourse() {
        this.router.navigate(['/courses/', this.course_id, 'edit']);
    }

    //Schedule
    @ViewChild(EditScheduleModalComponent)
    private editScheduleModal: EditScheduleModalComponent;

    public scheduleModal = {
        id: 'scheduleModal',
        title: 'Schedule'
    }
    public onSaveSchedule(schedule: Array < string > ) {
        //this.course.schedule = schedule;
        for (var i = 0; i < this.class_has_course.length; i++) {
            this.class_has_course[i].schedules = schedule[i];
        }
        this.scheduleService.updateSchedule(this.class_has_course).subscribe(result => {
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            //this.resultMessageModal.onOpenModal();
            this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
        }, error => { this.appService.showPNotify('failure',"Server Error! Can't save schedule",'error');});
    }
    public onOpenSchedule() {
        this.editScheduleModal.onOpenModal();
    }

    isEdittingAttendance = false;
    temp_attendance_lists: Array < any > = [];
    selected_class_index = 0;
    onChangeClass(i){
        this.selected_class_index = i;
        this.attendance_list = this.attendance_lists[i];
    }
    cloneAttendanceList(isTempDes: boolean) {
        if (isTempDes) {
            this.temp_attendance_lists = [];
            for(var k = 0 ; k < this.attendance_lists.length; k++){
                var temp_attendance_list = [];
                for (var i = 0; i < this.attendance_lists[k].length; i++) {
                    var attendance = {
                        id: this.attendance_lists[k][i].id,
                        code: this.attendance_lists[k][i].code,
                        name: this.attendance_lists[k][i].name,
                        attendance_details: []
                    };
                    for (var j = 0; j < this.attendance_lists[k][i].attendance_details.length; j++) {
                        var attendance_detail = {
                            attendance_id: this.attendance_lists[k][i].attendance_details[j].attendance_id,
                            attendance_type: this.attendance_lists[k][i].attendance_details[j].attendance_type,
                            attendance_time: this.attendance_lists[k][i].attendance_details[j].attendance_time,
                        };
                        attendance.attendance_details.push(attendance_detail);
                    }
                    temp_attendance_list.push(attendance);
                }
                this.temp_attendance_lists.push(temp_attendance_list);
            }
        } else {
            this.attendance_lists = [];
            for (var k = 0; k < this.temp_attendance_lists.length; k++) {
                var attendance_list = [];
                for (var i = 0; i < this.temp_attendance_lists[k].length; i++) {
                    var attendance = {
                        id: this.temp_attendance_lists[k][i].id,
                        code: this.temp_attendance_lists[k][i].code,
                        name: this.temp_attendance_lists[k][i].name,
                        attendance_details: []
                    };
                    for (var j = 0; j < this.temp_attendance_lists[k][i].attendance_details.length; j++) {
                        var attendance_detail = {
                            attendance_id: this.temp_attendance_lists[k][i].attendance_details[j].attendance_id,
                            attendance_type: this.temp_attendance_lists[k][i].attendance_details[j].attendance_type,
                            attendance_time: this.temp_attendance_lists[k][i].attendance_details[j].attendance_time,
                        };
                        attendance.attendance_details.push(attendance_detail);
                    }
                    attendance_list.push(attendance);
                }
                this.attendance_lists.push(attendance_list);
            }
        }
    }
    onEditAttendance() {
        this.isEdittingAttendance = true;
        this.cloneAttendanceList(true);
    }
    onCancelEditAttendance() {
        this.isEdittingAttendance = false;
    }
    onSaveEditAttendance() {
        var classes_id : Array<number> = [];
        for(var i = 0 ; i < this.class_has_course.length; i++){
            classes_id.push(this.class_has_course[i].class_id);
        }
        this.attendanceSerivce.updateAttendanceListByCourse(this.course_id,classes_id,this.temp_attendance_lists)
        .subscribe(results=>{
            if(results.result == 'success'){
                this.cloneAttendanceList(false);
                this.onChangeClass(this.selected_class_index);
                this.isEdittingAttendance = false;
            }else{

            }
            this.apiResult = results.result;
            this.apiResultMessage = results.message;
            //this.resultMessageModal.onOpenModal();
            this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
        },error=>{this.appService.showPNotify('failure',"Server Error! Can't get save attendance",'error');});
    }
    onAttendanceCheckClick(attendance_index: number, attendance_detail_index: number) {
        if (this.temp_attendance_lists[this.selected_class_index][attendance_index].attendance_details[attendance_detail_index].attendance_type) {
            this.temp_attendance_lists[this.selected_class_index][attendance_index].attendance_details[attendance_detail_index].attendance_type = 0;
        } else {
            this.temp_attendance_lists[this.selected_class_index][attendance_index].attendance_details[attendance_detail_index].attendance_type = 1;
            this.temp_attendance_lists[this.selected_class_index][attendance_index].attendance_details[attendance_detail_index].attendance_time = new Date();
        }
    }

    new_code: string = '';
    new_name: string = '';
    onAddToAttendanceList() {
        this.attendanceSerivce.checkAddToCourse(this.course_id,this.new_code,this.new_name).subscribe(results=>{
            if(results.result == 'success'){
                var attendance = {
                    id: 0,
                    code: this.new_code,
                    name: this.new_name,
                    attendance_details: []
                };
                for (var j = 0; j < this.temp_attendance_lists[this.selected_class_index][0].attendance_details.length; j++) {
                    var attendance_detail = {
                        attendance_id: this.attendance_lists[this.selected_class_index][0].attendance_details[j].attendance_id,
                        attendance_type: 0,
                        attendance_time: new Date(),
                    };
                    attendance.attendance_details.push(attendance_detail);
                }
                this.temp_attendance_lists[this.selected_class_index].push(attendance);
                this.new_name = '';
                this.new_code = '';
            }else{
                this.apiResult = results.result;
                this.apiResultMessage = results.message;
                //this.resultMessageModal.onOpenModal();
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }
        },error => {this.appService.showPNotify('failure',"Server Error! Can't check student",'error');});
    }
    deleting_attendance_index = 0;
    onRemoveAttendanceClick(index : number){
        jQuery('#confirmRemoveModal').modal('show');
        this.deleting_attendance_index = index;
    }
    confirmRemoveAttendance(){
        for(var i = this.deleting_attendance_index; i < this.temp_attendance_lists[this.selected_class_index].length-1; i++){
            this.temp_attendance_lists[this.selected_class_index][i].id = this.temp_attendance_lists[this.selected_class_index][i+1].id;
            this.temp_attendance_lists[this.selected_class_index][i].code = this.temp_attendance_lists[this.selected_class_index][i+1].code;
            this.temp_attendance_lists[this.selected_class_index][i].name = this.temp_attendance_lists[this.selected_class_index][i+1].name;
            for(var j = 0 ;j < this.temp_attendance_lists[this.selected_class_index][i].attendance_details.length; j++){
                this.temp_attendance_lists[this.selected_class_index][i].attendance_details[j].attendance_id =  this.temp_attendance_lists[this.selected_class_index][i+1].attendance_details[j].attendance_id;
                this.temp_attendance_lists[this.selected_class_index][i].attendance_details[j].attendance_type =  this.temp_attendance_lists[this.selected_class_index][i+1].attendance_details[j].attendance_type;
                this.temp_attendance_lists[this.selected_class_index][i].attendance_details[j].attendance_time =  this.temp_attendance_lists[this.selected_class_index][i+1].attendance_details[j].attendance_time;
            }
        }
        this.temp_attendance_lists[this.selected_class_index].pop();
    }
}
