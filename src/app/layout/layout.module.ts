import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';

import { SharedModule } from '../shared/shared.module';
import { HomePageModule } from '../home-page/home-page.module';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';
import { TeachersModule } from '../teachers/teachers.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { AbsenceRequestsModule } from '../absence-requests/absence-requests.module';
import { FeedbackModule } from '../feedback/feedback.module';

import { AuthGuardService } from '../shared/shared.module';
const ROUTES = [{
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuardService],
    children: [
        { path: '', loadChildren: 'app/home-page/home-page.module#HomePageModule' },
        { path: 'courses', loadChildren: 'app/courses/courses.module#CoursesModule' },
        { path: 'students', loadChildren: 'app/students/students.module#StudentsModule' },
        { path: 'teachers', loadChildren: 'app/teachers/teachers.module#TeachersModule' },
        { path: 'schedule', loadChildren: 'app/schedule/schedule.module#ScheduleModule' },
        { path: 'absence-requests', loadChildren: 'app/absence-requests/absence-requests.module#AbsenceRequestsModule' },
        { path: 'feedback', loadChildren: 'app/feedback/feedback.module#FeedbackModule' },
    ]
}, ];
@NgModule({
    declarations: [
        LayoutComponent,
    ],
    imports: [
        FormsModule,
        HttpModule,
        SharedModule,
        // HomePageModule,
        // CoursesModule,
        //StudentsModule,
        //TeachersModule,
        //ScheduleModule,
        //AbsenceRequestsModule,
        //FeedbackModule,
        RouterModule.forChild(ROUTES),
    ],
    providers: [],
})

export class LayoutModule {}
