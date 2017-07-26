import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ClassesComponent } from './classes.component';
import { TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';

const homeRoutes: Routes = [
  {
    path: '',
    component: ClassesComponent,
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
    ClassesComponent
  ],
  providers: []
})

export class ClassesModule {}
