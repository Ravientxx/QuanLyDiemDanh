import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SemestersComponent } from './semesters.component';
import { TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';

const homeRoutes: Routes = [
  {
    path: '',
    component: SemestersComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(homeRoutes),
    SharedModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    SemestersComponent
  ],
  providers: []
})

export class SemestersModule {}
