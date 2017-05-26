import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CourseService, TeacherService, AppService } from '../../shared/shared.module';
declare let jQuery: any;


@Component({
    selector: 'add-course',
    templateUrl: './add-course.component.html'
})
export class AddCourseComponent implements OnInit {
    @Input() type: string;

    public constructor(private router: Router, private appService: AppService, private courseService: CourseService, private teacherService: TeacherService) {

    }
    public onChangeProgram() {
        this.filteredClasses = [{ id: 0, name: 'Choose class' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClass = this.filteredClasses[0].id;
    }
    public ngOnInit(): void {
        this.teacherService.getListTeachers(this.searchText, 1, 9999)
            .subscribe(result => {
                this.teachers = result.teacher_list;
                this.filtered_teachers = this.teachers.slice();
            }, error => { console.log(error) });
        this.appService.getSemesterProgramClass().subscribe(results => {
            this.classes = results.classes;
            this.programs = results.programs;
            this.selectedProgram = this.programs[0].id;
            this.onChangeProgram();
        }, error => { console.log(error) });

        this.initSessions();
    }
    public isAddStudentFromCLass: boolean = true;
    public isAddStudentFromFile: boolean = false;

    public searchText: string = '';
    public teachers: Array < any > = [];
    public filtered_teachers: Array < any > = [];
    public selected_lecturers: Array < any > = [];
    public temp_lecturers: Array < any > = [];
    public selected_TAs: Array < any > = [];
    public temp_TAs: Array < any > = [];

    public programs: Array < any > = [];
    public selectedProgram: any;
    public classes: Array < any > ;
    public filteredClasses: Array < any > ;
    public selectedClass: any;

    public code = '';
    name = '';
    note = '';
    office_hour = '';

    public apiCallResult: string;
    public error_message: any;
    public success_message: any;

    public onCancelAddCourse() {
        this.router.navigate(['/courses/']);
    }

    public onAddCourse(isContinue: boolean = false) {
        jQuery("#progressModal").modal("show");
        this.error_message = "";
        this.courseService.addCourse(this.code, this.name, this.selected_lecturers, this.selected_TAs, this.office_hour, this.note,
                this.selectedProgram, this.selectedClass, this.isAddStudentFromCLass, this.isAddStudentFromFile, [], this.schedule)
            .subscribe(result => {
                this.apiCallResult = result.result;
                if (this.apiCallResult == 'failure') {
                    this.error_message = result.message;
                }
                if (this.apiCallResult == 'success') {
                    if (isContinue == false) {
                        this.success_message = result.message + '...Redirecting';
                        setTimeout(() => {
                            this.router.navigate(['/courses/']);
                        }, 3000);
                    } else {
                        this.success_message = result.message;
                    }
                }
                jQuery("#progressModal").modal("hide");
            }, error => {
                this.error_message = 'Server Error';
                console.log(error);
                jQuery("#progressModal").modal("hide");
            });
    }

    public searchList() {
        console.log('searchText');
        this.filtered_teachers = [];
        for (var i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].first_name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0 || this.teachers[i].last_name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0) {
                this.filtered_teachers.push(this.teachers[i]);
            }
        }
    }
    public onSelectLecturerClick(id: any) {
        for (var i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].id == id) {
                this.temp_lecturers.push(this.teachers[i]);
                this.teachers.splice(i, 1);
                this.searchList();
                break;
            }
        }
    }
    public onRemoveLecturerClick(id: any) {
        for (var i = 0; i < this.temp_lecturers.length; i++) {
            if (this.temp_lecturers[i].id == id) {
                this.teachers.push(this.temp_lecturers[i]);
                this.searchList();
                this.temp_lecturers.splice(i, 1);
                break;
            }
        }
    }
    public onOpenChooseLecturer() {
        this.temp_lecturers = [];
        this.temp_lecturers = this.selected_lecturers.slice();
        jQuery("#chooseLecturerModal").modal("show");
    }
    public onCancelChooseLecturer() {
        for (var i = 0; i < this.temp_lecturers.length; i++) {
            this.teachers.push(this.temp_lecturers[i]);
            this.searchList();
            this.temp_lecturers.splice(i, 1);
            break;
        }
        this.filtered_teachers = this.teachers.slice();
        this.temp_lecturers = [];
        jQuery("#chooseLecturerModal").modal("hide");
    }
    public onSaveChooseLecturer() {
        this.selected_lecturers = this.temp_lecturers.slice();
        this.temp_lecturers = [];
        this.filtered_teachers = this.teachers.slice();
        jQuery("#chooseLecturerModal").modal("hide");
    }


    public onSelectTAClick(id: any) {
        for (var i = 0; i < this.teachers.length; i++) {
            if (this.teachers[i].id == id) {
                this.temp_TAs.push(this.teachers[i]);
                this.teachers.splice(i, 1);
                this.searchList();
                break;
            }
        }
    }
    public onRemoveTAClick(id: any) {
        for (var i = 0; i < this.temp_TAs.length; i++) {
            if (this.temp_TAs[i].id == id) {
                this.teachers.push(this.temp_TAs[i]);
                this.searchList();
                this.temp_TAs.splice(i, 1);
                break;
            }
        }
    }
    public onOpenChooseTA() {
        this.temp_TAs = [];
        this.temp_TAs = this.selected_TAs.slice();
        jQuery("#chooseTAModal").modal("show");
    }
    public onCancelChooseTA() {
        this.temp_lecturers = [];
        for (var i = 0; i < this.temp_TAs.length; i++) {
            this.teachers.push(this.temp_TAs[i]);
            this.searchList();
            this.temp_TAs.splice(i, 1);
        }
        this.filtered_teachers = this.teachers.slice();
        jQuery("#chooseTAModal").modal("hide");
    }
    public onSaveChooseTA() {
        this.filtered_teachers = this.teachers.slice();
        this.selected_TAs = this.temp_TAs.slice();
        this.temp_TAs = [];
        jQuery("#chooseTAModal").modal("hide");
    }


    public editingCellIndex: number = -1;
    public temp_room: string = '';
    public temp_type: string = '';
    public schedule: string = '';
    public temp_sessions = [];
    public sessions = [
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
        { room: '', type: 'LT' },
    ];
    public initSessions() {
        this.temp_sessions = [
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
            { room: '', type: 'LT' },
        ];
    }
    public onOpenChooseSchedule() {
        jQuery("#chooseScheduleModal").modal("show");
        for(var i = 0 ; i < this.sessions.length; i++){
            this.temp_sessions[i].room = this.sessions[i].room;
            this.temp_sessions[i].type = this.sessions[i].type;
        }
    }
    public onCancelChooseSchedule() {
        this.initSessions();
        jQuery("#chooseScheduleModal").modal("hide");
    }
    public onSaveChooseSchedule() {
        for(var i = 0 ; i < this.temp_sessions.length; i++){
            this.sessions[i].room = this.temp_sessions[i].room;
            this.sessions[i].type = this.temp_sessions[i].type;
        }
        this.initSessions();
        this.schedule = '';
        for (var i = 0; i < this.sessions.length; i++) {
            if (this.sessions[i].room != '') {
                this.schedule += i + '-' + this.sessions[i].room + '-' + this.sessions[i].type + ';';
            }
        }
        this.schedule = this.schedule.substr(0, this.schedule.length - 1);
        console.log(this.schedule);
        jQuery("#chooseScheduleModal").modal("hide");
    }
    public onScheduleCellClick(index: number) {
        this.editingCellIndex = index;
        this.temp_room = this.temp_sessions[index].room;
        this.temp_type = this.temp_sessions[index].type;
    }
    public onCancelScheduleCell() {
        this.editingCellIndex = -1;
    }
    public onRemoveScheduleCell() {
        this.temp_sessions[this.editingCellIndex].room = '';
        this.temp_sessions[this.editingCellIndex].type = 'LT';
        this.editingCellIndex = -1;
    }
    public onUpdateScheduleCell() {
        this.temp_sessions[this.editingCellIndex].room = this.temp_room;
        this.temp_sessions[this.editingCellIndex].type = this.temp_type;
        console.log(this.sessions[this.editingCellIndex]);
        this.editingCellIndex = -1;
    }
}
