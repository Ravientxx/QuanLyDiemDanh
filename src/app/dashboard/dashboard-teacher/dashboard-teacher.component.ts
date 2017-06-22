import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {  AppService, AuthService , AttendanceService , SendFeedbackModalComponent, TeacherService, CourseService} from '../../shared/shared.module';
import { LocalStorageService } from 'angular-2-local-storage';
declare var jQuery:any;
@Component({
	selector: 'app-dashboard-teacher',
	templateUrl: './dashboard-teacher.component.html'
})
export class DashboardTeacherComponent implements OnInit {

	opening_attendances = [];

	constructor(private router: Router,private localStorage : LocalStorageService,private appService: AppService,private authService: AuthService,private attendanceService: AttendanceService, private teacherService: TeacherService,private courseService : CourseService) {
	}

	ngOnInit() {
		this.editing_name = this.authService.current_user.first_name + ' ' + this.authService.current_user.last_name;
		this.appService.getSemesterProgramClass().subscribe(results => {
            this.classes = results.classes;
            this.programs = results.programs;
            this.programs.unshift({id:0,name:"All programs"});
            this.selectedProgram = this.programs[0].id;
            this.onChangeProgram();
        }, error => {this.appService.showPNotify('failure',"Server Error! Can't get semester-program-class",'error');});
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
		this.teacherService.updateTeacher(this.authService.current_user.id, this.editing_name, this.editing_mail, this.editing_phone)
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
            }, error => { this.appService.showPNotify('failure',"Server Error! Can't update teacher",'error'); });
	}

    @ViewChild(SendFeedbackModalComponent)
    private sendFeedbackModal: SendFeedbackModalComponent;
    onSendFeedback() {
        this.sendFeedbackModal.onOpenModal();
    }
    onFeedbackSent(result:string){}


    search_text = '';
    programs: Array < any > = [];
    selectedProgram = 0;
    classes: Array < any > = [];
    filteredClasses: Array < any > ;
    selectedClass = 0;
    teaching_courses = [];
    getTeachingList(){
    	this.courseService.getTeachingCourses(this.authService.current_user.id,this.search_text,this.selectedProgram,this.selectedClass).subscribe(result=>{
    		this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if(this.apiResult == 'failure'){
            	this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }
    		this.teaching_courses = result.courses;

			this.attendanceService.getOpeningAttendanceCourse(this.authService.current_user.id)
			.subscribe(result=>{
				this.opening_attendances = result.opening_attendances;
				for(var i = 0 ; i < this.opening_attendances.length; i++){
					for(var j = 0 ; j < this.teaching_courses.length; j++){
						if(this.opening_attendances[i].course_id == this.teaching_courses[j].id &&
						 this.opening_attendances[i].class_id == this.teaching_courses[j].class_id){
							this.teaching_courses[j]['is_opening_attendance'] = true;
						}
					}
				}
			},error=>{this.appService.showPNotify('failure',"Server Error! Can't get opening attendances",'error');});
    	},error=>{this.appService.showPNotify('failure',"Server Error! Can't get teaching course",'error');});
    }
    onChangeProgram(){
    	this.filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.selectedProgram == 0 || this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClass = this.filteredClasses[0].id;
        this.getTeachingList();
    }
    onCourseClick(course_id: number){
    	this.router.navigate(['/courses/', course_id]);
    }

    selected_course = {};
    onCheckAttendance(event,course){
    	this.selected_course = course;
    	if(course.is_opening_attendance){
    		this.confirmAction();
    	}
    	else{
    		jQuery('#confirmModal').modal('show');
    	}
    }
    confirmAction(){
    	this.localStorage.set('check_attendance_course_id',this.selected_course['id']);
        this.localStorage.set('check_attendance_class_id',this.selected_course['class_id']);
    	this.router.navigate(['/check-attendance']);
    }
}

