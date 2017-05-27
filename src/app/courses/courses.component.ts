import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, AppService } from '../shared/shared.module';


@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
    public isCollapsed = true;

    public apiCallResult: string;
    public error_message: any;
    public success_message: any;
    public sort_tag = ['none', 'asc', 'dsc'];
    public sort_index = 0;

    public semesters: Array < any > = [];
    public programs: Array < any > = [];
    public classes: Array < any > = [];
    public currentSemester: any = {};

    public current_courses: Array < any > = [];
    public selectedSemester: any;
    public selectedProgram: any;
    public filteredClasses: Array < any > ;
    public selectedClasses: any;
    public searchText: string;
    public pageNumber: number = 1;
    public limit: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;

    public previous_courses: Array < any > = [];
    public previous_selectedSemester: any;
    public previous_selectedProgram: any;
    public previous_filteredClasses: Array < any > ;
    public previous_selectedClasses: any;
    public previous_searchText: string;
    public previous_pageNumber: number = 1;
    public previous_limit: number = 15;
    public previous_currentPage: number = 1;
    public previous_totalItems: number = 0;
    public previous_itemsPerPage: number = 10;

    public newCourseName :string = ""; newCourseCode :string = ""; newCourseLecturer:string = "" ; newCourseTA:string = "";
    

    constructor(private appService: AppService, private courseService: CourseService, private router: Router) {}
    public getCurrentList() {
        this.courseService.getCurrentCourseLists(this.searchText, this.pageNumber, this.itemsPerPage, this.sort_tag[this.sort_index], this.selectedProgram, this.selectedClasses)
            .subscribe(result => {
                this.current_courses = result.courses;
                this.totalItems = result.total_items;
                this.apiCallResult = result.result;
            }, error => { console.log(error) });
    }

    public onChangeProgram() {
        this.filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClasses = this.filteredClasses[0].id;
        this.getCurrentList();
    }

    public onPageChanged(event: any) {
        this.pageNumber = event.page;
        this.getCurrentList();
    }

    public getPreviousList() {
        this.courseService.getPreviousCourseLists(this.previous_searchText, this.previous_pageNumber, this.previous_itemsPerPage, this.sort_tag[this.sort_index], this.previous_selectedProgram, this.previous_selectedClasses)
            .subscribe(result => {
                this.previous_courses = result.courses;
                this.previous_totalItems = result.total_items;
                this.apiCallResult = result.result;
            }, error => { console.log(error) });
    }

    public previous_onChangeProgram() {
        this.previous_filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.previous_selectedProgram) {
                this.previous_filteredClasses.push(this.classes[i]);
            }
        }
        this.previous_selectedClasses = this.previous_filteredClasses[0].id;
        this.getPreviousList();
    }

    public previous_onPageChanged(event: any) {
        this.previous_pageNumber = event.page;
        this.getPreviousList();
    }
    ngOnInit() {
        this.appService.getSemesterProgramClass().subscribe(results => {
            this.semesters = results.semesters;
            this.currentSemester = this.semesters[this.semesters.length - 1];
            this.classes = results.classes;
            this.programs = results.programs;
            this.selectedProgram = this.programs[this.programs.length - 1].id;
            this.onChangeProgram();
        }, error => { console.log(error) });
    }

    public onCellClick(id: any) {
        console.log(id);
        this.router.navigate(['/courses/', id]);
    }
    public onAddCourse() {
        this.router.navigate(['/courses/add']);
    }


    public collapsed(event: any): void {
        console.log(event);
    }

    public expanded(event: any): void {
        console.log(event);
        if(this.previous_courses.length == 0){
            this.previous_selectedProgram = this.programs[this.programs.length - 1].id;
            this.previous_onChangeProgram();
        }
    }
    // //public htmlContent: string = null;
    // public userType: number = null;

    // public role: object = null;

    // constructor(private appService: AppService) {
    //     switch (appService.current_userType){
    //         case globalVariable.userType.staff:
    //             this.htmlContent = '<staff-home-page></staff-home-page>';
    //             break;
    //         case globalVariable.userType.student:
    //             this.htmlContent = '<student-home-page></student-home-page>';
    //             break;
    //         case globalVariable.userType.teacher:
    //             this.htmlContent = '<teacher-home-page></teacher-home-page>';
    //             break;
    //     }

    //     this.userType = appService.current_userType;
    //     this.role = globalVariable.userType;
    // }

    // ngOnInit() {}
}
