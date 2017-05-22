import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SideMenuComponent } from './layout/side-menu/side-menu.component';
import { TopNavigationComponent } from './layout/top-navigation/top-navigation.component';
import { PageNotFoundComponent } from './others/page-not-found.component';

import { HomePageModule } from './home-page/home-page.module';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AbsenceRequestsModule } from './absence-requests/absence-requests.module';

import {AppService} from './app.service';

const ROUTES = [
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HomePageModule,
    CoursesModule,
    StudentsModule,
    TeachersModule,
    ScheduleModule,
    AbsenceRequestsModule,
    RouterModule.forRoot(ROUTES), // Add routes to the app
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
