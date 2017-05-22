import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { StudentsComponent }    from './students.component';
import { StudentsListTableComponent } from './students-list-table/students-list-table.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { StudentHomePageComponent} from './student-home-page/student-home-page.component';
import { CoursesListTableComponent} from './courses-list-table/courses-list-table.component';
import { CoursesDetailTableComponent} from './courses-detail-table/courses-detail-table.component';
import { AbsenceRequestsTableComponent} from './absence-requests-table/absence-requests-table.component';
import { FeedbackTableComponent} from './feedback-table/feedback-table.component';

const studentsRoutes: Routes = [
  { path: 'students/dashboard', component: StudentHomePageComponent },
  { path: 'students/courses/:id', component: CoursesDetailTableComponent },
  { path: 'students/absence-requests', component: CoursesDetailTableComponent },
  { path: 'students/feedback', component: FeedbackTableComponent },
  { path: 'students',  component: StudentsComponent },
  { path: 'students/:id', component: StudentDetailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(studentsRoutes),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    StudentsComponent,
    StudentsListTableComponent,
    StudentDetailComponent,
    StudentHomePageComponent,
    CoursesListTableComponent,
    CoursesDetailTableComponent,
    AbsenceRequestsTableComponent,
    FeedbackTableComponent
  ],
  providers: []
})
export class StudentsModule {}
