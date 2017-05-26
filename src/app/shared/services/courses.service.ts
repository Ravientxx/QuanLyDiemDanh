import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config'

@Injectable()
export class CourseService {
    // Resolve HTTP using the constructor
    constructor(private http: Http,private appConfig : AppConfig) {}
    private getCourseDetailsUrl = this.appConfig.apiHost + '/course/detail';
    getCourseDetail(id: number): Observable < { result: string, course: Array < any > , lecturers: Array < any > , TAs: Array < any > , class_has_course: Array < any > } > {
        return this.http.get(`${this.getCourseDetailsUrl}/${id}`)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    private getCurrentCourseListsUrl = this.appConfig.apiHost + '/course/list/current';
    getCurrentCourseLists(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none', program_id: number = 1, class_id: number = 0): Observable < { result: string, total_items: number, courses: Array < any > } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
            'program_id': program_id,
            'class_id': class_id,
        };
        return this.http.post(this.getCurrentCourseListsUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    private getPreviousCourseListsUrl = this.appConfig.apiHost + '/course/list/previous';
    getPreviousCourseLists(searchText: string = null, page: number = 1, limit: number = 10, sort: string = 'none', program_id: number = 1, class_id: number = 0): Observable < { result: string, total_items: number, courses: Array < any > } > {
        var params = {
            'searchText': searchText,
            'page': page,
            'limit': limit,
            'sort': sort,
            'program_id': program_id,
            'class_id': class_id,
        };
        return this.http.post(this.getPreviousCourseListsUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    private addCourseUrl = this.appConfig.apiHost + '/course/add';
    addCourse(code: string, name: string, lecturers: Array < any > , TAs: Array < any > , office_hour: string, note: string,
        program_id: number, class_id: number, isAddStudentFromCLass: boolean, isAddStudentFromFile: boolean, studentListFromFile: Array < any > = [], schedule: string): Observable < { result: string, message: string } > {
        var params = {
            code: code,
            name: name,
            lecturers: lecturers,
            TAs: TAs,
            office_hour: office_hour,
            note: note,
            program_id: program_id,
            class_id: class_id,
            isAddStudentFromCLass: isAddStudentFromCLass,
            isAddStudentFromFile: isAddStudentFromFile,
            studentListFromFile: studentListFromFile,
            schedule: schedule,
        };

        return this.http.post(this.addCourseUrl, params)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
