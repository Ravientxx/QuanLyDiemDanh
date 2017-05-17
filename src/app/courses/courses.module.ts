import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CourseService } from './courses.service';

import { CollapseModule } from 'ngx-bootstrap';

import { CoursesComponent } from './courses.component'
import { CoursesListTableComponent } from './courses-list-table/courses-list-table.component'
import { CourseDetailComponent } from './course-detail/course-detail.component'
import { AttendanceListTableComponent } from './attendance-list-table/attendance-list-table.component'

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
    CoursesListTableComponent,
    CourseDetailComponent,
    AttendanceListTableComponent
  ],
  providers: [
    CourseService
  ]
})
export class CoursesModule {}
