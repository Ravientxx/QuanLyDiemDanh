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
var ngx_bootstrap_1 = require("ngx-bootstrap");
var schedule_component_1 = require("./schedule.component");
var ng2_table_1 = require("ng2-table/ng2-table");
var pagination_1 = require("ngx-bootstrap/pagination");
var tabs_1 = require("ngx-bootstrap/tabs");
var ng2_file_upload_1 = require("ng2-file-upload");
var schedule_upload_component_1 = require("./schedule-upload/schedule-upload.component");
var schedule_service_1 = require("./schedule.service");
var scheduleRoutes = [
    { path: 'schedule', component: schedule_component_1.ScheduleComponent }
];
var ScheduleModule = (function () {
    function ScheduleModule() {
    }
    return ScheduleModule;
}());
ScheduleModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            router_1.RouterModule.forChild(scheduleRoutes),
            ng2_table_1.Ng2TableModule,
            ngx_bootstrap_1.CollapseModule.forRoot(),
            pagination_1.PaginationModule.forRoot(),
            tabs_1.TabsModule,
            ng2_file_upload_1.FileUploadModule,
        ],
        declarations: [
            schedule_component_1.ScheduleComponent,
            schedule_upload_component_1.ScheduleUploadComponent,
        ],
        providers: [
            schedule_service_1.ScheduleService,
        ]
    })
], ScheduleModule);
exports.ScheduleModule = ScheduleModule;
//# sourceMappingURL=schedule.module.js.map