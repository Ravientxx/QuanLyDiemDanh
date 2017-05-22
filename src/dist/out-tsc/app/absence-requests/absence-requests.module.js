"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var student_absence_request_component_1 = require("./student/student-absence-request.component");
var absence_request_service_1 = require("./absence-request.service");
var AbsenceRequestsRoutes = [
    { path: 'absence-requests/student', component: student_absence_request_component_1.StudentAbsenceRequestComponent },
];
var AbsenceRequestsModule = (function () {
    function AbsenceRequestsModule() {
    }
    return AbsenceRequestsModule;
}());
AbsenceRequestsModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            router_1.RouterModule.forChild(AbsenceRequestsRoutes),
        ],
        declarations: [
            student_absence_request_component_1.StudentAbsenceRequestComponent
        ],
        providers: [
            absence_request_service_1.AbsenceRequestService
        ]
    })
], AbsenceRequestsModule);
exports.AbsenceRequestsModule = AbsenceRequestsModule;
//# sourceMappingURL=absence-requests.module.js.map