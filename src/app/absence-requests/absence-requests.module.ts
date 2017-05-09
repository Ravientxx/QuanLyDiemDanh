import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import {StudentAbsenceRequestComponent} from './student/student-absence-request.component';
import { AbsenceRequestService } from './absence-request.service';

const teachersRoutes: Routes = [
  { path: 'absence-requests/student',  component: StudentAbsenceRequestComponent },
  //{ path: 'absence-requests/teacher', component: TeacherDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(teachersRoutes),
  ],
  declarations: [
  	StudentAbsenceRequestComponent
  ],
  providers: [
    AbsenceRequestService
  ]
})

export class AbsenceRequestsModule{}