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
var teachers_service_1 = require("./teachers.service");
var app_service_1 = require("../app.service");
var TeachersComponent = (function () {
    function TeachersComponent(TeacherService, router, appService) {
        this.TeacherService = TeacherService;
        this.router = router;
        this.appService = appService;
        this.searchText = '';
        this.pageNumber = 1;
        this.limit = 15;
        this.currentPage = 1;
        this.totalItems = 0;
        this.itemsPerPage = 10;
        this.newTeacherFirstName = "";
        this.newTeacherLastName = "";
        this.newTeacherPhone = "";
        this.newTeacherEmail = "";
        this.sort_tag = ['none', 'asc', 'dsc'];
        this.sort_index = 0;
        this.onSearchChange();
    }
    TeachersComponent.prototype.ngOnInit = function () { };
    TeachersComponent.prototype.onSearchChange = function () {
        var _this = this;
        this.TeacherService.getListTeachers(this.searchText, this.pageNumber, this.itemsPerPage, this.sort_tag[this.sort_index])
            .subscribe(function (list) {
            _this.teacher_list = list.teacher_list;
            _this.totalItems = list.total_items;
        }, function (err) { console.log(err); });
    };
    TeachersComponent.prototype.onPageChanged = function (event) {
        var _this = this;
        this.pageNumber = event.page;
        this.TeacherService.getListTeachers(this.searchText, this.pageNumber, this.itemsPerPage, this.sort_tag[this.sort_index])
            .subscribe(function (list) {
            _this.apiCallResult = list.result;
            _this.teacher_list = list.teacher_list;
            _this.totalItems = list.total_items;
        }, function (err) { console.log(err); });
    };
    TeachersComponent.prototype.onSortNameClick = function () {
        if (this.sort_index == 2) {
            this.sort_index = 0;
        }
        else {
            this.sort_index++;
        }
        this.onSearchChange();
    };
    TeachersComponent.prototype.onCellClick = function (id, email) {
        //this.appService.navigationData.current_teacher_id = id;
        this.router.navigate(['/teachers/', id]);
    };
    TeachersComponent.prototype.onCancelAddTeacher = function () {
        jQuery("#addTeacherModal").modal("hide");
        this.newTeacherEmail = this.newTeacherFirstName = this.newTeacherLastName = this.newTeacherPhone = this.error_message = "";
    };
    TeachersComponent.prototype.onAddTeacher = function () {
        var _this = this;
        jQuery("#progressModal").modal("show");
        this.error_message = "";
        this.TeacherService.addTeacher(this.newTeacherFirstName, this.newTeacherLastName, this.newTeacherEmail, this.newTeacherPhone)
            .subscribe(function (list) {
            _this.apiCallResult = list.result;
            if (_this.apiCallResult == 'failure') {
                _this.error_message = list.message;
            }
            if (_this.apiCallResult == 'success') {
                _this.success_message = list.message;
                _this.newTeacherEmail = _this.newTeacherFirstName = _this.newTeacherLastName = _this.newTeacherPhone = "";
                _this.onSearchChange();
            }
            jQuery("#progressModal").modal("hide");
        }, function (err) { console.log(err); });
    };
    return TeachersComponent;
}());
TeachersComponent = __decorate([
    core_1.Component({
        selector: 'app-teachers',
        templateUrl: './teachers.component.html'
    }),
    __metadata("design:paramtypes", [teachers_service_1.TeacherService, router_1.Router, app_service_1.AppService])
], TeachersComponent);
exports.TeachersComponent = TeachersComponent;
//# sourceMappingURL=teachers.component.js.map