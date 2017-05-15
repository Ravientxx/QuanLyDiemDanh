import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Teacher } from './teacher.model';
import { Observable } from 'rxjs';

import * as globalVariables from '../global-variable';

@Injectable()
export class TeacherService {
    // Resolve HTTP using the constructor
    constructor(private http: Http) {}
        // private instance variable to hold base url
    private getListTeachersUrl = globalVariables.apiHost + '/teacher/list';
    getListTeachers(searchText: string = null, page: number = 1, limit: number = 10): Observable < { result: string, total_items: number, teacher_list: Teacher[] } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit
        };
        return this.http.post(this.getListTeachersUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private getTeacherDetailsUrl = globalVariables.apiHost + '/teacher/detail';
    getTeacherDetail(id: number): Observable < { result: string, teacher: Teacher} > {
        return this.http.get(`${this.getTeacherDetailsUrl}/${id}`)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private addTeacherUrl = globalVariables.apiHost + '/teacher/add';
    addTeacher(name: string, email: string, phone: string = null): Observable < { result: string, message: string } > {
        var params = {
            'name': name,
            'email': email,
            'phone': phone
        };
        return this.http.post(this.addTeacherUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
