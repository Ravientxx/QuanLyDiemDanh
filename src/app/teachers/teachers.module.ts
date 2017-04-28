import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { TeachersComponent }    from './teachers.component';
import { TeachersListTableComponent } from './teachers-list-table/teachers-list-table.component';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
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
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    TeachersComponent,
    TeachersListTableComponent,
    TeacherDetailComponent
  ],
  providers: []
})
export class TeachersModule {}
