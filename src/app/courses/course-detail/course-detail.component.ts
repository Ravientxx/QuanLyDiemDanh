import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AttendanceService, ScheduleService, AppService } from '../../shared/shared.module';
declare let jQuery: any;
@Component({
    selector: 'course-detail',
    templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {

    public searchText: string = '';
    public filtered_attendance_list: Array < any > = [];
    public pageNumber: number = 1;
    public limit: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;
    public sort = 'none' //['none', 'asc', 'dsc'];
    public sort_tag = '';
    public schedule = '';

    course_id: any;
    course: Array < any > = [];
    lecturers: Array < any > = [];
    TAs: Array < any > = [];
    class_has_course: Array < any > = [];
    attendance_list: Array < any > = [];

    public apiCallResult: string;
    public error_message: any;
    public success_message: any;

    public constructor(private route: ActivatedRoute, private router: Router, private courseService: CourseService, private attendanceSerivce: AttendanceService,private scheduleService: ScheduleService) {}

    public getAttendanceList() {
        this.attendanceSerivce.getAttendanceListByCourse(this.searchText, this.pageNumber, this.itemsPerPage, this.sort, this.sort_tag, this.course_id).subscribe(result => {
            this.apiCallResult = result.result;
            this.attendance_list = result.attendance_list;
            this.totalItems = result.total_items;
            this.filtered_attendance_list = this.attendance_list.slice();
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
        this.initSessions();
        this.route.params.subscribe(params => { this.course_id = params['id'] });
        //get course info
        this.courseService.getCourseDetail(this.course_id).subscribe(result => {
            this.course = result.course;
            this.lecturers = result.lecturers;
            this.TAs = result.TAs;
            this.class_has_course = result.class_has_course;

            //load schedule
            this.onChangeClassSchedule(this.class_has_course[0]);
            //get list student
            this.getAttendanceList();
        }, error => { console.log(error) });
    }

    public onEditCourse(){
        this.router.navigate(['/courses/', this.course_id,'edit']);
    }
    public editingCellIndex: number = -1;
    public temp_room: string = '';
    public temp_type: string = '';
    public temp_sessions = [];
    public sessions = [];
    public current_class_id: number;
    public initSessions(){
        this.sessions = [
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        { room: '', type: 'LT', class: '' },
        ];
    }
    public onOpenSchedule() {
        jQuery("#scheduleModal").modal("show");
    }
    public onChangeClassSchedule(_class : any) {
        this.current_class_id = _class.class_id;
        this.initSessions();
        var session = _class.schedules.split(';');
        for (var j = 0; j < session.length; j++) {
            var temp = session[j].split('-');
            var index = temp[0];
            var room = temp[1];
            var type = temp[2];
            this.sessions[index].room = room;
            this.sessions[index].type = type;
        }
    }
    public onCancelSchedule() {
        this.temp_sessions = [];
        jQuery("#scheduleModal").modal("hide");
    }
    public onSaveSchedule() {
        this.sessions = this.temp_sessions.slice();
        this.temp_sessions = [];
        this.schedule = '';
        for(var i = 0; i < this.sessions.length ; i++){
            if(this.sessions[i].room != ''){
                this.schedule += i + '-' + this.sessions[i].room + '-' + this.sessions[i].type + ';';
            }
        }
        this.schedule = this.schedule.substr(0,this.schedule.length-1);

        //Update schedule

        jQuery("#scheduleModal").modal("hide");
    }
    public onScheduleCellClick(index : number){
        console.log(index);
        this.editingCellIndex = index;
        this.temp_room = this.sessions[index].room;
        this.temp_type = this.sessions[index].type;
    }
    public onCancelScheduleCell(){
        this.editingCellIndex = -1;
    }
    public onRemoveScheduleCell(){
        this.sessions[this.editingCellIndex].room = '';
        this.sessions[this.editingCellIndex].type = 'LT';
        this.editingCellIndex = -1;
    }
    public onUpdateScheduleCell(){
        this.sessions[this.editingCellIndex].room = this.temp_room;
        this.sessions[this.editingCellIndex].type = this.temp_type;
        this.editingCellIndex = -1;
    }

    //Add student to courses
    public programs: Array < any > = [];
    public selectedProgram: any;
    public classes: Array < any > ;
    public filteredClasses: Array < any > ;
    public selectedClass: any;
    
    public onChangeProgram() {
        this.filteredClasses = [{ id: 0, name: 'Choose class' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClass = this.filteredClasses[0].id;
    }

    public searchStudentToAdd: string = '';
    public teachers: Array < any > = [];
    public filtered_teachers: Array < any > = [];
    public selected_lecturers: Array < any > = [];
    public temp_lecturers: Array < any > = [];

    public onSelectStudent(id : number){

    }
    public onDeselectStudent(id : number){

    }
    public onSaveAddStudentToCourse(){

    }
    public onCancelAddStudentToCourse(){

    }
}
