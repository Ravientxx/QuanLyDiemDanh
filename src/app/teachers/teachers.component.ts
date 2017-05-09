import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Teacher } from './teacher.model';
import { TeacherService } from './teachers.service';
declare var jQuery:any;

@Component({
    selector: 'app-teachers',
    templateUrl: './teachers.component.html'
})
export class TeachersComponent implements OnInit {
    public teacher_list: Teacher[];
    public searchText: string;
    public pageNumber: number = 1;
    public limit: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;
    public apiCallResult :string;
    public newTeacherName :string = ""; newTeacherPhone:string = "" ; newTeacherEmail:string = "";

    public error : any;
    ngOnInit() {}

    constructor(private TeacherService: TeacherService, private router: Router) {
        this.TeacherService.getListTeachers()
            .subscribe(list => {
                this.teacher_list = list.teacher_list;
                this.totalItems = list.total_items;
            }, err => { console.log(err) });
    }

    public onSearchChange() {
        this.TeacherService.getListTeachers(this.searchText, 1, this.itemsPerPage)
            .subscribe(list => {
                this.teacher_list = list.teacher_list;
                this.totalItems = list.total_items;
            }, err => { console.log(err) });
    }

    public onPageChanged(event: any) {
        let page = event.page;
        this.TeacherService.getListTeachers(this.searchText, page, this.itemsPerPage)
            .subscribe(list => {
            	this.apiCallResult = list.result;
                this.teacher_list = list.teacher_list;
                this.totalItems = list.total_items;
            }, err => { console.log(err) });
    }
    public onCellClick(id: any) {
        this.router.navigate(['/teachers', id]);
    }
    public onCancelAddTeacher(){
    	jQuery("#addTeacherModal").modal("hide");
    	this.newTeacherEmail = this.newTeacherName = this.newTeacherPhone = this.error = "";
    }
    public onAddTeacher(){
    	var error_check = false;
    	if(this.newTeacherName == ""){
    		this.error = "Name is required";
    		return;
    	}
    	if(this.newTeacherEmail == ""){
    		this.error = "Email is required";
    		return;
    	}
    	if(this.newTeacherEmail.indexOf('@') == -1){
    		this.error = "Invalid Email";
    		return;
    	}
    	if (isNaN(Number(this.newTeacherPhone))) {
        	this.error = "Invalid Phone Number";
    		return;
    	}
    	this.TeacherService.addTeacher(this.newTeacherName, this.newTeacherEmail, this.newTeacherPhone)
            .subscribe(list => {
            	this.apiCallResult = list.result;
            	if(this.apiCallResult == 'failure'){
            		this.error = list.message;
            	}
            }, err => { console.log(err) });
    	//jQuery("#addTeacherModal").modal("hide");
    	//jQuery("#progressModal").modal("show");
    }
}
