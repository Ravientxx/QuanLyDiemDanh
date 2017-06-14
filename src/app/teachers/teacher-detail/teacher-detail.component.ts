import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TeacherService, ResultMessageModalComponent, AppService } from '../../shared/shared.module';
@Component({
    selector: 'teacher-detail',
    templateUrl: './teacher-detail.component.html'
})
export class TeacherDetailComponent implements OnInit {
    teacher_id: number;
    public teaching_courses: Array < any > ;
    public teacher = {
        id: 0,
        first_name: '',
        last_name: '',
        class_name: '',
        status: 0,
        email: '',
        phone: '',
    };
    public constructor(private route: ActivatedRoute, private router: Router, private teacherService: TeacherService,private appService:AppService) {
        this.route.params.subscribe(params => { this.teacher_id = params['id'] });
        this.teacherService.getTeacherDetail(this.teacher_id)
            .subscribe(result => {
                this.teacher = result.teacher;
                this.teaching_courses = result.teaching_courses;
                this.editing_name = this.teacher.first_name + ' ' + this.teacher.last_name;
            }, err => { console.log(err) });
    }
    public ngOnInit(): void {
        
    }
    public onCellClick(id: any) {
        //this.appService.navigationData.current_teacher_id = id;
        this.router.navigate(['courses/',id]);
    }


    public apiResult: string;
    public apiResultMessage: string;
    @ViewChild(ResultMessageModalComponent)
    private resultMessageModal: ResultMessageModalComponent;

    isEditingTeacher = false;
    editing_phone;
    editing_mail;
    editing_name;
    onEditTeacher() {
        this.editing_name = this.teacher.first_name + ' ' + this.teacher.last_name;
        this.editing_mail = this.teacher.email;
        this.editing_phone = this.teacher.phone;
        this.isEditingTeacher = true;
    }
    onCancelEditTeacher() {
        this.isEditingTeacher = false;
    }
    onSaveEditTeacher() {
        this.teacherService.updateTeacher(this.teacher_id, this.editing_name, this.editing_mail, this.editing_phone)
            .subscribe(result => {
                this.apiResult = result.result;
                this.apiResultMessage = result.message;
                if (result.result == 'success') {
                    this.isEditingTeacher = false;
                    this.teacher.email = this.editing_mail;
                    this.teacher.phone = this.editing_phone;
                }
                //this.resultMessageModal.onOpenModal();
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }, error => { console.log(error) });
    }
}
