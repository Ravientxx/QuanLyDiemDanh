import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config'
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable()
export class CourseService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfig: AppConfig,private authService: AuthService,private router :Router) {}

    private getCourseDetailsUrl = this.appConfig.apiHost + '/course/detail';
    getCourseDetail(id: number): Observable < { result: string, course: any , lecturers: Array < any > , TAs: Array < any > , class_has_course: Array < any > , message:string} > {
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${this.getCourseDetailsUrl}/${id}`,options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }

    private getCurrentCourseListsUrl = this.appConfig.apiHost + '/course/list/current';
    getCurrentCourseLists(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none', program_id: number = 1, class_id: number = 0): Observable < { result: string, total_items: number, courses: Array < any >, message:string } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
            'program_id': program_id,
            'class_id': class_id,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getCurrentCourseListsUrl, params, options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private getPreviousCourseListsUrl = this.appConfig.apiHost + '/course/list/previous';
    getPreviousCourseLists(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none', program_id: number = 1, class_id: number = 0): Observable < { result: string, total_items: number, courses: Array < any >, message:string } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
            'program_id': program_id,
            'class_id': class_id,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getPreviousCourseListsUrl, params, options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private addCourseUrl = this.appConfig.apiHost + '/course/add';
    addCourse(code: string, name: string, lecturers: Array < any > , TAs: Array < any > , office_hour: string, note: string,
        program_id: number, classes: Array < any > ): Observable < { result: string, message: string } > {
        var params = {
            code: code,
            name: name,
            lecturers: lecturers,
            TAs: TAs,
            office_hour: office_hour,
            note: note,
            program_id: program_id,
            classes: classes,
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.addCourseUrl, params, options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    private editCourseUrl = this.appConfig.apiHost + '/course/edit';
    editCourse(id:number ,code: string, name: string, lecturers: Array < any > , TAs: Array < any > , office_hour: string, note: string): Observable < { result: string, message: string } > {
        var params = {
            id: id,
            code: code,
            name: name,
            lecturers: lecturers,
            TAs: TAs,
            office_hour: office_hour,
            note: note
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.editCourseUrl, params, options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => {
                if(error.status == 401){
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
}
