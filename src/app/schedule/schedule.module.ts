import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap';
import { ScheduleComponent }    from './schedule.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {FileUploadModule} from "ng2-file-upload";
import { ScheduleUploadComponent } from './schedule-upload/schedule-upload.component';
import { ScheduleService } from './schedule.service';

const scheduleRoutes: Routes = [
  { path: 'schedule',  component: ScheduleComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(scheduleRoutes),
    Ng2TableModule,
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule,
    FileUploadModule,
  ],
  declarations: [
    ScheduleComponent,
    ScheduleUploadComponent,
  ],
  providers: [
    ScheduleService,
  ]
})
export class ScheduleModule {}
