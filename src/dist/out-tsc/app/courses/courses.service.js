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
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
var globalVariables = require("../global-variable");
var CourseService = (function () {
    // Resolve HTTP using the constructor
    function CourseService(http) {
        this.http = http;
        // private instance variable to hold base url
        // private getListTeachersUrl = globalVariables.apiHost + '/teacher/list';
        // getListTeachers(searchText: string = null, page: number = 1, limit: number = 10): Observable < { result: string, } > {
        //     return this.http.get(this.getListTeachersUrl)
        //         // ...and calling .json() on the response to return data
        //         .map((res: Response) => res.json())
        //         //...errors if any
        //         .catch((error: any) => Observable.throw(error || 'Server error'));
        // }
        this.getCourseDetailsUrl = globalVariables.apiHost + '/course/detail';
    }
    CourseService.prototype.getCourseDetail = function (id) {
        return this.http.get(this.getCourseDetailsUrl + "/" + id)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return rxjs_1.Observable.throw(error || 'Server error'); });
    };
    return CourseService;
}());
CourseService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], CourseService);
exports.CourseService = CourseService;
//# sourceMappingURL=courses.service.js.map