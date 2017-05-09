import { Component, OnInit } from '@angular/core';
import { ScheduleUploadResult } from './schedule-upload/schedule-upload.component';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styles: ['td, #study_time { white-space:pre-wrap; word-wrap:break-word }']
})
export class ScheduleComponent implements OnInit {

    public isCollapsed = true;
    public collapsed(event: any): void {
        console.log(event);
    }

    public expanded(event: any): void {
        console.log(event);
    }
    constructor() {}
    public shift1: Array < any > = [];
    public shift2: Array < any > = [];
    public shift3: Array < any > = [];
    public shift4: Array < any > = [];
    public study_time: string;
    public courses: Array < any > = [];
    public semesters: Array < any > = [{
        'value': 0,
        'label': 'All Semesters'
    }, {
        'value': 1,
        'label': 'HK1 2016-2017'
    }, {
        'value': 2,
        'label': 'HK2 2016-2017'
    }, {
        'value': 3,
        'label': 'HK3 2016-2017'
    }, ];
    public selectedSemester = this.semesters[0];
    ngOnInit() {}
    public xlsxUploaded(result: ScheduleUploadResult) {
        if (result[0] !== undefined) {
            this.shift1 = result[0].shift1;
            this.shift2 = result[0].shift2;
            this.shift3 = result[0].shift3;
            this.shift4 = result[0].shift4;
            this.study_time = result[0].studytime;
            this.courses = result[0].courses;
        } else {
            console.log(result.error);
        }
    }
}
