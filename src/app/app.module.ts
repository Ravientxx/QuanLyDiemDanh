import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadModule } from "ng2-file-upload";

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { SharedModule, PageNotFoundComponent, AuthService, AuthGuardService } from './shared/shared.module';

import { HomePageModule } from './home-page/home-page.module';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AbsenceRequestsModule } from './absence-requests/absence-requests.module';
import { FeedbackModule } from './feedback/feedback.module';

const ROUTES = [
    { path: '', loadChildren: 'app/layout/layout.module#LayoutModule' }, 
    { path: 'login', component: LoginComponent},
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        FileUploadModule,
        SharedModule,
        RouterModule.forRoot(ROUTES), // Add routes to the app
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "vi-VN" },
        AuthService, AuthGuardService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}
