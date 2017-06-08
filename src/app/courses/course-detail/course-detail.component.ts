import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AttendanceService, AppService, EditScheduleModalComponent, ScheduleService } from '../../shared/shared.module';
declare let jQuery: any;
@Component({
    selector: 'course-detail',
    templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {

    public searchText: string = '';
    public pageNumber: number = 1;
    public limit: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;
    public sort = 'none' //['none', 'asc', 'dsc'];
    public sort_tag = '';
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
    attendance_list: Array < any > = [];

    public apiCallResult: string;
    public error_message: any;
    public success_message: any;

    public constructor(private route: ActivatedRoute, private router: Router, private courseService: CourseService, private attendanceSerivce: AttendanceService, private scheduleService: ScheduleService) {}

    public getAttendanceList() {
        this.attendanceSerivce.getAttendanceListByCourse(this.searchText, this.pageNumber, 9999, this.sort, this.sort_tag, this.course_id).subscribe(result => {
            this.apiCallResult = result.result;
            this.attendance_list = result.attendance_list;
            this.totalItems = result.total_items;
            this.cloneAttendanceList(true);
        }, error => { console.log(error) });
    }

    public onSearchChange() {
        this.getAttendanceList();
    }
    public onPageChanged(event: any) {
        this.pageNumber = event.page;
        this.getAttendanceList();
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
        }, error => { console.log(error) });
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
            this.apiCallResult = result.result;
            if (this.apiCallResult == 'failure') {
                this.error_message = result.message;
            }
            if (this.apiCallResult == 'success') {
                this.success_message = result.message;
            }
        }, error => { console.log(error) });
    }
    public onOpenSchedule() {
        this.editScheduleModal.onOpenModal();
    }

    isEdittingAttendance = false;
    temp_attendance_list: Array < any > = [];
    cloneAttendanceList(isTempDes: boolean) {
        if (isTempDes) {
            this.temp_attendance_list = [];
            for (var i = 0; i < this.attendance_list.length; i++) {
                var attendance = {
                    id: this.attendance_list[i].id,
                    code: this.attendance_list[i].code,
                    name: this.attendance_list[i].name,
                    attendance_details: []
                };
                for (var j = 0; j < this.attendance_list[i].attendance_details.length; j++) {
                    var attendance_detail = {
                        attendance_id: this.attendance_list[i].attendance_details[j].attendance_id,
                        attendance_type: this.attendance_list[i].attendance_details[j].attendance_type,
                        attendance_time: this.attendance_list[i].attendance_details[j].attendance_time,
                    };
                    attendance.attendance_details.push(attendance_detail);
                }
                this.temp_attendance_list.push(attendance);
            }
        } else {
            this.attendance_list = [];
            for (var i = 0; i < this.temp_attendance_list.length; i++) {
                var attendance = {
                    id: this.temp_attendance_list[i].id,
                    code: this.temp_attendance_list[i].code,
                    name: this.temp_attendance_list[i].name,
                    attendance_details: []
                };
                for (var j = 0; j < this.temp_attendance_list[i].attendance_details.length; j++) {
                    var attendance_detail = {
                        attendance_id: this.temp_attendance_list[i].attendance_details[j].attendance_id,
                        attendance_type: this.temp_attendance_list[i].attendance_details[j].attendance_type,
                        attendance_time: this.temp_attendance_list[i].attendance_details[j].attendance_time,
                    };
                    attendance.attendance_details.push(attendance_detail);
                }
                this.attendance_list.push(attendance);
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
        this.cloneAttendanceList(false);
        this.isEdittingAttendance = false;
    }
    onAttendanceCheckClick(attendance_index: number, attendance_detail_index: number) {
        if (this.temp_attendance_list[attendance_index].attendance_details[attendance_detail_index].attendance_type) {
            this.temp_attendance_list[attendance_index].attendance_details[attendance_detail_index].attendance_type = 0;
        } else {
            this.temp_attendance_list[attendance_index].attendance_details[attendance_detail_index].attendance_type = 1;
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
                for (var j = 0; j < this.temp_attendance_list[0].attendance_details.length; j++) {
                    var attendance_detail = {
                        attendance_id: this.attendance_list[0].attendance_details[j].attendance_id,
                        attendance_type: 0,
                        attendance_time: '',
                    };
                    attendance.attendance_details.push(attendance_detail);
                }
                this.temp_attendance_list.push(attendance);
                this.new_name = '';
                this.new_code = '';
            }else{
                this.error_message = results.message;
            }
        },error => {console.log(error)});
    }
    deleting_attendance_index = 0;
    onRemoveAttendanceClick(index : number){
        jQuery('#confirmRemoveModal').modal('show');
        this.deleting_attendance_index = index;
    }
    confirmRemoveAttendance(){
        for(var i = this.deleting_attendance_index; i < this.temp_attendance_list.length-1; i++){
            this.temp_attendance_list[i].id = this.temp_attendance_list[i+1].id;
            this.temp_attendance_list[i].code = this.temp_attendance_list[i+1].code;
            this.temp_attendance_list[i].name = this.temp_attendance_list[i+1].name;
            for(var j = 0 ;j < this.temp_attendance_list[i].attendance_details.length; j++){
                this.temp_attendance_list[i].attendance_details[j].attendance_id =  this.temp_attendance_list[i+1].attendance_details[j].attendance_id;
                this.temp_attendance_list[i].attendance_details[j].attendance_type =  this.temp_attendance_list[i+1].attendance_details[j].attendance_type;
                this.temp_attendance_list[i].attendance_details[j].attendance_time =  this.temp_attendance_list[i+1].attendance_details[j].attendance_time;
            }
        }
        this.temp_attendance_list.pop();
    }
}
