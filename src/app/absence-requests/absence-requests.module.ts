import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AbsenceRequestsComponent } from './absence-requests.component';
import { TableDemoComponent } from '../share-ui/table-layout.component';


const AbsenceRequestsRoutes: Routes = [
  { path: 'absence-requests',  component: AbsenceRequestsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AbsenceRequestsRoutes),
    Ng2TableModule,
    PaginationModule.forRoot(),
    TabsModule,
  ],
  declarations: [
    AbsenceRequestsComponent,
    TableDemoComponent
  ],
  providers: []
})
export class AbsenceRequestsModule {}
