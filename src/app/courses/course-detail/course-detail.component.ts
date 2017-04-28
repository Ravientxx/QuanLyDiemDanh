import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'courses-detail',
    templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {

    course_id : string;

    public constructor(private route: ActivatedRoute,private router : Router) {
        
    }

    public ngOnInit(): void {
        this.route.params.subscribe(params => {this.course_id = params['id']});
        //get course from database
        console.log(this.course_id);
    }
}
