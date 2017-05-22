"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var app_service_1 = require("../app.service");
var courses_service_1 = require("./courses.service");
var CoursesComponent = (function () {
    function CoursesComponent(appService, courseService, router) {
        this.appService = appService;
        this.courseService = courseService;
        this.router = router;
        this.semesters = [];
        this.currentSemester = {};
        this.programs = [];
        this.isCollapsed = true;
        this.pageNumber = 1;
        this.limit = 15;
        this.currentPage = 1;
        this.totalItems = 0;
        this.itemsPerPage = 10;
    }
    CoursesComponent.prototype.onChangeProgram = function () {
        this.filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClasses = this.filteredClasses[0].id;
    };
    CoursesComponent.prototype.onChangeSemester = function () {
    };
    CoursesComponent.prototype.onChangeClass = function () {
    };
    CoursesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.appService.getSemesterProgramClass().subscribe(function (results) {
            _this.semesters = results.semesters;
            _this.currentSemester = _this.semesters[_this.semesters.length - 1];
            _this.classes = results.classes;
            _this.programs = results.programs;
            _this.selectedProgram = _this.programs[0].id;
            _this.onChangeProgram();
        }, function (error) { console.log(error); });
    };
    CoursesComponent.prototype.onSearchChange = function () {
    };
    CoursesComponent.prototype.onPageChanged = function (event) {
        var page = event.page;
    };
    CoursesComponent.prototype.onCellClick = function (id) {
        this.router.navigate(['/courses/', id]);
    };
    CoursesComponent.prototype.onCancelAddTeacher = function () {
        // jQuery("#addTeacherModal").modal("hide");
        // this.newTeacherEmail = this.newTeacherName = this.newTeacherPhone = this.error_message = "";
    };
    CoursesComponent.prototype.onAddTeacher = function () {
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
    };
    CoursesComponent.prototype.collapsed = function (event) {
        console.log(event);
    };
    CoursesComponent.prototype.expanded = function (event) {
        console.log(event);
    };
    return CoursesComponent;
}());
CoursesComponent = __decorate([
    core_1.Component({
        selector: 'app-courses',
        templateUrl: './courses.component.html'
    }),
    __metadata("design:paramtypes", [app_service_1.AppService, courses_service_1.CourseService, router_1.Router])
], CoursesComponent);
exports.CoursesComponent = CoursesComponent;
//# sourceMappingURL=courses.component.js.map