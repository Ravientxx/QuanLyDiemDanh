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
var students_component_1 = require("./students.component");
var students_list_table_component_1 = require("./students-list-table/students-list-table.component");
var student_detail_component_1 = require("./student-detail/student-detail.component");
var ng2_table_1 = require("ng2-table/ng2-table");
var pagination_1 = require("ngx-bootstrap/pagination");
var tabs_1 = require("ngx-bootstrap/tabs");
var student_home_page_component_1 = require("./student-home-page/student-home-page.component");
var courses_list_table_component_1 = require("./courses-list-table/courses-list-table.component");
var courses_detail_table_component_1 = require("./courses-detail-table/courses-detail-table.component");
var absence_requests_table_component_1 = require("./absence-requests-table/absence-requests-table.component");
var studentsRoutes = [
    { path: 'students/dashboard', component: student_home_page_component_1.StudentHomePageComponent },
    { path: 'students/courses/:id', component: courses_detail_table_component_1.CoursesDetailTableComponent },
    { path: 'students/absence-requests', component: courses_detail_table_component_1.CoursesDetailTableComponent },
    { path: 'students', component: students_component_1.StudentsComponent },
    { path: 'students/:id', component: student_detail_component_1.StudentDetailComponent },
];
var StudentsModule = (function () {
    function StudentsModule() {
    }
    return StudentsModule;
}());
StudentsModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            router_1.RouterModule.forChild(studentsRoutes),
            ng2_table_1.Ng2TableModule,
            pagination_1.PaginationModule.forRoot(),
            tabs_1.TabsModule,
        ],
        declarations: [
            students_component_1.StudentsComponent,
            students_list_table_component_1.StudentsListTableComponent,
            student_detail_component_1.StudentDetailComponent,
            student_home_page_component_1.StudentHomePageComponent,
            courses_list_table_component_1.CoursesListTableComponent,
            courses_detail_table_component_1.CoursesDetailTableComponent,
            absence_requests_table_component_1.AbsenceRequestsTableComponent
        ],
        providers: []
    })
], StudentsModule);
exports.StudentsModule = StudentsModule;
//# sourceMappingURL=students.module.js.map