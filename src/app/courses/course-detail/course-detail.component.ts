import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService,AppService, ResultMessageModalComponent } from '../../shared/shared.module';
declare let jQuery: any;
@Component({
    selector: 'course-detail',
    templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
   

    public constructor(private route: ActivatedRoute, private router: Router,private appService: AppService, private authService: AuthService) {}

    
    public ngOnInit(): void {
    }
}
