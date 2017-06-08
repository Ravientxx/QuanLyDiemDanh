import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TeacherService, CourseService, AppService } from '../../shared/shared.module';
declare let jQuery: any;


@Component({
    selector: 'edit-course',
    templateUrl: './edit-course.component.html'
})
export class EditCourseComponent implements OnInit {
    @Input() type: string;
    course_id: any;
    course = {
        code : '',
        name: '',
        note: '',
        office_hour: ''
    };
    lecturers: Array < any > = [];
    TAs: Array < any > = [];
    public constructor(private route: ActivatedRoute,private router: Router, private appService: AppService, private courseService: CourseService, private teacherService: TeacherService) {

    }
    public ngOnInit(): void {
        this.teacherService.getListTeachers(this.searchText, 1, 9999)
            .subscribe(result => {
                this.teachers = result.teacher_list;
            }, error => { console.log(error) });
        this.route.params.subscribe(params => {this.course_id = params['id'] });
        this.courseService.getCourseDetail(this.course_id).subscribe(result => {
            this.course = result.course;
            this.lecturers = result.lecturers;
            this.TAs = result.TAs;
            for(var i = 0 ; i < this.lecturers.length; i++){
                for(var j = 0 ;j < this.teachers.length; j++){
                    if(this.lecturers[i].id == this.teachers[j].id){
                        this.teachers.splice(j,1);
                    }
                }
            }
            for(var i = 0 ; i < this.TAs.length; i++){
                for(var j = 0 ;j < this.teachers.length; j++){
                    if(this.TAs[i].id == this.teachers[j].id){
                        this.teachers.splice(j,1);
                    }
                }
            }
            this.filtered_teachers = this.teachers.slice();
        }, error => { console.log(error) });
    }

    public searchText: string = '';
    public teachers: Array < any > = [];
    public filtered_teachers: Array < any > = [];
    public temp_lecturers: Array < any > = [];
    public temp_TAs: Array < any > = [];

    public apiCallResult: string;
    public error_message: any;
    public success_message: any;

    public onCancelEditCourse() {
        this.router.navigate(['/courses/']);
    }

    public onSaveCourse(isContinue: boolean = false) {
        jQuery("#progressModal").modal("show");
        this.error_message = "";
        this.courseService.editCourse(this.course_id,this.course.code, this.course.name, this.lecturers, this.TAs, this.course.office_hour, this.course.note)
            .subscribe(result => {
                this.apiCallResult = result.result;
                if (this.apiCallResult == 'failure') {
                    this.error_message = result.message;
                }
                if (this.apiCallResult == 'success') {
                    this.success_message = result.message + '...Redirecting';
                        setTimeout(() => {
                            this.router.navigate(['/courses/']);
                        }, 3000);
                }
                jQuery("#progressModal").modal("hide");
            }, error => {
                this.error_message = 'Server Error';
                console.log(error);
                jQuery("#progressModal").modal("hide");
            });
    }

    public searchList() {
        console.log('searchText');
        this.filtered_teachers = [];
        for (var i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].first_name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0 || this.teachers[i].last_name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
                this.filtered_teachers.push(this.teachers[i]);
            }
        }
    }
    public onSelectLecturerClick(id: any) {
        for (var i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].id == id) {
                this.temp_lecturers.push(this.teachers[i]);
                this.teachers.splice(i, 1);
                this.searchList();
                break;
            }
        }
    }
    public onRemoveLecturerClick(id: any) {
        for (var i = 0; i < this.temp_lecturers.length; i++) {
            if (this.temp_lecturers[i].id == id) {
                this.teachers.push(this.temp_lecturers[i]);
                this.searchList();
                this.temp_lecturers.splice(i, 1);
                break;
            }
        }
    }
    public onOpenChooseLecturer() {
        this.temp_lecturers = [];
        this.temp_lecturers = this.lecturers.slice();
        jQuery("#chooseLecturerModal").modal("show");
    }
    public onCancelChooseLecturer() {
        for (var i = 0; i < this.temp_lecturers.length; i++) {
            this.teachers.push(this.temp_lecturers[i]);
            this.searchList();
            this.temp_lecturers.splice(i, 1);
            break;
        }
        this.filtered_teachers = this.teachers.slice();
        this.temp_lecturers = [];
        jQuery("#chooseLecturerModal").modal("hide");
    }
    public onSaveChooseLecturer() {
        this.lecturers = this.temp_lecturers.slice();
        this.temp_lecturers = [];
        this.filtered_teachers = this.teachers.slice();
        jQuery("#chooseLecturerModal").modal("hide");
    }


    public onSelectTAClick(id: any) {
        for (var i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].id == id) {
                this.temp_TAs.push(this.teachers[i]);
                this.teachers.splice(i, 1);
                this.searchList();
                break;
            }
        }
    }
    public onRemoveTAClick(id: any) {
        for (var i = 0; i < this.temp_TAs.length; i++) {
            if (this.temp_TAs[i].id == id) {
                this.teachers.push(this.temp_TAs[i]);
                this.searchList();
                this.temp_TAs.splice(i, 1);
                break;
            }
        }
    }
    public onOpenChooseTA() {
        this.temp_TAs = [];
        this.temp_TAs = this.TAs.slice();
        jQuery("#chooseTAModal").modal("show");
    }
    public onCancelChooseTA() {
        this.temp_lecturers = [];
        for (var i = 0; i < this.temp_TAs.length; i++) {
            this.teachers.push(this.temp_TAs[i]);
            this.searchList();
            this.temp_TAs.splice(i, 1);
        }
        this.filtered_teachers = this.teachers.slice();
        jQuery("#chooseTAModal").modal("hide");
    }
    public onSaveChooseTA() {
        this.filtered_teachers = this.teachers.slice();
        this.TAs = this.temp_TAs.slice();
        this.temp_TAs = [];
        jQuery("#chooseTAModal").modal("hide");
    }
}
