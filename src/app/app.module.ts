import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SideMenuComponent } from './layout/side-menu/side-menu.component';
import { TopNavigationComponent } from './layout/top-navigation/top-navigation.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PageNotFoundComponent } from './others/page-not-found.component';

import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AbsenceRequestsModule } from './absence-requests/absence-requests.module';

import {AppService} from './app.service';

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
    FooterComponent,
    SideMenuComponent,
    TopNavigationComponent,
    HomePageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
