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

    readStudentEnrollCourseFile(file: any): Observable < { result: string, student_list: Array < any > , message: string } > {
        return new Observable < any > ((observer) => {
                let reader: FileReader = new FileReader();
                reader.onload = function(e: any) {
                    var binaryString = e.target.result;
                    var wb: IWorkBook = read(binaryString, { type: 'binary' });
                    observer.next(wb);
                };
                reader.readAsBinaryString(file);
                return () => {
                    reader.abort();
                };
            }).map((wb: IWorkBook) => {
                return wb.SheetNames.map((sheetName: string) => {
                    let sheet: IWorkSheet = wb.Sheets[sheetName];
                    var i = 1;
                    while (sheet['A' + i] !== undefined) {
                        if (sheet['A' + i].v == 'STT') {
                            i++;
                            break;
                        }
                        i++;
                    }
                    var students: Array < any > = [];
                    while (sheet['A' + i] !== undefined) {
                        var desired_cell;
                        var desired_value;
                        desired_cell = sheet['B' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var B = desired_value;
                        if (B == undefined) {
                            return { result: 'failure', message: 'File content error : ' + file['name'] };
                        }
                        desired_cell = sheet['C' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var C = desired_value;

                        var student = {
                            'stt': sheet['A' + i].v,
                            'stud_id': B,
                            'name': C,
                        };
                        students.push(student);
                        i++;
                    }
                    return { result: 'success', student_list: students };

                });
            })
            .catch((error: any) => Observable.of({ result: 'failure', message: error }));
    }
    importStudents(file: any): Observable < { result: string, message: string } > {
        return new Observable < any > ((observer) => {
                let reader: FileReader = new FileReader();
                reader.onload = function(e: any) {
                    var binaryString = e.target.result;
                    var wb: IWorkBook = read(binaryString, { type: 'binary' });
                    observer.next(wb);
                };
                reader.readAsBinaryString(file);
                return () => {
                    reader.abort();
                };
            }).map((wb: IWorkBook) => {
                return wb.SheetNames.map((sheetName: string) => {
                    let sheet: IWorkSheet = wb.Sheets[sheetName];
                    var i = 1;
                    while (sheet['A' + i] !== undefined) {
                        if (sheet['A' + i].v == 'STT') {
                            i++;
                            break;
                        }
                        i++;
                    }
                    var students: Array < any > = [];
                    while (sheet['A' + i] !== undefined) {
                        var desired_cell;
                        var desired_value;
                        desired_cell = sheet['B' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var B = desired_value;
                        if (B == undefined) {
                            return { result: 'failure', message: 'File content error : ' + file['name'] };
                        }
                        desired_cell = sheet['C' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var C = desired_value;

                        var student = {
                            'stt': sheet['A' + i].v,
                            'stud_id': B,
                            'name': C,
                        };
                        students.push(student);
                        i++;
                    }
                    return { result: 'success', student_list: students };

                });
            })
            .catch((error: any) => Observable.of({ result: 'failure', message: error }));
    }
}
