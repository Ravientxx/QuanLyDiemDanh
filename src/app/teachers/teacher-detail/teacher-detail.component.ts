import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TeacherService } from '../teachers.service';
import { Teacher } from '../teacher.model';

@Component({
    selector: 'teacher-detail',
    templateUrl: './teacher-detail.component.html'
})
export class TeacherDetailComponent implements OnInit {

    teacher_id: number;
    public teacher: Teacher = new Teacher(0, "", "", "", 0);
    public teaching_courses: Array < any > ;
    public constructor(private route: ActivatedRoute, private router: Router, private TeacherService: TeacherService) {

    }
    public ngOnInit(): void {
        this.route.params.subscribe(params => { this.teacher_id = params['id'] });
        this.TeacherService.getTeacherDetail(this.teacher_id)
            .subscribe(result => {
                this.teacher = result.teacher;
                this.teaching_courses = result.teaching_courses;
            }, err => { console.log(err) });
    }
}
