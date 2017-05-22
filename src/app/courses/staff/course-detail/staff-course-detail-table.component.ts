import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService } from '../../courses.service';

@Component({
    selector: 'staff-course-detail-table',
    templateUrl: './staff-course-detail-table.component.html'
})
export class StaffCourseDetailTableComponent implements OnInit {

    course_id : any;
    course : Array<any> = [];
    lecturers : Array<any> = [];
    TAs : Array<any> = [];
    public constructor(private route: ActivatedRoute,private router : Router, private courseService: CourseService) {
        
    }

    public ngOnInit(): void {
        this.route.params.subscribe(params => {this.course_id = params['id']});
        this.courseService.getCourseDetail(this.course_id).subscribe(result => {
                this.course = result.course;
                this.lecturers = result.lecturers;
                this.TAs = result.TAs;
            }
            ,error => {console.log(error)});
        //get course from database
        console.log(this.course_id);
    }
}
