import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AbsenceRequestService } from './absence-request.service';

import { AbsenceRequestsComponent } from './absence-requests.component';
import { StudentAbsenceRequestsTableComponent } from './student/absence-requests-table/student-absence-requests-table.component';
import { StaffStudentAbsenceRequestsComponent } from './staff/student/staff-student-absence-requests.component';
//import { TeacherAbsenceRequestsComponent } from './staff/teacher/staff-teacher-absence-requests.component';

import { CollapseModule } from 'ngx-bootstrap';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

const AbsenceRequestsRoutes: Routes = [
  { path: 'absence-requests',  component: AbsenceRequestsComponent },
  { path: 'absence-requests/student',  component: StaffStudentAbsenceRequestsComponent },
  //{ path: 'absence-requests/teacher', component: TeacherAbsenceRequestsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AbsenceRequestsRoutes),
    CollapseModule.forRoot(),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    AbsenceRequestsComponent,
  	StaffStudentAbsenceRequestsComponent,
    StudentAbsenceRequestsTableComponent,
  ],
  providers: [
    AbsenceRequestService
  ]
})

export class AbsenceRequestsModule{}
