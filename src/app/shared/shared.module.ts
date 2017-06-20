import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QRCodeModule } from 'angular2-qrcode';

import { LocalStorageModule } from 'angular-2-local-storage';
import {FileUploadModule} from "ng2-file-upload";
import { AppConfig } from './config'
export {AppConfig};

import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TopNavigationComponent } from './components/top-navigation/top-navigation.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
export {PageNotFoundComponent};
import { QRCodeComponent } from './components/qr-code.component';
export {QRCodeComponent};
import { EditScheduleModalComponent } from './components/edit-schedule-modal/edit-schedule-modal.component';
export { EditScheduleModalComponent };
import { ResultMessageModalComponent } from './components/result-message-modal/result-message-modal.component';
export { ResultMessageModalComponent };
import { ImportModalComponent } from './components/import-modal/import-modal.component';
export { ImportModalComponent };
import { CreateAbsenceRequestModalComponent } from './components/create-absence-request-modal/create-absence-request-modal.component';
export { CreateAbsenceRequestModalComponent };
import { SendFeedbackModalComponent } from './components/send-feedback-modal/send-feedback-modal.component';
export { SendFeedbackModalComponent };

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
import {SemesterService} from './services/semester.service';
export {SemesterService};
import {FeedbackService} from './services/feedback.service';
export {FeedbackService};
import {CheckAttendanceSocketService} from './services/check-attendance-socket.service';
export {CheckAttendanceSocketService};
import {CheckAttendanceService} from './services/check-attendance.service';
export {CheckAttendanceService};
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TabsModule,
    QRCodeModule,
    LocalStorageModule.withConfig({
            prefix: 'qldd',
            storageType: 'localStorage'
        }),
    FileUploadModule
  ],
  declarations: [
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent,
    EditScheduleModalComponent,
    ResultMessageModalComponent,
    ImportModalComponent,
    CreateAbsenceRequestModalComponent,
    SendFeedbackModalComponent,
    QRCodeComponent
  ],
  exports: [
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent,
    EditScheduleModalComponent,
    ResultMessageModalComponent,
    ImportModalComponent,
    CreateAbsenceRequestModalComponent,
    SendFeedbackModalComponent,
    QRCodeComponent
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
    AuthGuardService,
    SemesterService,
    FeedbackService,
    CheckAttendanceService,
    CheckAttendanceSocketService
  ]
})
export class SharedModule {}