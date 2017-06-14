import { Component, OnInit } from '@angular/core';
import { ScheduleService, AppService, SemesterService } from '../shared/shared.module';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {

    constructor(private scheduleService: ScheduleService, private appService: AppService, private router: Router, private semesterService: SemesterService) {}

    ngOnInit() {
    }
}
