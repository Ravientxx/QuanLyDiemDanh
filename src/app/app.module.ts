import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedModule, PageNotFoundComponent } from './shared/shared.module';

import { HomePageModule } from './home-page/home-page.module';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AbsenceRequestsModule } from './absence-requests/absence-requests.module';
import { FeedbackModule } from './feedback/feedback.module';

const ROUTES = [
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    HomePageModule,
    CoursesModule,
    StudentsModule,
    TeachersModule,
    ScheduleModule,
    AbsenceRequestsModule,
    FeedbackModule,
    RouterModule.forRoot(ROUTES), // Add routes to the app
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
