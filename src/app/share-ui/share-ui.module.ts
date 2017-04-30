import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableDemoComponent } from './table-layout.component';
@NgModule({
    imports: [ CommonModule ],
    declarations: [ TableDemoComponent ],
    exports: [
        CommonModule, 
        TableDemoComponent 
    ]
})
export class SharedModule { }