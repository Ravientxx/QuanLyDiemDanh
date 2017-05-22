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
var courses_service_1 = require("../courses.service");
var CourseDetailComponent = (function () {
    function CourseDetailComponent(route, router, courseService) {
        this.route = route;
        this.router = router;
        this.courseService = courseService;
        this.course = [];
        this.lecturers = [];
        this.TAs = [];
    }
    CourseDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) { _this.course_id = params['id']; });
        this.courseService.getCourseDetail(this.course_id).subscribe(function (result) {
            _this.course = result.course;
            _this.lecturers = result.lecturers;
            _this.TAs = result.TAs;
        }, function (error) { console.log(error); });
        //get course from database
        console.log(this.course_id);
    };
    return CourseDetailComponent;
}());
CourseDetailComponent = __decorate([
    core_1.Component({
        selector: 'courses-detail',
        templateUrl: './course-detail.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, courses_service_1.CourseService])
], CourseDetailComponent);
exports.CourseDetailComponent = CourseDetailComponent;
//# sourceMappingURL=course-detail.component.js.map