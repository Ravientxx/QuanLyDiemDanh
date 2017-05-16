import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import * as globalVariables from './global-variable';
@Injectable()
export class AppService {
    // Event store
    private static _emitters: {
        [ID: string]: EventEmitter < any > } = {};
    // Set a new event in the store with a given ID
    // as key
    static get(ID: string): EventEmitter < any > {
        if (!this._emitters[ID])
            this._emitters[ID] = new EventEmitter();
        return this._emitters[ID];
    }

    constructor(private http: Http) {}
    
    private getSemesterProgramClassUrl = globalVariables.apiHost + '/semesters-programs-classes';
    getSemesterProgramClass(): Observable < { result: string, semesters: Array < any > , programs: Array < any > , classes: Array < any > } > {
        return this.http.get(this.getSemesterProgramClassUrl)
            // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
