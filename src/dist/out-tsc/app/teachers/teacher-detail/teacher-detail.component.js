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
var teachers_service_1 = require("../teachers.service");
var TeacherDetailComponent = (function () {
    function TeacherDetailComponent(route, router, TeacherService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.TeacherService = TeacherService;
        this.teacher = [];
        this.route.params.subscribe(function (params) { _this.teacher_id = params['id']; });
        this.TeacherService.getTeacherDetail(this.teacher_id)
            .subscribe(function (result) {
            _this.teacher = result.teacher;
            _this.teaching_courses = result.teaching_courses;
        }, function (err) { console.log(err); });
    }
    TeacherDetailComponent.prototype.ngOnInit = function () {
    };
    TeacherDetailComponent.prototype.onCellClick = function (id) {
        //this.appService.navigationData.current_teacher_id = id;
        this.router.navigate(['courses/', id]);
    };
    return TeacherDetailComponent;
}());
TeacherDetailComponent = __decorate([
    core_1.Component({
        selector: 'teacher-detail',
        templateUrl: './teacher-detail.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, teachers_service_1.TeacherService])
], TeacherDetailComponent);
exports.TeacherDetailComponent = TeacherDetailComponent;
//# sourceMappingURL=teacher-detail.component.js.map