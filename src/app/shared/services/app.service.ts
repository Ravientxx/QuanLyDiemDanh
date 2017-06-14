import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from '../config'
import { AuthService } from './auth.service'
declare var PNotify: any;
declare var jQuery: any;
@Injectable()
export class AppService {

    constructor(private http: Http, private appConfig: AppConfig, private authService: AuthService, private router: Router) {}

    private getSemesterProgramClassUrl = this.appConfig.apiHost + '/semesters-programs-classes';
    getSemesterProgramClass(): Observable < { result: string, semesters: Array < any > , programs: Array < any > , classes: Array < any > , message: string } > {
        let authToken = this.authService.token;
        let headers = new Headers();
        headers.append('x-access-token', `${authToken}`);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.getSemesterProgramClassUrl, options)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            //.catch((error: any) => Observable.throw(error || 'Server error'));
            .catch((error: any) => {
                if (error.status == 401) {
                    this.authService.tokenExpired(this.router.url);
                }
                return Observable.throw(error || 'Server error');
            });
    }
    showPNotify(title,message,type) {
        new PNotify({
            title: title,
            text: message,
            type: type,
            delay: 3000,
            animation: "fade",
            styling: 'fontawesome',
            buttons: { closer: true, sticker: false},
            stack: { "dir1": "down", "dir2": "right", "firstpos1": 25, "firstpos2": (jQuery(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2) }
        });
    }
    public student_status = {
        active: {
            id: 0,
            title: 'Active'
        },
        reserved: {
            id: 1,
            title: 'Reserved'
        },
        dropped: {
            id: 2,
            title: 'Dropped'
        }
    };
    public absence_request_status = {
        new: {
            id: 0,
            title: 'New'
        },
        accepted: {
            id: 1,
            title: 'Accepted'
        },
        rejected: {
            id: 2,
            title: 'Rejected'
        },
    }
    public enrollment_status = { compulsory: 0, elective: 1 };
    public attendance_status = { normal: 0, exemption: 1 };
    public userType = {admin :0, student: 1, teacher: 2, staff: 3 };
}
