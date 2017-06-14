import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap';

import { FeedbackComponent } from './feedback.component';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule
  ],
  declarations: [
    FeedbackComponent,
  ],
  providers: [
  ]
})

export class FeedbackModule {}
