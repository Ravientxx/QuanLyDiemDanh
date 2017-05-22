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
var app_service_1 = require("../app.service");
var schedule_service_1 = require("./schedule.service");
var ScheduleComponent = (function () {
    function ScheduleComponent(scheduleService, appService) {
        this.scheduleService = scheduleService;
        this.appService = appService;
        this.isCollapsed = true;
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
            ['abc', 'def']
        ];
        this.courses = [];
        this.semesters = [];
        this.programs = [];
    }
    ScheduleComponent.prototype.collapsed = function (event) {
        console.log(event);
    };
    ScheduleComponent.prototype.expanded = function (event) {
        console.log(event);
    };
    ScheduleComponent.prototype.onChangeProgram = function () {
        this.filteredClasses = [{ id: 0, name: 'All Classes' }];
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].program_id == this.selectedProgram) {
                this.filteredClasses.push(this.classes[i]);
            }
        }
        this.selectedClasses = this.filteredClasses[0].id;
    };
    ScheduleComponent.prototype.onChangeSemester = function () {
    };
    ScheduleComponent.prototype.onChangeClass = function () {
        console.log();
    };
    ScheduleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.appService.getSemesterProgramClass().subscribe(function (results) {
            _this.semesters = results.semesters;
            _this.selectedSemester = _this.semesters[_this.semesters.length - 1].id;
            _this.classes = results.classes;
            _this.programs = results.programs;
            _this.selectedProgram = _this.programs[0].id;
            _this.onChangeProgram();
        }, function (error) { console.log(error); });
    };
    ScheduleComponent.prototype.xlsxUploaded = function (result) {
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
    };
    return ScheduleComponent;
}());
ScheduleComponent = __decorate([
    core_1.Component({
        selector: 'app-schedule',
        templateUrl: './schedule.component.html',
        styles: ['td, #study_time { white-space:pre-wrap; word-wrap:break-word }']
    }),
    __metadata("design:paramtypes", [schedule_service_1.ScheduleService, app_service_1.AppService])
], ScheduleComponent);
exports.ScheduleComponent = ScheduleComponent;
//# sourceMappingURL=schedule.component.js.map