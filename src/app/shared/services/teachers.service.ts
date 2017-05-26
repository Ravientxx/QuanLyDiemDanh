import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config';

@Injectable()
export class TeacherService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appConfig: AppConfig) {}
        // private instance variable to hold base url
    private getListTeachersUrl = this.appConfig.apiHost + '/teacher/list';
    getListTeachers(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none'): Observable < { result: string, total_items: number, teacher_list: Array<any> } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
        };
        return this.http.post(this.getListTeachersUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private getTeacherDetailsUrl = this.appConfig.apiHost + '/teacher/detail';
    getTeacherDetail(id: number): Observable < { result: string, teacher: Array<any>, teaching_courses: Array<any>} > {
        return this.http.get(`${this.getTeacherDetailsUrl}/${id}`)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private addTeacherUrl = this.appConfig.apiHost + '/teacher/add';
    addTeacher(first_name: string, last_name: string, email: string, phone: string = null): Observable < { result: string, message: string } > {
        var params = {
            'first_name': first_name,
            'last_name': last_name,
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
