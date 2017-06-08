import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { StudentsComponent }    from './students.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {FileUploadModule} from "ng2-file-upload";
const studentsRoutes: Routes = [
  { path: '',  component: StudentsComponent },
  { path: ':id', component: StudentDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(studentsRoutes),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    FileUploadModule
  ],
  declarations: [
    StudentsComponent,
    StudentDetailComponent
  ],
  providers: []
})
export class StudentsModule {}
