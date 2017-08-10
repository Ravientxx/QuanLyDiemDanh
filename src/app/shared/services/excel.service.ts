import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { FileUploader } from "ng2-file-upload/ng2-file-upload";
import * as XLSX from 'xlsx';
declare var XlsxPopulate : any; 
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import * as Async from 'async';

import { AppConfig } from '../config';
import { AppService } from './app.service';
@Injectable()
export class ExcelService {

    public constructor(public http: Http,public appService: AppService) {}
    public s2ab(s): any {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    public readStudentListFile(file: any): Observable < { result: string, student_list: Array < any > , message: string } > {
        return new Observable < any > ((observer) => {
                XlsxPopulate.fromDataAsync(file)
                .then(workbook => {
                    observer.next(workbook.sheet(0));
                });
            }).map((sheet: any) => {
                var cells = sheet.usedRange().value();
                var import_start = 0;
                var student_list = [];
                for(var i = 0 ; i < cells.length; i++){
                    if(cells[i][0] == 'STT'){
                        import_start = i+1;
                        break;
                    }
                }
                for(var i = import_start; i < cells.length; i++){
                    var student = {
                        stt : cells[i][0],
                        stud_id : cells[i][1],
                        name : cells[i][2],
                        phone : cells[i][2],
                    }
                    student_list.push(student);
                }
                return { result: 'success', message: 'success', student_list : student_list};
            }).catch((error: any) => Observable.of({ result: 'failure', message: error }));
    }

    public writeStudentSearchList(student_list: any, file_name: string) {
        XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            workbook.sheet("Sheet1").cell("A1").value("Danh sách sinh viên " + student_list[0].class_name).style("horizontalAlignment", "center");

            workbook.sheet("Sheet1").cell("A3").value("STT").style("border", true).style("horizontalAlignment", "center");
            workbook.sheet("Sheet1").cell("B3").value("MSSV").style("border", true).style("horizontalAlignment", "center");
            workbook.sheet("Sheet1").cell("C3").value("Họ Tên").style("border", true).style("horizontalAlignment", "center");
            workbook.sheet("Sheet1").cell("D3").value("SĐT").style("border", true).style("horizontalAlignment", "center");
            workbook.sheet("Sheet1").cell("E3").value("Lớp").style("border", true).style("horizontalAlignment", "center");

            for (var i = 0; i < student_list.length; i++) {
                workbook.sheet("Sheet1").cell("A" + Math.floor(i + 4)).value(i + 1).style("border", true);
                workbook.sheet("Sheet1").cell("B" + Math.floor(i + 4)).value(student_list[i].code).style("border", true);
                workbook.sheet("Sheet1").cell("C" + Math.floor(i + 4)).value(student_list[i].name).style("border", true);
                workbook.sheet("Sheet1").cell("D" + Math.floor(i + 4)).value(student_list[i].phone).style("border", true);
                workbook.sheet("Sheet1").cell("E" + Math.floor(i + 4)).value(student_list[i].class_name).style("border", true);
            }
            workbook.sheet(0).range("A1:E1").merged(true);
            const range = workbook.sheet(0).range("A1:Y"+Math.floor(student_list.length+4));
            return workbook.outputAsync()
                .then(function (blob) {
                    if (file_name == '') file_name = 'students';
                    FileSaver.saveAs(blob, file_name + ".xlsx");
                });
        });
    }

    public writeStudentLists(student_lists: any) {
        var zip = new JSZip();
        Async.each(student_lists, function(student_list,callback){
             XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("Danh sách sinh viên " + student_list[0].class_name).style("horizontalAlignment", "center");

                workbook.sheet("Sheet1").cell("A3").value("STT").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("B3").value("MSSV").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("C3").value("Họ Tên").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("D3").value("SĐT").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("E3").value("Lớp").style("border", true).style("horizontalAlignment", "center");

                for (var i = 0; i < student_list.length; i++) {
                    workbook.sheet("Sheet1").cell("A" + Math.floor(i + 4)).value(i + 1).style("border", true);
                    workbook.sheet("Sheet1").cell("B" + Math.floor(i + 4)).value(student_list[i].code).style("border", true);
                    workbook.sheet("Sheet1").cell("C" + Math.floor(i + 4)).value(student_list[i].name).style("border", true);
                    workbook.sheet("Sheet1").cell("D" + Math.floor(i + 4)).value(student_list[i].phone).style("border", true);
                    workbook.sheet("Sheet1").cell("E" + Math.floor(i + 4)).value(student_list[i].class_name).style("border", true);
                }
                workbook.sheet(0).range("A1:E1").merged(true);
                const range = workbook.sheet(0).range("A1:Y"+Math.floor(student_list.length+4));
                return workbook.outputAsync()
                    .then(function (blob) {
                        zip.file(student_list[0].class_name + ".xlsx", blob);
                        callback();
                    });
            });
        }, function(error) {
            if (error) {
                console.log(error);
            } else {
                zip.generateAsync({ type: "blob" })
                .then(function(content) {
                    FileSaver.saveAs(content, "students.zip");
                });  
            }
        });
    }

    public writeExamineesLists(student_lists: any, class_has_courses: any) {
        var zip = new JSZip();
        Async.eachOf(student_lists, function(student_list,index,callback){
            var class_has_course = class_has_courses[index];
            XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("Trường Đại học Khoa học Tự nhiên - TP.HCM");
                workbook.sheet("Sheet1").cell("A2").value("Khoa Công Nghệ Thông Tin");
                workbook.sheet("Sheet1").cell("A3").value("BẢNG ĐIỂM TỔNG KẾT MÔN").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("A4").value("Học kỳ: " + class_has_course.semester);
                workbook.sheet("Sheet1").cell("A5").value('Chương trình: ' + class_has_course.program);
                workbook.sheet("Sheet1").cell("H5").value('Lớp: ' + class_has_course.class_name);
                workbook.sheet("Sheet1").cell("A6").value('Môn: ' + class_has_course.code + ' - ' + class_has_course.name);
                workbook.sheet("Sheet1").cell("H6").value('Ngày thi: ');
                workbook.sheet("Sheet1").cell("A7").value('Giảng viên: ' + class_has_course.lecturers);
                workbook.sheet("Sheet1").cell("H7").value('Phòng: ');
                
                workbook.sheet("Sheet1").cell("A8").value("STT").style("border", true);
                workbook.sheet("Sheet1").cell("B8").value("MSSV").style("border", true);
                workbook.sheet("Sheet1").cell("C8").value("Họ SV").style("border", true);
                workbook.sheet("Sheet1").cell("D8").value("Tên SV").style("border", true);
                workbook.sheet("Sheet1").cell("E8").value("Số tờ").style("border", true);
                workbook.sheet("Sheet1").cell("F8").value("Ký tên").style("border", true);
                workbook.sheet("Sheet1").cell("G8").value("Điểm CK").style("border", true);
                workbook.sheet("Sheet1").cell("H8").value("Điểm TK").style("border", true);
                workbook.sheet("Sheet1").cell("I8").value("Ghi chú").style("border", true);

                for (var i = 0; i < student_list.length; i++) {
                    workbook.sheet("Sheet1").cell("A" + Math.floor(i + 9)).value(i + 1).style("border", true);
                    workbook.sheet("Sheet1").cell("B" + Math.floor(i + 9)).value(student_list[i].student_code).style("border", true);
                    workbook.sheet("Sheet1").cell("C" + Math.floor(i + 9)).value(student_list[i].first_name).style("border", true);
                    workbook.sheet("Sheet1").cell("D" + Math.floor(i + 9)).value(student_list[i].last_name).style("border", true);
                }

                workbook.sheet("Sheet1").cell("A" + Math.floor(student_list.length + 11)).value('Giảng viên: ...................................');
                workbook.sheet("Sheet1").cell("A" + Math.floor(student_list.length + 12)).value('Ngày: ................................');

                workbook.sheet(0).range("A3:I3").merged(true);

                const range = workbook.sheet(0).range("A1:I"+Math.floor(student_list.length+12));
                return workbook.outputAsync()
                    .then(function (blob) {
                        zip.file(class_has_course.code + ' - ' + class_has_course.name + ' - ' + class_has_course.class_name + ".xlsx", blob);
                        callback();
                    });
            });
        }, function(error) {
            if (error) {
                console.log(error);
            } else {
                zip.generateAsync({ type: "blob" })
                .then(function(content) {
                    FileSaver.saveAs(content, "examinees.zip");
                });  
            }
        });
    }

    public writeAttendanceSummary(student_lists: any, class_has_courses: any) {
        var zip = new JSZip();
        Async.eachOf(student_lists, function(student_list,index,callback){
            var class_has_course = class_has_courses[index];
            XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value('Danh Sách Sinh Viên Môn ' + class_has_course.code + ' - ' + class_has_course.name);
                workbook.sheet("Sheet1").cell("A2").value("Học kỳ: " + class_has_course.semester);
                workbook.sheet("Sheet1").cell("A3").value('Giảng viên: ' + class_has_course.lecturers);
                
                workbook.sheet("Sheet1").cell("A5").value("STT").style("border", true);
                workbook.sheet("Sheet1").cell("B5").value("MSSV").style("border", true);
                workbook.sheet("Sheet1").cell("C5").value("Họ SV").style("border", true);
                workbook.sheet("Sheet1").cell("D5").value("Tên SV").style("border", true);
                workbook.sheet("Sheet1").cell("E5").value("Số buổi vắng").style("border", true);
                workbook.sheet("Sheet1").cell("F5").value("Số % buổi vắng").style("border", true);

                for (var i = 0; i < student_list.length; i++) {
                    workbook.sheet("Sheet1").cell("A" + Math.floor(i + 6)).value(i + 1).style("border", true);
                    workbook.sheet("Sheet1").cell("B" + Math.floor(i + 6)).value(student_list[i].student_code).style("border", true);
                    workbook.sheet("Sheet1").cell("C" + Math.floor(i + 6)).value(student_list[i].first_name).style("border", true);
                    workbook.sheet("Sheet1").cell("D" + Math.floor(i + 6)).value(student_list[i].last_name).style("border", true);
                    workbook.sheet("Sheet1").cell("E" + Math.floor(i + 6)).value(student_list[i].absent_count).style("border", true);
                    workbook.sheet("Sheet1").cell("F" + Math.floor(i + 6)).value(student_list[i].absent_percentage).style("border", true);
                }

                const range = workbook.sheet(0).range("A1:F"+Math.floor(student_list.length+6));
                return workbook.outputAsync()
                    .then(function (blob) {
                        zip.file(class_has_course.code + ' - ' + class_has_course.name + ' - ' + class_has_course.class_name + ".xlsx", blob);
                        callback();
                    });
            });
        }, function(error) {
            if (error) {
                console.log(error);
            } else {
                zip.generateAsync({ type: "blob" })
                .then(function(content) {
                    FileSaver.saveAs(content, "attendance_summary.zip");
                });  
            }
        });
    }






    public readTeacherListFile(file: any): Observable < { result: string, teacher_list: Array < any > , message: string } > {
        return new Observable < any > ((observer) => {
                let reader: FileReader = new FileReader();
                reader.onload = function(e: any) {
                    var binaryString = e.target.result;
                    var wb: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });
                    observer.next(wb);
                };
                reader.readAsBinaryString(file);
                return () => {
                    reader.abort();
                };
            }).map((wb: XLSX.WorkBook) => {
                return wb.SheetNames.map((sheetName: string) => {
                    let sheet: XLSX.WorkSheet = wb.Sheets[sheetName];
                    var i = 1;
                    while (sheet['A' + i] !== undefined) {
                        if (sheet['A' + i].v.toLowerCase() == 'stt') {
                            i++;
                            break;
                        }
                        i++;
                    }
                    var teachers: Array < any > = [];
                    while (sheet['A' + i] !== undefined) {
                        var desired_cell;
                        var desired_value;
                        desired_cell = sheet['B' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var B = desired_value;

                        desired_cell = sheet['C' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var C = desired_value;

                        if (B == undefined && C == undefined) {
                            return { result: 'failure', message: 'Teacher name is required at line ' + i + ' : ' + file['name'] };
                        }

                        desired_cell = sheet['D' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var D = desired_value;

                        desired_cell = sheet['E' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var E = desired_value;

                        if (E == undefined) {
                            return { result: 'failure', message: 'Teacher email is required at line ' + i + ' : ' + file['name'] };
                        }

                        var teacher = {
                            'stt': sheet['A' + i].v,
                            'first_name': B,
                            'last_name': C,
                            'phone': D,
                            'email': E
                        };
                        teachers.push(teacher);
                        i++;
                    }
                    return { result: 'success', message: 'Success', teacher_list: teachers };
                });
            })
            .catch((error: any) => Observable.of({ result: 'failure', message: error }));
    }
    public writeTeacherSearchList(teacher_list: any, file_name: string) {
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("STT").style("border", true);
                workbook.sheet("Sheet1").cell("B1").value("Họ").style("border", true);
                workbook.sheet("Sheet1").cell("C1").value("Tên").style("border", true);
                workbook.sheet("Sheet1").cell("D1").value("SĐT").style("border", true);
                workbook.sheet("Sheet1").cell("E1").value("Email").style("border", true);
                for (var i = 0; i < teacher_list.length; i++) {
                    workbook.sheet("Sheet1").cell("A" + Math.floor(i + 2)).value(i + 2).style("border", true);
                    workbook.sheet("Sheet1").cell("B" + Math.floor(i + 2)).value(teacher_list[i].first_name).style("border", true);
                    workbook.sheet("Sheet1").cell("C" + Math.floor(i + 2)).value(teacher_list[i].last_name).style("border", true);
                    workbook.sheet("Sheet1").cell("D" + Math.floor(i + 2)).value(teacher_list[i].phone).style("border", true);
                    workbook.sheet("Sheet1").cell("E" + Math.floor(i + 2)).value(teacher_list[i].email).style("border", true);
                }
                const range = workbook.sheet(0).range("A1:E"+Math.floor(teacher_list.length+1));
                return workbook.outputAsync()
                    .then(function (blob) {
                        if (file_name == '') file_name = 'teachers';
                        FileSaver.saveAs(blob, file_name + ".xlsx");
                    });
            });
    }


    public readCourseListFile(file: any): Observable < { result: string, course_list: Array < any > , message: string } > {
        return new Observable < any > ((observer) => {
                let reader: FileReader = new FileReader();
                reader.onload = function(e: any) {
                    var binaryString = e.target.result;
                    var wb: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });
                    observer.next(wb);
                };
                reader.readAsBinaryString(file);
                return () => {
                    reader.abort();
                };
            }).map((wb: XLSX.WorkBook) => {
                return wb.SheetNames.map((sheetName: string) => {
                    let sheet: XLSX.WorkSheet = wb.Sheets[sheetName];
                    var i = 1;
                    while (sheet['A' + i] !== undefined) {
                        if (sheet['A' + i].v.toLowerCase() == 'stt') {
                            i++;
                            break;
                        }
                        i++;
                    }
                    var courses: Array < any > = [];
                    while (sheet['A' + i] !== undefined) {
                        var desired_cell;
                        var desired_value;
                        desired_cell = sheet['B' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var B = desired_value;
                        if (B == undefined) {
                            return { result: 'failure', message: 'Course code required at line ' + i + ' : ' + file['name'] };
                        }
                        desired_cell = sheet['C' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var C = desired_value;
                        if (C == undefined) {
                            return { result: 'failure', message: 'Course name required at line ' + i + ' : ' + file['name'] };
                        }
                        desired_cell = sheet['D' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var D = desired_value;
                        if (D == undefined) {
                            return { result: 'failure', message: 'Lecturers required at line ' + i + ' : ' + file['name'] };
                        } else {
                            D = D.split('\r\n');
                        }
                        desired_cell = sheet['E' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var E = desired_value;
                        if (E != undefined && E != NaN) E = E.split('\r\n');

                        desired_cell = sheet['F' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var F = desired_value;

                        desired_cell = sheet['G' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var G = desired_value;

                        var course = {
                            'stt': sheet['A' + i].v,
                            'code': B,
                            'name': C,
                            'lecturers': D,
                            'TAs': E,
                            'office_hour': F,
                            'note': G,
                        };
                        courses.push(course);
                        i++;
                    }
                    return { result: 'success', message: 'Success', course_list: courses };
                });
            })
            .catch((error: any) => Observable.of({ result: 'failure', message: error }));
    }
    public writeCourseSearchList(course_list: any, file_name: string) {
        var ws_name = "Sheet1";
        var wb = { SheetNames: [], Sheets: {} };
        wb.SheetNames.push(ws_name);
        var ws = {};
        ws[XLSX.utils.encode_cell({ c: 0, r: 0 })] = { v: 'STT' };
        ws[XLSX.utils.encode_cell({ c: 1, r: 0 })] = { v: 'Mã môn' };
        ws[XLSX.utils.encode_cell({ c: 2, r: 0 })] = { v: 'Tên môn' };
        ws[XLSX.utils.encode_cell({ c: 3, r: 0 })] = { v: 'GV Lý Thuyết' };
        ws[XLSX.utils.encode_cell({ c: 4, r: 0 })] = { v: 'Trợ giảng' };
        ws[XLSX.utils.encode_cell({ c: 5, r: 0 })] = { v: 'Office hour' };
        ws[XLSX.utils.encode_cell({ c: 6, r: 0 })] = { v: 'Ghi chú' };
        for (var i = 1; i <= course_list.length; i++) {
            ws[XLSX.utils.encode_cell({ c: 0, r: i })] = { v: i };
            ws[XLSX.utils.encode_cell({ c: 1, r: i })] = { v: course_list[i - 1].code };
            ws[XLSX.utils.encode_cell({ c: 2, r: i })] = { v: course_list[i - 1].name };
            ws[XLSX.utils.encode_cell({ c: 3, r: i })] = { v: course_list[i - 1].lecturers };
            if (course_list[i - 1].TAs) ws[XLSX.utils.encode_cell({ c: 4, r: i })] = { v: course_list[i - 1].TAs };
            if (course_list[i - 1].office_hour) ws[XLSX.utils.encode_cell({ c: 5, r: i })] = { v: course_list[i - 1].office_hour };
            if (course_list[i - 1].note) ws[XLSX.utils.encode_cell({ c: 6, r: i })] = { v: course_list[i - 1].note };
        }
        ws['!ref'] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 6, r: course_list.length } });
        wb.Sheets[ws_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
        if (file_name == '') file_name = 'courses';
        FileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), file_name + ".xlsx");
    }
    public writeCourseLists(course_lists: any) {
        var zip = new JSZip();
        for (var j = 0; j < course_lists.length; j++) {
            if (course_lists[j].length == 0) continue;
            var course_list = course_lists[j];
            var ws_name = "Sheet1";
            var wb = { SheetNames: [], Sheets: {} };
            wb.SheetNames.push(ws_name);
            var ws = {};
            ws[XLSX.utils.encode_cell({ c: 0, r: 0 })] = { v: 'STT' };
            ws[XLSX.utils.encode_cell({ c: 1, r: 0 })] = { v: 'Mã môn' };
            ws[XLSX.utils.encode_cell({ c: 2, r: 0 })] = { v: 'Tên môn' };
            ws[XLSX.utils.encode_cell({ c: 3, r: 0 })] = { v: 'GV Lý Thuyết' };
            ws[XLSX.utils.encode_cell({ c: 4, r: 0 })] = { v: 'Trợ giảng' };
            ws[XLSX.utils.encode_cell({ c: 5, r: 0 })] = { v: 'Office hour' };
            ws[XLSX.utils.encode_cell({ c: 6, r: 0 })] = { v: 'Ghi chú' };
            for (var i = 1; i <= course_list.length; i++) {
                ws[XLSX.utils.encode_cell({ c: 0, r: i })] = { v: i };
                ws[XLSX.utils.encode_cell({ c: 1, r: i })] = { v: course_list[i - 1].code };
                ws[XLSX.utils.encode_cell({ c: 2, r: i })] = { v: course_list[i - 1].name };
                ws[XLSX.utils.encode_cell({ c: 3, r: i })] = { v: course_list[i - 1].lecturers };
                if (course_list[i - 1].TAs) ws[XLSX.utils.encode_cell({ c: 4, r: i })] = { v: course_list[i - 1].TAs };
                if (course_list[i - 1].office_hour) ws[XLSX.utils.encode_cell({ c: 5, r: i })] = { v: course_list[i - 1].office_hour };
                if (course_list[i - 1].note) ws[XLSX.utils.encode_cell({ c: 6, r: i })] = { v: course_list[i - 1].note };
            }
            ws['!ref'] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 6, r: course_list.length } });
            wb.Sheets[ws_name] = ws;

            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
            zip.file(course_list[0].class_name + ".xlsx", new Blob([this.s2ab(wbout)]));
        }
        zip.generateAsync({ type: "blob" })
            .then(function(content) {
                // see FileSaver.js
                FileSaver.saveAs(content, "courses.zip");
            });
    }

    public writeScheduleSearchList(course_list: any, file_name: string) {
        var ws_name = "Sheet1";
        var wb = { SheetNames: [], Sheets: {} };
        wb.SheetNames.push(ws_name);
        var ws = {};
        var wscols = [
            {wch:20},
            {wch:20},
            {wch:20},
            {wch:20},
            {wch:20},
            {wch:20},
            {wch:20}
        ];
        ws['!cols'] = wscols;
        var sessions = ['','','','','','','','','','','','','','','', '','','','', '','','','','',];
        var time = ['(LT)7:30-9:10 \r\n (TH)7:30-9:30','(LT)9:30-11:10 \r\n (TH)9:30-11:30',
                    '(LT)13:30-15:10 \r\n (TH)13:30-15:30','(LT)15:30-17:10 \r\n (TH)15:30-17:30'];
        ws[XLSX.utils.encode_cell({ c: 0, r: 7 })] = { v: 'STT' };
        ws[XLSX.utils.encode_cell({ c: 1, r: 7 })] = { v: 'Mã môn' };
        ws[XLSX.utils.encode_cell({ c: 2, r: 7 })] = { v: 'Tên môn' };
        ws[XLSX.utils.encode_cell({ c: 3, r: 7 })] = { v: 'GV Lý Thuyết' };
        ws[XLSX.utils.encode_cell({ c: 4, r: 7 })] = { v: 'Trợ giảng' };
        ws[XLSX.utils.encode_cell({ c: 5, r: 7 })] = { v: 'Office hour' };
        ws[XLSX.utils.encode_cell({ c: 6, r: 7 })] = { v: 'Ghi chú' };
        for (var i = 0; i < course_list.length; i++) {
            ws[XLSX.utils.encode_cell({ c: 0, r: i + 8 })] = { v: i };
            ws[XLSX.utils.encode_cell({ c: 1, r: i + 8 })] = { v: course_list[i].code };
            ws[XLSX.utils.encode_cell({ c: 2, r: i + 8 })] = { v: course_list[i].name };
            ws[XLSX.utils.encode_cell({ c: 3, r: i + 8 })] = { v: course_list[i].lecturers };
            if (course_list[i].TAs) ws[XLSX.utils.encode_cell({ c: 4, r: i + 8 })] = { v: course_list[i].TAs };
            if (course_list[i].office_hour) ws[XLSX.utils.encode_cell({ c: 5, r: i + 8 })] = { v: course_list[i].office_hour };
            if (course_list[i].note) ws[XLSX.utils.encode_cell({ c: 6, r: i + 8})] = { v: course_list[i].note };

            var schedules = course_list[i].schedules.split(';');
            for (var j = 0; j < schedules.length; j++) {
                var temp = schedules[j].split('-');
                var index = temp[0];
                var room = temp[1];
                var type = temp[2];
                sessions[index] += course_list[i].code + '-' + course_list[i].class_name + '-' + room + '-' + type + '\r\n';
            }
        }
        ws[XLSX.utils.encode_cell({ c: 1, r: 0 })] = { v: '2' };
        ws[XLSX.utils.encode_cell({ c: 2, r: 0 })] = { v: '3' };
        ws[XLSX.utils.encode_cell({ c: 3, r: 0 })] = { v: '4' };
        ws[XLSX.utils.encode_cell({ c: 4, r: 0 })] = { v: '5' };
        ws[XLSX.utils.encode_cell({ c: 5, r: 0 })] = { v: '6' };
        ws[XLSX.utils.encode_cell({ c: 6, r: 0 })] = { v: '7' };
        for(var i = 0 ; i < 4; i++){
            ws[XLSX.utils.encode_cell({ c: 0, r: i+1 })] = { v: time[i] };
            ws[XLSX.utils.encode_cell({ c: 1, r: i+1 })] = { v: sessions[i] };
            ws[XLSX.utils.encode_cell({ c: 2, r: i+1 })] = { v: sessions[i + 4*1] };
            ws[XLSX.utils.encode_cell({ c: 3, r: i+1 })] = { v: sessions[i + 4*2] };
            ws[XLSX.utils.encode_cell({ c: 4, r: i+1 })] = { v: sessions[i + 4*3] };
            ws[XLSX.utils.encode_cell({ c: 5, r: i+1 })] = { v: sessions[i + 4*4] };
            ws[XLSX.utils.encode_cell({ c: 6, r: i+1 })] = { v: sessions[i + 4*5] };
        }
        ws['!ref'] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 6, r: course_list.length + 7 } });
        wb.Sheets[ws_name] = ws;
        var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
        if (file_name == '') file_name = 'schedule';
        FileSaver.saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), file_name + ".xlsx");
    }


    public readAttendanceListFile(file: any) : Observable < { result: string, attendance_list: Array < any > , message: string } >{
        return new Observable < any > ((observer) => {
                XlsxPopulate.fromDataAsync(file)
                .then(workbook => {
                    observer.next(workbook.sheet(0));
                });
            }).map((sheet: any) => {
                var cells = sheet.usedRange().value();
                var import_start = 0;
                var attendance_list = [];
                for(var i = 0 ; i < cells.length; i++){
                    if(cells[i][0] == 'STT'){
                        import_start = i+1;
                        break;
                    }
                }
                for(var i = import_start; i < cells.length; i++){
                    var attendance = {
                        code : cells[i][1],
                        name : cells[i][2],
                        attendance_details : []
                    }
                    for(var j = 3; j < cells[i].length; j++){
                        var type = this.appService.attendance_type.absent;
                        var icon = '';
                        var method = 'Absent';
                        if(cells[i][j] != undefined){
                            switch (cells[i][j]) {
                                case 'CL':
                                    type = this.appService.attendance_type.checklist;
                                    icon = 'fa-check';
                                    method = 'Checklist';
                                    break;
                                case 'QZ':
                                    type = this.appService.attendance_type.quiz;
                                    icon = 'fa-question-circle';
                                    method = 'Quiz';
                                    break;
                                case 'QR':
                                    icon = 'fa-qrcode';
                                    method = 'QR code';
                                    type = this.appService.attendance_type.qr;
                                    break;
                                case 'PA':
                                    icon = 'fa-envelope-square';
                                    method = 'Permited Absent';
                                    type = this.appService.attendance_type.permited_absent;
                                    break;
                            }
                        }
                        attendance.attendance_details.push({
                            attendance_type : type,
                            method : method,
                            icon : icon
                        });
                    }
                    attendance_list.push(attendance);
                }
                return { result: 'success', message: 'success', attendance_list : attendance_list};
            }).catch((error: any) => Observable.of({ result: 'failure', message: error }));
    }
    public writeAttendanceList(attendance_list : any,file_name: string) {
        XlsxPopulate.fromBlankAsync()
            .then(workbook => {
                workbook.sheet("Sheet1").cell("A1").value("Danh sách điểm danh " + file_name).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("A2").value("CL: Checklist").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("G2").value("QZ: Quiz").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("M2").value("QR: QR code").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("S2").value("PA: Permited Absent").style("horizontalAlignment", "center");

                workbook.sheet("Sheet1").cell("A4").value("STT").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("B4").value("MSSV").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("C4").value("Họ Tên").style("border", true).style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("D4").value("Tuần 1").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("F4").value("Tuần 2").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("H4").value("Tuần 3").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("J4").value("Tuần 4").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("L4").value("Tuần 5").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("N4").value("Tuần 6").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("P4").value("Tuần 7").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("R4").value("Tuần 8").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("T4").value("Tuần 9").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("V4").value("Tuần 10").style("horizontalAlignment", "center");
                workbook.sheet("Sheet1").cell("X4").value("Tuần 11").style("horizontalAlignment", "center");
                var cell = ['D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y'];
                for (var i = 0; i < attendance_list.length; i++) {
                    workbook.sheet("Sheet1").cell("A" + Math.floor(i + 5)).value(i + 1).style("border", true);
                    workbook.sheet("Sheet1").cell("B" + Math.floor(i + 5)).value(attendance_list[i].code).style("border", true);
                    workbook.sheet("Sheet1").cell("C" + Math.floor(i + 5)).value(attendance_list[i].name).style("border", true);
                    var j = 0;
                    for(j = 0 ; j < attendance_list[i].attendance_details.length; j++){
                        var value;
                        switch (attendance_list[i].attendance_details[j].attendance_type) {
                            case this.appService.attendance_type.checklist:
                                value = 'CL';
                                break;
                            case this.appService.attendance_type.quiz:
                                value = 'QZ';
                                break;
                            case this.appService.attendance_type.qr:
                                value = 'QR';
                                break;
                            case this.appService.attendance_type.permited_absent:
                                value = 'PA';
                                break;
                            default:
                                value = '';
                                break;
                        }
                        workbook.sheet("Sheet1").cell(cell[j] + Math.floor(i + 5)).value(value).style("border", true);
                    }
                    for(;j < 22; j++){
                        workbook.sheet("Sheet1").cell(cell[j] + Math.floor(i + 5)).value('').style("border", true);
                    }
                }
                workbook.sheet(0).range("A1:Y1").merged(true);
                workbook.sheet(0).range("A2:F2").merged(true);
                workbook.sheet(0).range("G2:L2").merged(true);
                workbook.sheet(0).range("M2:R2").merged(true);
                workbook.sheet(0).range("S2:X2").merged(true);
                workbook.sheet(0).range("D4:E4").merged(true).style("border", true);
                workbook.sheet(0).range("F4:G4").merged(true).style("border", true);
                workbook.sheet(0).range("H4:I4").merged(true).style("border", true);
                workbook.sheet(0).range("J4:K4").merged(true).style("border", true);
                workbook.sheet(0).range("L4:M4").merged(true).style("border", true);
                workbook.sheet(0).range("N4:O4").merged(true).style("border", true);
                workbook.sheet(0).range("P4:Q4").merged(true).style("border", true);
                workbook.sheet(0).range("R4:S4").merged(true).style("border", true);
                workbook.sheet(0).range("T4:U4").merged(true).style("border", true);
                workbook.sheet(0).range("V4:W4").merged(true).style("border", true);
                workbook.sheet(0).range("X4:Y4").merged(true).style("border", true);
                const range = workbook.sheet(0).range("A1:Y"+Math.floor(attendance_list.length+5));
                return workbook.outputAsync()
                    .then(function (blob) {
                        if (file_name == '') file_name = 'attendance_list';
                        FileSaver.saveAs(blob, file_name + ".xlsx");
                    });
            });
    }
}
