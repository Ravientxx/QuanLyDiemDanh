import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppConfig } from './config'

import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
export {PageNotFoundComponent};


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


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent
  ],
  exports: [
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent
  ],  
  providers: [
    AppService,
    CourseService,
    TeacherService,
    AttendanceService,
    ScheduleService,
    StudentService,
    ExcelService,
    AppConfig
  ]
})
export class SharedModule {}