"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng2_file_upload_1 = require("ng2-file-upload/ng2-file-upload");
var ts_xlsx_1 = require("ts-xlsx");
var rxjs_1 = require("rxjs");
var URL = 'https://foo.bar.com';
var ScheduleUploadComponent = (function () {
    function ScheduleUploadComponent() {
        this.uploader = new ng2_file_upload_1.FileUploader({ url: URL });
        this.uploadedXls = new core_1.EventEmitter();
        this.filesSubject = new rxjs_1.Subject();
        this._uploadedXls = this.filesSubject.asObservable()
            .switchMap(function (file) {
            return new rxjs_1.Observable(function (observer) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    observer.next(e.target.result);
                };
                reader.readAsBinaryString(file);
                return function () {
                    reader.abort();
                };
            })
                .map(function (value) {
                return ts_xlsx_1.read(value, { type: 'binary' });
            }).map(function (wb) {
                return wb.SheetNames.map(function (sheetName) {
                    var sheet = wb.Sheets[sheetName];
                    var temp = sheet.A2.v.split(",");
                    var study_time = sheet.A2.v;
                    var shift1 = [];
                    shift1.push(sheet.B5.v);
                    shift1.push(sheet.C5.v);
                    shift1.push(sheet.D5.v);
                    shift1.push(sheet.E5.v);
                    shift1.push(sheet.F5.v);
                    shift1.push(sheet.G5.v);
                    var shift2 = [];
                    shift2.push(sheet.B7.v);
                    shift2.push(sheet.C7.v);
                    shift2.push(sheet.D7.v);
                    shift2.push(sheet.E7.v);
                    shift2.push(sheet.F7.v);
                    shift2.push(sheet.G7.v);
                    var shift3 = [];
                    shift3.push(sheet.B10.v);
                    shift3.push(sheet.C10.v);
                    shift3.push(sheet.D10.v);
                    shift3.push(sheet.E10.v);
                    shift3.push(sheet.F10.v);
                    shift3.push(sheet.G10.v);
                    var shift4 = [];
                    shift4.push(sheet.B12.v);
                    shift4.push(sheet.C12.v);
                    shift4.push(sheet.D12.v);
                    shift4.push(sheet.E12.v);
                    shift4.push(sheet.F12.v);
                    shift4.push(sheet.G12.v);
                    var courses = [];
                    var i = 16;
                    while (sheet['A' + i] !== undefined) {
                        var desired_cell;
                        var desired_value;
                        desired_cell = sheet['E' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var E = desired_value;
                        desired_cell = sheet['F' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var F = desired_value;
                        desired_cell = sheet['G' + i];
                        desired_value = (desired_cell ? desired_cell.v : undefined);
                        var G = desired_value;
                        var course = {
                            'stt': sheet['A' + i].v,
                            'code': sheet['B' + i].v,
                            'name': sheet['C' + i].v,
                            'teacher': sheet['D' + i].v,
                            'ta': E,
                            'office-hour': F,
                            'note': G,
                        };
                        if (course.ta !== undefined) {
                            //course.ta = course.ta.split('\n');
                        }
                        courses.push(course);
                        i++;
                    }
                    return { result: 'success', studytime: study_time, shift1: shift1, shift2: shift2, shift3: shift3, shift4: shift4, courses: courses };
                });
            })
                .catch(function (e) { return rxjs_1.Observable.of({ result: 'failure', error: e }); });
        });
    }
    ScheduleUploadComponent.prototype.ngOnInit = function () {
        this.subscription = this._uploadedXls.subscribe(this.uploadedXls);
    };
    ScheduleUploadComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    ScheduleUploadComponent.prototype.fileDropped = function (files) {
        for (var i = 0; i < files.length; i++) {
            this.filesSubject.next(files[i]);
        }
    };
    return ScheduleUploadComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ScheduleUploadComponent.prototype, "uploadedXls", void 0);
ScheduleUploadComponent = __decorate([
    core_1.Component({
        selector: 'schedule-upload',
        templateUrl: './schedule-upload.component.html',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [])
], ScheduleUploadComponent);
exports.ScheduleUploadComponent = ScheduleUploadComponent;
//# sourceMappingURL=schedule-upload.component.js.map