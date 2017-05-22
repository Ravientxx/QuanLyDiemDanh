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
var absence_request_service_1 = require("../absence-request.service");
var StudentAbsenceRequestComponent = (function () {
    function StudentAbsenceRequestComponent(router, AbsenceRequestService) {
        this.router = router;
        this.AbsenceRequestService = AbsenceRequestService;
    }
    StudentAbsenceRequestComponent.prototype.ngOnInit = function () {
        this.loadRequests();
    };
    StudentAbsenceRequestComponent.prototype.loadRequests = function () {
        var _this = this;
        this.AbsenceRequestService.getNewRequests()
            .subscribe(function (requests) { return _this.newRequests = requests; }, function (err) { console.log(err); });
        this.AbsenceRequestService.getAcceptedRequests()
            .subscribe(function (requests) { return _this.acceptedRequests = requests; }, function (err) { console.log(err); });
    };
    StudentAbsenceRequestComponent.prototype.clickRequest = function (request, action) {
        this.selectedRequest = request;
        var title;
        this.action = action;
        switch (action) {
            case "accept":
                title = "Accept Absence Request";
                break;
            case "reject":
                title = "Reject Absence Request";
                break;
            case "undo":
                title = "Undo Absence Request";
                break;
        }
        this.confirm_modal_title = title;
    };
    StudentAbsenceRequestComponent.prototype.confirmAction = function () {
        var _this = this;
        switch (this.action) {
            case "accept":
                this.AbsenceRequestService.acceptRequest(this.selectedRequest.id)
                    .subscribe(function (requests) {
                    _this.serverResponse = requests;
                    _this.loadRequests();
                }, function (err) {
                    console.log(err);
                });
                break;
            case "reject":
                break;
            case "undo":
                break;
        }
    };
    return StudentAbsenceRequestComponent;
}());
StudentAbsenceRequestComponent = __decorate([
    core_1.Component({
        selector: 'student-absence-request',
        templateUrl: './student-absence-request.component.html',
    }),
    __metadata("design:paramtypes", [router_1.Router, absence_request_service_1.AbsenceRequestService])
], StudentAbsenceRequestComponent);
exports.StudentAbsenceRequestComponent = StudentAbsenceRequestComponent;
//# sourceMappingURL=student-absence-request.component.js.map