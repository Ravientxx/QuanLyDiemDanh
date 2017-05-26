import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StudentService, AppService } from '../../shared/shared.module';
declare var jQuery: any;
@Component({
    selector: 'students-detail',
    templateUrl: './student-detail.component.html'
})
export class StudentDetailComponent implements OnInit {

    student_id : number;

    public constructor(private route: ActivatedRoute,private router : Router, private studentService: StudentService) {
        
    }

    public student = {};
    public current_courses = [];

    public ngOnInit(): void {
        this.route.params.subscribe(params => {this.student_id = params['id']});
        //get Student from database
        this.studentService.getStudentrDetail(this.student_id).subscribe(result=>{
            this.student = result.student;
            this.current_courses = result.current_courses;
        },error => {console.log(error)});
    }
    public onCellClick(id: number){
        this.router.navigate(['/courses/', id]);
    }
}
