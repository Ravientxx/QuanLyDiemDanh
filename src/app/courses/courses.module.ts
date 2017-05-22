import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CourseService } from './courses.service';

import { CollapseModule } from 'ngx-bootstrap';

import { CoursesComponent } from './courses.component';
import { CourseDetailComponent } from './course-detail.component';

import { StaffCoursesListTableComponent } from './staff/courses-list-table/staff-courses-list-table.component';
import { StaffCoursesListComponent } from './staff/courses-list/staff-courses-list.component';
import { StaffCourseDetailTableComponent } from './staff/course-detail/staff-course-detail-table.component';
import { StaffAttendanceListTableComponent } from './staff/attendance-list-table/staff-attendance-list-table.component';

import { StudentCoursesDetailTableComponent } from './student/course-detail/student-course-detail-table.component';
//import { StudentHomePageComponent } from '../home-page/student/home-page/student-home-page.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

const coursesRoutes: Routes = [
  { path: 'courses',  component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(coursesRoutes),
    CollapseModule.forRoot(),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    CoursesComponent,
    CourseDetailComponent,
    StaffCoursesListComponent,
    StaffCoursesListTableComponent,
    StaffCourseDetailTableComponent,
    StaffAttendanceListTableComponent,
    StudentCoursesDetailTableComponent,
    //StudentHomePageComponent,
  ],
  providers: [
    CourseService
  ]
})

export class CoursesModule {}
