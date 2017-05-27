import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config'

@Injectable()
export class AppService {

    constructor(private http: Http,private appConfig : AppConfig) {}
    
    private getSemesterProgramClassUrl = this.appConfig.apiHost + '/semesters-programs-classes';
    getSemesterProgramClass(): Observable < { result: string, semesters: Array < any > , programs: Array < any > , classes: Array < any > } > {
        return this.http.get(this.getSemesterProgramClassUrl)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    navigationData = {
        current_teacher_id : 0,
        current_student_id : 0,
    }

    public current_userType = 3; 
    public userType = { student: 1, teacher: 2, staff: 3};
}
