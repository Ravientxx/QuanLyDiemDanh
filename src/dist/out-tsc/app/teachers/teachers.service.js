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
var TeacherService = (function () {
    // Resolve HTTP using the constructor
    function TeacherService(http) {
        this.http = http;
        // private instance variable to hold base url
        this.getListTeachersUrl = globalVariables.apiHost + '/teacher/list';
        this.getTeacherDetailsUrl = globalVariables.apiHost + '/teacher/detail';
        this.addTeacherUrl = globalVariables.apiHost + '/teacher/add';
    }
    TeacherService.prototype.getListTeachers = function (searchText, page, limit, sort) {
        if (searchText === void 0) { searchText = null; }
        if (page === void 0) { page = 1; }
        if (limit === void 0) { limit = 10; }
        if (sort === void 0) { sort = 'none'; }
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
        };
        return this.http.post(this.getListTeachersUrl, params)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return rxjs_1.Observable.throw(error || 'Server error'); });
    };
    TeacherService.prototype.getTeacherDetail = function (id) {
        return this.http.get(this.getTeacherDetailsUrl + "/" + id)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return rxjs_1.Observable.throw(error || 'Server error'); });
    };
    TeacherService.prototype.addTeacher = function (first_name, last_name, email, phone) {
        if (phone === void 0) { phone = null; }
        var params = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone
        };
        return this.http.post(this.addTeacherUrl, params)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return rxjs_1.Observable.throw(error || 'Server error'); });
    };
    return TeacherService;
}());
TeacherService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], TeacherService);
exports.TeacherService = TeacherService;
//# sourceMappingURL=teachers.service.js.map