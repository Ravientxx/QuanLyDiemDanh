import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config'

@Injectable()
export class AttendanceService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appConfig: AppConfig) {}
    private getAttendanceListByCourseUrl = this.appConfig.apiHost + '/attendance/list-by-course';
    getAttendanceListByCourse(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none', sort_tag: string = '', course_id: number = 0): Observable < { result: string, total_items: number, attendance_list: Array<any>} > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
            'sort_tag': sort_tag,
            'course_id': course_id,
        };
        return this.http.post(this.getAttendanceListByCourseUrl,params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}