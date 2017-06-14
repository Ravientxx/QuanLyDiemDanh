import { Component, OnInit } from '@angular/core';
import { ScheduleUploadResult } from './schedule-upload/schedule-upload.component';
import { ScheduleService, AppService, SemesterService } from '../shared/shared.module';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {

    public isCollapsed = true;
    public collapsed(event: any): void {

    }

    public expanded(event: any): void {

    }
    constructor(private scheduleService: ScheduleService, private appService: AppService, private router: Router, private semesterService: SemesterService) {}
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
        [],
    ];
    semester = {};
    public courses: Array < any > = [];

    public semesters: Array < any > = [];
    public selectedSemester: any;
    public programs: Array < any > = [];
    public selectedProgram: any;
    public classes: Array < any > ;
    public filteredClasses: Array < any > ;
    public selectedClass: any;

    public onChangeProgram() {
        this.filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClass = this.filteredClasses[0].id;
        this.getSchedulesAndCourses();
    }
    public onChangeSemester() {
        this.getSchedulesAndCourses();
        this.getSemesterInfo();
    }
    public onChangeClass() {
        this.getSchedulesAndCourses();
    }
    loadSchedules() {
        this.sessions = [
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
            [],
        ];
        for (var i = 0; i < this.courses.length; i++) {
            var schedules = this.courses[i].schedules.split(';');
            for (var j = 0; j < schedules.length; j++) {
                var temp = schedules[j].split('-');
                var index = temp[0];
                var course = {
                    code: this.courses[i].code,
                    class_name: this.courses[i].class_name,
                    room: temp[1],
                    type: temp[2],
                    color_class: this.courses[i].color_class
                };
                this.sessions[index].push(course);
            }
        }
    }
    getSchedulesAndCourses() {
        this.scheduleService.getSchedulesAndCourses(this.selectedProgram, this.selectedClass, this.selectedSemester)
            .subscribe(result => {
                this.courses = result.courses;
                for (var i = 0; i < this.courses.length; i++) {
                    for (var j = 0; j < this.filteredClasses.length; j++) {
                        if (this.courses[i].class_name == this.filteredClasses[j].name) {
                            this.courses[i]['color_class'] = 'class_color_' + j;
                            break;
                        }
                    }
                }
                this.loadSchedules();
            }, error => { console.log(error) });
    }
    getSemesterInfo() {
        this.semesterService.getSemester(this.selectedSemester)
            .subscribe(result => {
                this.semester = result.semester;
            }, error => { console.log(error) });
    }
    ngOnInit() {
        this.appService.getSemesterProgramClass().subscribe(results => {
            this.semesters = results.semesters;
            this.selectedSemester = this.semesters[this.semesters.length - 1].id;
            this.getSemesterInfo();
            this.classes = results.classes;
            this.programs = results.programs;
            this.selectedProgram = this.programs[0].id;
            this.onChangeProgram();
        }, error => { console.log(error) });
    }
    onCourseClick(course_id: number) {
        this.router.navigate(['/courses/', course_id]);
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
