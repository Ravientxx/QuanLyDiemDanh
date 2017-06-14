import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TeacherService, AppService, ResultMessageModalComponent } from '../shared/shared.module';
declare var jQuery:any;

@Component({
    selector: 'app-teachers',
    templateUrl: './teachers.component.html'
})
export class TeachersComponent implements OnInit {
    public teacher_list: Array<any>;
    public searchText: string = '';
    public pageNumber: number = 1;
    public limit: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public itemsPerPage: number = 10;
    public newTeacherFirstName :string = ""; newTeacherLastName :string = ""; newTeacherPhone:string = "" ; newTeacherEmail:string = "";
    
    public apiResult: string;
    public apiResultMessage: string;
    @ViewChild(ResultMessageModalComponent)
    private resultMessageModal: ResultMessageModalComponent;

    public sort_tag = ['none','asc','dsc'];
    public sort_index = 0;
    ngOnInit() {}

    constructor(private TeacherService: TeacherService, private router: Router, private appService: AppService) {
        this.onSearchChange();
    }

    public onSearchChange() {
        this.TeacherService.getListTeachers(this.searchText, this.pageNumber, this.itemsPerPage,this.sort_tag[this.sort_index])
            .subscribe(result => {
                this.teacher_list = result.teacher_list;
                this.totalItems = result.total_items;
            }, err => { console.log(err) });
    }

    public onPageChanged(event: any) {
        this.pageNumber= event.page;
        this.TeacherService.getListTeachers(this.searchText, this.pageNumber, this.itemsPerPage,this.sort_tag[this.sort_index])
            .subscribe(result => {
            	this.apiResult = result.result;
                this.teacher_list = result.teacher_list;
                this.totalItems = result.total_items;
            }, err => { console.log(err) });
    }
    public onSortNameClick(){
        if(this.sort_index == 2){
            this.sort_index = 0;
        }else{
            this.sort_index++;
        }
        this.onSearchChange();
    }
    public onCellClick(id: any ,email: any) {
        //this.appService.navigationData.current_teacher_id = id;
        this.router.navigate(['/teachers/',id]);
    }
    public onCancelAddTeacher(){
    	jQuery("#addTeacherModal").modal("hide");
    	this.newTeacherEmail = this.newTeacherFirstName = this.newTeacherLastName = this.newTeacherPhone;
    }
    public onAddTeacher(){
    	jQuery("#progressModal").modal("show");
    	this.TeacherService.addTeacher(this.newTeacherFirstName, this.newTeacherLastName, this.newTeacherEmail, this.newTeacherPhone)
            .subscribe(result => {
            	this.apiResult = result.result;
                this.apiResultMessage = result.message;
            	if(this.apiResult == 'success'){
            		this.newTeacherEmail = this.newTeacherFirstName = this.newTeacherLastName = this.newTeacherPhone = "";
            		this.onSearchChange();
            	}
            	jQuery("#progressModal").modal("hide");
                //this.resultMessageModal.onOpenModal();
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }, err => { console.log(err) });
    }
}
