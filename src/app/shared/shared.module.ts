import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { LocalStorageModule } from 'angular-2-local-storage';

import { AppConfig } from './config'

import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
export {PageNotFoundComponent};
import { EditScheduleModalComponent } from './components/edit-schedule-modal/edit-schedule-modal.component';
export { EditScheduleModalComponent };

import {AppService} from './services/app.service';
export {AppService};
import {CourseService} from './services/courses.service';
export {CourseService};
import {TeacherService} from './services/teachers.service';
export {TeacherService};
import {AttendanceService} from './services/attendance.service';
export {AttendanceService};
import {ExcelService} from './services/excel.service';
export {ExcelService};
import {ScheduleService} from './services/schedule.service';
export {ScheduleService};
import {StudentService} from './services/student.service';
export {StudentService};
import {AbsenceRequestService} from './services/absence-request.service';
export {AbsenceRequestService};
import {AuthGuardService} from './services/auth-guard.service';
export {AuthGuardService};
import {AuthService} from './services/auth.service';
export {AuthService};
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TabsModule,
    LocalStorageModule.withConfig({
            prefix: 'qldd',
            storageType: 'localStorage'
        })
  ],
  declarations: [
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent,
    EditScheduleModalComponent
  ],
  exports: [
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent,
    EditScheduleModalComponent
  ],  
  providers: [
    AppService,
    CourseService,
    TeacherService,
    AttendanceService,
    ScheduleService,
    StudentService,
    ExcelService,
    AbsenceRequestService,
    AppConfig,
    AuthGuardService
  ]
})
export class SharedModule {}