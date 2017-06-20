import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardStudentComponent } from './dashboard-student/dashboard-student.component';
import { DashboardStaffComponent } from './dashboard-staff/dashboard-staff.component';
import { DashboardTeacherComponent } from './dashboard-teacher/dashboard-teacher.component';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../shared/shared.module';
const homeRoutes: Routes = [
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(homeRoutes),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    DashboardStaffComponent,
    DashboardStudentComponent,
    DashboardTeacherComponent
  ],
  providers: []
})

export class DashboardModule {}
