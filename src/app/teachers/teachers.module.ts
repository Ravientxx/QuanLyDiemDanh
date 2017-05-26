import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { TeachersComponent }    from './teachers.component';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

const teachersRoutes: Routes = [
  { path: 'teachers',  component: TeachersComponent },
  { path: 'teachers/:id', component: TeacherDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(teachersRoutes),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
  ],
  declarations: [
    TeachersComponent,
    TeacherDetailComponent
  ],
  providers: []
})
export class TeachersModule {}
