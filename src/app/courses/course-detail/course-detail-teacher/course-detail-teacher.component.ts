import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AttendanceService, AppService, EditScheduleModalComponent, ScheduleService, ResultMessageModalComponent } from '../../../shared/shared.module';
declare let jQuery: any;
@Component({
    selector: 'course-detail-teacher',
    templateUrl: './course-detail-teacher.component.html'
})
export class CourseDetailTeacherComponent implements OnInit {
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
    public apiResult;
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
        }, error => { console.log(error) });
    }
    public ngOnInit(): void {
        this.route.params.subscribe(params => { this.course_id = params['id'] });
        //get course info
        this.courseService.getCourseDetail(this.course_id).subscribe(result => {
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if(this.apiResult == 'failure'){
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }
            this.course = result.course;
            this.lecturers = result.lecturers;
            this.TAs = result.TAs;
            this.class_has_course = result.class_has_course;
            //get list student
            this.getAttendanceList();
        }, error => { console.log(error); });
    }

    //Schedule
    @ViewChild(EditScheduleModalComponent)
    private editScheduleModal: EditScheduleModalComponent;

    public scheduleModal = {
        id: 'scheduleModal',
        title: 'Schedule'
    }
    public onOpenSchedule() {
        this.editScheduleModal.onOpenModal();
    }

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
    onCheckAttendance() {
        
    }
}
