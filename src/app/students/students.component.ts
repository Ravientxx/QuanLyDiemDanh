import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StudentService, AppService,ResultMessageModalComponent,ImportModalComponent } from '../shared/shared.module';
declare var jQuery: any;
@Component({
    selector: 'app-students',
    templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {

    public apiResult: string;
    public apiResultMessage: any;
    public sort = 'none'; // ['none', 'asc', 'dsc'];
    public sort_tag = '';

    public semesters: Array < any > = [];
    public programs: Array < any > = [];
    public classes: Array < any > = [];

    public student_list: Array < any > = [];
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

    newFirstName: string = "";
    newLastName: string = "";
    newPhone: string = "";
    newEmail: string = "";
    newCode: string = "";
    newClass: number = 0;
    newProgram: number = 0;
    newNote: string = '';
    constructor(private appService: AppService, private studentService: StudentService, private router: Router) {}

    ngOnInit() {
        this.appService.getSemesterProgramClass().subscribe(results => {
            this.semesters = results.semesters;
            this.selectedSemester = this.semesters[this.semesters.length - 1].id;
            this.classes = results.classes;
            this.programs = this.new_programs = results.programs;
            this.selectedProgram = this.programs[this.programs.length - 1].id;
            this.onChangeProgram();
        }, error => { console.log(error) });
    }

    public getCurrentList() {
        this.studentService.getListStudents(this.searchText, this.pageNumber, this.itemsPerPage, this.sort, this.sort_tag, this.selectedProgram, this.selectedClasses)
            .subscribe(result => {
                this.student_list = result.student_list;
                this.totalItems = result.total_items;
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

    public onCellClick(id: any) {
        console.log(id);
        this.router.navigate(['/students/', id]);
    }
    public onOpenAddStudent() {
        this.newProgram = this.new_programs[this.new_programs.length - 1].id;
        this.onChangeNewProgram();
        jQuery("#addStudentModal").modal("show");
    }
    public onCancelAddStudent() {
        this.newFirstName = this.newLastName = this.newPhone = this.newEmail = this.newCode = this.newNote = '';
        this.newClass = this.newProgram = 0;
        jQuery("#addStudentModal").modal("hide");
    }
    @ViewChild(ResultMessageModalComponent)
    private resultMessageModal: ResultMessageModalComponent;
    public onAddStudent() {
        //jQuery("#progressModal").modal("show");
        this.studentService.addStudent(this.newProgram, this.newClass, this.newCode, this.newFirstName, this.newLastName, this.newEmail, this.newPhone, this.newNote)
            .subscribe(list => {
                this.apiResult = list.result;
                this.apiResultMessage = list.message;
                if (this.apiResult == 'success') {
                    this.newFirstName = this.newLastName = this.newPhone = this.newEmail = this.newCode = this.newNote = '';
                    this.newClass = this.newProgram = 0;
                    this.getCurrentList();
                }
                //jQuery("#progressModal").modal("hide");
                //this.resultMessageModal.onOpenModal();
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,this.apiResult == 'success' ? 'success' : 'error');
            }, err => { console.log(err) });
    }
    public new_programs = [];
    public new_classes = [];
    public onChangeNewProgram() {
        this.new_classes = [];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.newProgram) {
                this.new_classes.push(this.classes[i]);
            }
        }
        this.newClass = this.new_classes[0].id;
    }

    @ViewChild(ImportModalComponent)
    private importModal: ImportModalComponent;
    onImportStudent(){
        this.importModal.onOpenModal();
    }
    onExportStudent(){

    }
}
