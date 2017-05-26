import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { FileUploader } from "ng2-file-upload/ng2-file-upload";
import { read, IWorkBook } from "ts-xlsx";
import { IWorkSheet } from "xlsx";

import { AppConfig } from '../config';
@Injectable()
export class ExcelService {

    constructor(private http: Http) {}
    
}
