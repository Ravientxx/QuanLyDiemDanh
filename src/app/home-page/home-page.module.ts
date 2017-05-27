import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { StudentHomePageComponent }    from './student/home-page/student-home-page.component';
import { StaffHomePageComponent } from './staff/staff-home-page.component';

import { CoursesListTableComponent } from './student/courses-list-table/courses-list-table.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';

const homeRoutes: Routes = [
  { path: 'dashboard',  component: HomePageComponent },
  { path: '',  component: HomePageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(homeRoutes),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    HomePageComponent,
    StudentHomePageComponent,
    StaffHomePageComponent,
    CoursesListTableComponent,
  ],
  providers: []
})

export class HomePageModule {}
