import { Component, OnInit } from '@angular/core';
import { ScheduleService, AppService, SemesterService } from '../shared/shared.module';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {

    public constructor(public  scheduleService: ScheduleService, public  appService: AppService, public  router: Router, public  semesterService: SemesterService) {}

    public ngOnInit() {
    }
}
