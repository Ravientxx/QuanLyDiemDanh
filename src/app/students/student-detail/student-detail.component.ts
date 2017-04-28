import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'students-detail',
    templateUrl: './student-detail.component.html'
})
export class StudentDetailComponent implements OnInit {

    student_id : string;

    public constructor(private route: ActivatedRoute,private router : Router) {
        
    }



    public ngOnInit(): void {
        this.route.params.subscribe(params => {this.student_id = params['id']});
        //get Student from database
        console.log(this.student_id);
    }
}
