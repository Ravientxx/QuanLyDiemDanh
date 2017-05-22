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
var courses_service_1 = require("./courses.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var courses_component_1 = require("./courses.component");
var courses_list_table_component_1 = require("./courses-list-table/courses-list-table.component");
var course_detail_component_1 = require("./course-detail/course-detail.component");
var attendance_list_table_component_1 = require("./attendance-list-table/attendance-list-table.component");
var ng2_table_1 = require("ng2-table/ng2-table");
var pagination_1 = require("ngx-bootstrap/pagination");
var tabs_1 = require("ngx-bootstrap/tabs");
var coursesRoutes = [
    { path: 'courses', component: courses_component_1.CoursesComponent },
    { path: 'courses/:id', component: course_detail_component_1.CourseDetailComponent }
];
var CoursesModule = (function () {
    function CoursesModule() {
    }
    return CoursesModule;
}());
CoursesModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            router_1.RouterModule.forChild(coursesRoutes),
            ngx_bootstrap_1.CollapseModule.forRoot(),
            ng2_table_1.Ng2TableModule,
            pagination_1.PaginationModule.forRoot(),
            tabs_1.TabsModule,
        ],
        declarations: [
            courses_component_1.CoursesComponent,
            courses_list_table_component_1.CoursesListTableComponent,
            course_detail_component_1.CourseDetailComponent,
            attendance_list_table_component_1.AttendanceListTableComponent
        ],
        providers: [
            courses_service_1.CourseService
        ]
    })
], CoursesModule);
exports.CoursesModule = CoursesModule;
//# sourceMappingURL=courses.module.js.map