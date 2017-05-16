import { Component, OnInit } from '@angular/core';
import { ScheduleUploadResult } from './schedule-upload/schedule-upload.component';
import { AppService } from '../app.service';
import { ScheduleService } from './schedule.service';
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
    constructor(private scheduleService: ScheduleService, private appService: AppService) {}
    public sessions = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ['abc','def']
    ];

    public study_time: string;
    public courses: Array < any > = [];

    public semesters: Array < any > = [];
    public selectedSemester: any;
    public programs: Array < any > = [];
    public selectedProgram: any;
    public classes: Array < any > ;
    public filteredClasses: Array < any > ;
    public selectedClasses: any;

    public onChangeProgram() {
        this.filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClasses = this.filteredClasses[0].id;
    }
    public onChangeSemester() {

    }
    public onChangeClass() {

    }
    ngOnInit() {
        this.appService.getSemesterProgramClass().subscribe(results => {
            this.semesters = results.semesters;
            this.selectedSemester = this.semesters[this.semesters.length - 1].id;
            this.classes = results.classes;
            this.programs = results.programs;
            this.selectedProgram = this.programs[0].id;
            this.onChangeProgram();
        }, error => { console.log(error) });
    }
    public xlsxUploaded(result: ScheduleUploadResult) {
        // if (result[0] !== undefined) {
        //     this.shift1 = result[0].shift1;
        //     this.shift2 = result[0].shift2;
        //     this.shift3 = result[0].shift3;
        //     this.shift4 = result[0].shift4;
        //     this.study_time = result[0].studytime;
        //     this.courses = result[0].courses;
        // } else {
        //     console.log(result.error);
        // }
    }
}
