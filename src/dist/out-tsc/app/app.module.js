"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_component_1 = require("./app.component");
var footer_component_1 = require("./layout/footer/footer.component");
var side_menu_component_1 = require("./layout/side-menu/side-menu.component");
var top_navigation_component_1 = require("./layout/top-navigation/top-navigation.component");
var home_page_component_1 = require("./home-page/home-page.component");
var page_not_found_component_1 = require("./others/page-not-found.component");
var students_module_1 = require("./students/students.module");
var courses_module_1 = require("./courses/courses.module");
var teachers_module_1 = require("./teachers/teachers.module");
var schedule_module_1 = require("./schedule/schedule.module");
var absence_requests_module_1 = require("./absence-requests/absence-requests.module");
var app_service_1 = require("./app.service");
var ROUTES = [
    {
        path: '',
        component: home_page_component_1.HomePageComponent
    },
    {
        path: '**',
        component: page_not_found_component_1.PageNotFoundComponent
    },
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.AppComponent,
            footer_component_1.FooterComponent,
            side_menu_component_1.SideMenuComponent,
            top_navigation_component_1.TopNavigationComponent,
            home_page_component_1.HomePageComponent,
            page_not_found_component_1.PageNotFoundComponent,
        ],
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            courses_module_1.CoursesModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            schedule_module_1.ScheduleModule,
            absence_requests_module_1.AbsenceRequestsModule,
            router_1.RouterModule.forRoot(ROUTES),
        ],
        providers: [
            app_service_1.AppService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map