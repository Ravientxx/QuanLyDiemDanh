import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import * as globalVariables from '../global-variable';

@Injectable()
export class FeedbackService {
    // Resolve HTTP using the constructor
    constructor(private http: Http) {}
        // private instance variable to hold base url
    // private getListTeachersUrl = globalVariables.apiHost + '/teacher/list';
    // getListTeachers(searchText: string = null, page: number = 1, limit: number = 10): Observable < { result: string, } > {

    //     return this.http.get(this.getListTeachersUrl)
    //         // ...and calling .json() on the response to return data
    //         .map((res: Response) => res.json())
    //         //...errors if any
    //         .catch((error: any) => Observable.throw(error || 'Server error'));
    // }
    private getCourseDetailsUrl = globalVariables.apiHost + '/course/detail';
    getCourseDetail(id: number): Observable < { result: string, course: Array<any>, lecturers: Array<any>, TAs: Array<any>} > {
        return this.http.get(`${this.getCourseDetailsUrl}/${id}`)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}