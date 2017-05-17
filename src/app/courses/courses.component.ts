import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';
import { CourseService } from './courses.service';
declare var jQuery:any;

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
    public semesters: Array < any > = [];
    public currentSemester : any ={};
    public selectedSemester: any;
    public programs: Array < any > = [];
    public selectedProgram: any;
    public classes: Array < any > ;
    public filteredClasses: Array < any > ;
    public selectedClasses: any;

    public isCollapsed = true;

    public searchText: string;
    public pageNumber: number = 1;
    public limit: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;
    public apiCallResult :string;
    public error_message : any;
    public success_message : any;

    constructor(private appService: AppService, private courseService: CourseService,private router:Router) {}

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
            this.currentSemester = this.semesters[this.semesters.length - 1];
            this.classes = results.classes;
            this.programs = results.programs;
            this.selectedProgram = this.programs[0].id;
            this.onChangeProgram();
        }, error => { console.log(error) });
    }

    public onSearchChange() {
    }

    public onPageChanged(event: any) {
        let page = event.page;
    }

    public onCellClick(id: any) {
        this.router.navigate(['/courses/',id]);
    }
    public onCancelAddTeacher(){
        // jQuery("#addTeacherModal").modal("hide");
        // this.newTeacherEmail = this.newTeacherName = this.newTeacherPhone = this.error_message = "";
    }
    public onAddTeacher(){
        // var error_check = false;
        // if(this.newTeacherName == ""){
        //     this.error_message = "Name is required";
        //     return;
        // }
        // if(this.newTeacherEmail == ""){
        //     this.error_message = "Email is required";
        //     return;
        // }
        // if(this.newTeacherEmail.indexOf('@') == -1){
        //     this.error_message = "Invalid Email";
        //     return;
        // }
        // if (isNaN(Number(this.newTeacherPhone))) {
        //     this.error_message = "Invalid Phone Number";
        //     return;
        // }
        // jQuery("#progressModal").modal("show");
        // this.error_message = "";
        // this.TeacherService.addTeacher(this.newTeacherName, this.newTeacherEmail, this.newTeacherPhone)
        //     .subscribe(list => {
        //         this.apiCallResult = list.result;
        //         if(this.apiCallResult == 'failure'){
        //             this.error_message = list.message;
        //         }
        //         if(this.apiCallResult == 'success'){
        //             this.success_message = list.message;
        //             this.newTeacherEmail = this.newTeacherName = this.newTeacherPhone = "";
        //             this.onSearchChange();
        //         }
        //         jQuery("#progressModal").modal("hide");
        //     }, err => { console.log(err) });
    }


    public collapsed(event: any): void {
        console.log(event);
    }

    public expanded(event: any): void {
        console.log(event);
    }
}
