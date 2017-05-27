import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap';

import { CoursesComponent } from './courses.component'
import { AddCourseComponent } from './add-course/add-course.component'
import { CourseDetailComponent } from './course-detail/course-detail.component'
import { EditCourseComponent } from './edit-course/edit-course.component'

import { TooltipModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';


const coursesRoutes: Routes = [
  { path: 'courses',  component: CoursesComponent },
  { path: 'courses/add', component: AddCourseComponent },
  { path: 'courses/:id', component: CourseDetailComponent },
  { path: 'courses/:id/edit', component: EditCourseComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(coursesRoutes),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    CoursesComponent,
    CourseDetailComponent,
    AddCourseComponent,
    EditCourseComponent
  ],
  providers: []
})

export class CoursesModule {}
