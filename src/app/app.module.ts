import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SharedModule, PageNotFoundComponent } from './shared/shared.module';

import { HomePageComponent } from './home-page/home-page.component';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AbsenceRequestsModule } from './absence-requests/absence-requests.module';

const ROUTES = [
  {
    path: '',
    component: HomePageComponent
  },
    {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    CoursesModule,
    StudentsModule,
    TeachersModule,
    ScheduleModule,
    AbsenceRequestsModule,
    RouterModule.forRoot(ROUTES), // Add routes to the app
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
