import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {

    public isCollapsed = true;
    constructor() {}

    ngOnInit() {}

    public collapsed(event: any): void {
        console.log(event);
    }

    public expanded(event: any): void {
        console.log(event);
    }
}
