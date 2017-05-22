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
var AbsenceRequestsComponent = (function () {
    function AbsenceRequestsComponent() {
        this.caption1 = 'Request';
        this.data1 = [{
                'code': '1353002',
                'name': 'Nguyễn Văn A',
                'reason': 'Đi khám nghĩa vụ',
                'from_to': '10/7/2016 - 17/7/2016',
                'days': '7',
                'submited_at': '10/7/2016'
            }, {
                'code': '1353002',
                'name': 'Nguyễn Văn B',
                'reason': 'Đi khám nghĩa vụ',
                'from_to': '10/7/2016 - 17/7/2016',
                'days': '7',
                'submited_at': '10/7/2016'
            }, {
                'code': '1353002',
                'name': 'Nguyễn Văn C',
                'reason': 'Đi khám nghĩa vụ',
                'from_to': '10/7/2016 - 17/7/2016',
                'days': '7',
                'submited_at': '10/7/2016'
            }
        ];
        this.head1 = [
            { title: 'Code', name: 'code' },
            { title: 'Name', name: 'name' },
            { title: 'Reason', name: 'reason', sort: false },
            { title: 'From-To', name: 'from_to' },
            { title: 'Days', name: 'days' },
            { title: 'Submited At', name: 'submited_at' }
        ];
        this.caption2 = 'Accepted';
        this.data2 = [{
                'code': '1353002',
                'name': 'Nguyễn Văn A',
                'reason': 'Đi khám nghĩa vụ',
                'from_to': '10/7/2016 - 17/7/2016',
                'days': '7',
                'accepted_at': '10/7/2016'
            }, {
                'code': '1353002',
                'name': 'Nguyễn Văn A',
                'reason': 'Đi khám nghĩa vụ',
                'from_to': '10/7/2016 - 17/7/2016',
                'days': '7',
                'accepted_at': '10/7/2016'
            }
        ];
        this.head2 = [
            { title: 'Code', name: 'code' },
            { title: 'Name', name: 'name' },
            { title: 'Reason', name: 'reason', sort: false },
            { title: 'From-To', name: 'from_to' },
            { title: 'Days', name: 'days' },
            { title: 'Accepted At', name: 'accepted_at' }
        ];
    }
    AbsenceRequestsComponent.prototype.ngOnInit = function () {
    };
    return AbsenceRequestsComponent;
}());
AbsenceRequestsComponent = __decorate([
    core_1.Component({
        selector: 'app-absence-requests',
        templateUrl: './absence-requests.component.html'
    }),
    __metadata("design:paramtypes", [])
], AbsenceRequestsComponent);
exports.AbsenceRequestsComponent = AbsenceRequestsComponent;
//# sourceMappingURL=absence-requests.component.js.map