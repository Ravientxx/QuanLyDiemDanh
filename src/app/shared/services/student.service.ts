import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable()
export class StudentService {
    // Resolve HTTP using the constructor
    constructor(private http: Http, private appConfig: AppConfig, private authService: AuthService,private router:Router) {}
        // private instance variable to hold base url
    private getListStudentsUrl = this.appConfig.apiHost + '/student/list';
    getListStudents(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none',sort_tag: string = '', program_id: number = 1, class_id: number = 0): Observable < { result: string, total_items: number, student_list: Array<any>, message:string } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
            'sort_tag': sort_tag,
            'program_id': program_id,
            'class_id': class_id
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.getListStudentsUrl, params,options)
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

    private getStudentDetailsUrl = this.appConfig.apiHost + '/student/detail';
    getStudentrDetail(id: number): Observable < { result: string, student: any, current_courses: Array<any>, message:string} > {
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${this.getStudentDetailsUrl}/${id}`,options)
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

    private addStudentUrl = this.appConfig.apiHost + '/student/add';
    addStudent(program_id: number, class_id:number, code: string , first_name: string, last_name: string, email: string, phone: string = null, note:string = null): Observable < { result: string, message: string } > {
        var params = {
            'program_id': program_id,
            'class_id': class_id,
            'code': code,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone,
            'note': note
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.addStudentUrl, params, options)
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
    private updateStudentInfoUrl = this.appConfig.apiHost + '/student/update';
    updateStudentInfo(id:number , first_name: string, last_name: string, email: string, phone: string = null, status:number): Observable < { result: string, message: string } > {
        var params = {
            'id': id,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone,
            'status': status
        };
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.updateStudentInfoUrl, params, options)
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
