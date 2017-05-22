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
var app_service_1 = require("../../app.service");
var globalVariable = require("../../global-variable");
var SideMenuComponent = (function () {
    function SideMenuComponent(appService) {
        this.appService = appService;
        this.sideMenu = [];
        this.staffMenu = [
            { title: 'Dashboard', url: '/', icon: 'fa-home' },
            { title: 'Students', url: '/students', icon: 'fa-users' },
            { title: 'Courses', url: '/courses', icon: 'fa-book' },
            { title: 'Teachers', url: '/teachers', icon: 'fa-graduation-cap' },
            { title: 'Schedule', url: '/schedule', icon: 'fa-calendar' },
            { title: 'Absence Requests', icon: 'fa-envelope',
                subMenu: [{ title: 'Student', url: '/absence-requests/student' },
                    { title: 'Teacher', url: '/absence-requests/teacher' }] },
            { title: 'Admin', icon: 'fa-key',
                subMenu: [{ title: 'Create User', url: '/admin/create-user' },
                    { title: 'User Management', url: '/admin/users' },
                    { title: 'Activity Logs', url: '/admin/logs' }] },
            { title: 'Settings', url: '/settings', icon: 'fa-cog' }
        ];
        this.studentMenu = [
            { title: 'Dashboard', url: '/', icon: 'fa-home' },
            { title: 'Profile', url: '/profile', icon: 'fa-users' },
            { title: 'Absence Requests', url: '/absence-request', icon: 'fa-envelope' },
            { title: 'Feedback', url: '/feedback', icon: 'fa-envelope' },
        ];
        this.teacherMenu = [
            { title: 'Dashboard', url: '/', icon: 'fa-home' },
            { title: 'Profile', url: '/profile', icon: 'fa-users' },
            { title: 'Absence Requests', url: '/absence-request', icon: 'fa-envelope' },
            { title: 'Feedback', url: '/feedback', icon: 'fa-envelope' },
        ];
        switch (appService.current_userType) {
            case globalVariable.userType.staff:
                this.sideMenu = this.staffMenu;
                break;
            case globalVariable.userType.student:
                this.sideMenu = this.studentMenu;
                break;
            case globalVariable.userType.teacher:
                this.sideMenu = this.teacherMenu;
                break;
        }
    }
    SideMenuComponent.prototype.ngOnInit = function () { };
    return SideMenuComponent;
}());
SideMenuComponent = __decorate([
    core_1.Component({
        selector: 'app-side-menu',
        templateUrl: './side-menu.component.html',
    }),
    __metadata("design:paramtypes", [app_service_1.AppService])
], SideMenuComponent);
exports.SideMenuComponent = SideMenuComponent;
//# sourceMappingURL=side-menu.component.js.map