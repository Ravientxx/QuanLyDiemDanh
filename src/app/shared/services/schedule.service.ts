import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config';

@Injectable()
export class ScheduleService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appConfig: AppConfig) {}
    private updateScheduleUrl = this.appConfig.apiHost + '/schedule/detail/';
    updateSchedule(course_id: number, class_id: number, schedule: Array<any>): Observable < { result: string} > {
        var params = {
            'course_id': course_id,
            'class_id': class_id,
            'schedule' : schedule
        };
        return this.http.put(this.updateScheduleUrl,params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}