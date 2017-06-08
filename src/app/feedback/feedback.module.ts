import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FeedbackService } from './feedback.service';

import { CollapseModule } from 'ngx-bootstrap';

import { FeedbackComponent } from './feedback.component';
import { FeedbackDetailComponent } from './feedback-detail.component';

//import { StaffCoursesListTableComponent } from './staff/courses-list-table/staff-courses-list-table.component';
//import { StaffCoursesListComponent } from './staff/courses-list/staff-courses-list.component';
//import { StaffCourseDetailTableComponent } from './staff/course-detail/staff-course-detail-table.component';
//import { StaffAttendanceListTableComponent } from './staff/attendance-list-table/staff-attendance-list-table.component';

import { StudentFeedbackTableComponent } from './student/feedback-table/student-feedback-table.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

const feedbackRoutes: Routes = [
  { path: '',  component: FeedbackComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(feedbackRoutes),
    CollapseModule.forRoot(),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    FeedbackComponent,
    FeedbackDetailComponent,
    StudentFeedbackTableComponent
  ],
  providers: [
    FeedbackService
  ]
})

export class FeedbackModule {}
