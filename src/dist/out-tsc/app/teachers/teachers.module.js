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
var teachers_component_1 = require("./teachers.component");
var teacher_detail_component_1 = require("./teacher-detail/teacher-detail.component");
var ng2_table_1 = require("ng2-table/ng2-table");
var pagination_1 = require("ngx-bootstrap/pagination");
var tabs_1 = require("ngx-bootstrap/tabs");
var teachers_service_1 = require("./teachers.service");
var teachersRoutes = [
    { path: 'teachers', component: teachers_component_1.TeachersComponent },
    { path: 'teachers/:id', component: teacher_detail_component_1.TeacherDetailComponent }
];
var TeachersModule = (function () {
    function TeachersModule() {
    }
    return TeachersModule;
}());
TeachersModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            router_1.RouterModule.forChild(teachersRoutes),
            ng2_table_1.Ng2TableModule,
            pagination_1.PaginationModule.forRoot(),
            tabs_1.TabsModule.forRoot(),
        ],
        declarations: [
            teachers_component_1.TeachersComponent,
            teacher_detail_component_1.TeacherDetailComponent
        ],
        providers: [
            teachers_service_1.TeacherService
        ]
    })
], TeachersModule);
exports.TeachersModule = TeachersModule;
//# sourceMappingURL=teachers.module.js.map