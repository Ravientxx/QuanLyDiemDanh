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
var router_1 = require("@angular/router");
var AttendanceListTableComponent = (function () {
    function AttendanceListTableComponent(router) {
        this.router = router;
        this.TableData = [{
                'no': '1',
                'code': '1353019',
                'name': 'Huynh Huu Nghia',
                'week1-1': 'X',
                'week1-2': 'X',
                'week2-1': 'X',
                'week2-2': 'X',
                'week3-1': 'X',
                'week3-2': 'X',
                'week4-1': 'X',
                'week4-2': 'X',
                'week5-1': 'X',
                'week5-2': 'X',
                'week6-1': 'X',
                'week6-2': 'X',
                'week7-1': 'X',
                'week7-2': 'X',
                'week8-1': 'X',
                'week8-2': 'X',
                'week9-1': 'X',
                'week9-2': 'X',
                'week10-1': 'X',
                'week10-2': 'X',
            }, {
                'no': '2',
                'code': '1353020',
                'name': 'Hoang Ho Hai Dang',
                'week1-1': 'X',
                'week1-2': 'X',
                'week2-1': 'X',
                'week2-2': 'X',
                'week3-1': 'X',
                'week3-2': 'X',
                'week4-1': 'X',
                'week4-2': 'X',
                'week5-1': 'X',
                'week5-2': 'X',
                'week6-1': 'X',
                'week6-2': 'X',
                'week7-1': 'X',
                'week7-2': 'X',
                'week8-1': 'X',
                'week8-2': 'X',
                'week9-1': 'X',
                'week9-2': 'X',
                'week10-1': 'X',
                'week10-2': 'X',
            }];
        this.rows = [];
        this.columns = [
            { title: 'No', name: 'no' },
            { title: 'Code', name: 'code' },
            { title: 'Name', name: 'name' },
            { title: '1-1', name: 'week1-1' },
            { title: '1-2', name: 'week1-2' },
            { title: '2-1', name: 'week2-1' },
            { title: '2-2', name: 'week2-2' },
            { title: '3-1', name: 'week3-1' },
            { title: '3-2', name: 'week3-2' },
            { title: '4-1', name: 'week4-1' },
            { title: '4-2', name: 'week4-2' },
            { title: '5-1', name: 'week5-1' },
            { title: '5-2', name: 'week5-2' },
            { title: '6-1', name: 'week6-1' },
            { title: '6-2', name: 'week6-2' },
            { title: '7-1', name: 'week7-1' },
            { title: '7-2', name: 'week7-2' },
            { title: '8-1', name: 'week8-1' },
            { title: '8-2', name: 'week8-2' },
            { title: '9-1', name: 'week9-1' },
            { title: '9-2', name: 'week9-2' },
            { title: '10-1', name: 'week10-1' },
            { title: '10-2', name: 'week10-2' }
        ];
        this.page = 1;
        this.itemsPerPage = 10;
        this.maxSize = 5;
        this.numPages = 1;
        this.length = 0;
        this.config = {
            paging: true,
            sorting: { columns: this.columns },
            filtering: { filterString: '' },
            className: ['table-striped', 'table-bordered', 'text-center', 'table-hover']
        };
        this.data = [];
        this.data = this.TableData;
        this.length = this.data.length;
    }
    AttendanceListTableComponent.prototype.ngOnInit = function () {
        this.onChangeTable(this.config);
    };
    AttendanceListTableComponent.prototype.changePage = function (page, data) {
        if (data === void 0) { data = this.data; }
        var start = (page.page - 1) * page.itemsPerPage;
        var end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    };
    AttendanceListTableComponent.prototype.changeSort = function (data, config) {
        if (!config.sorting) {
            return data;
        }
        var columns = this.config.sorting.columns || [];
        var columnName = void 0;
        var sort = void 0;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }
        if (!columnName) {
            return data;
        }
        // simple sorting
        return data.sort(function (previous, current) {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            }
            else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    };
    AttendanceListTableComponent.prototype.changeFilter = function (data, config) {
        var _this = this;
        var filteredData = data;
        this.columns.forEach(function (column) {
            if (column.filtering) {
                filteredData = filteredData.filter(function (item) {
                    return item[column.name].match(column.filtering.filterString);
                });
            }
        });
        if (!config.filtering) {
            return filteredData;
        }
        if (config.filtering.columnName) {
            return filteredData.filter(function (item) {
                return item[config.filtering.columnName].match(_this.config.filtering.filterString);
            });
        }
        var tempArray = [];
        filteredData.forEach(function (item) {
            var flag = false;
            _this.columns.forEach(function (column) {
                if (item[column.name].toString().match(_this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;
        return filteredData;
    };
    AttendanceListTableComponent.prototype.onChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }
        var filteredData = this.changeFilter(this.data, this.config);
        var sortedData = this.changeSort(filteredData, this.config);
        this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.length = sortedData.length;
    };
    AttendanceListTableComponent.prototype.onCellClick = function (data) {
        //console.log(data.row.id);
        this.router.navigate(['/students/', data.row.code]);
    };
    return AttendanceListTableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], AttendanceListTableComponent.prototype, "type", void 0);
AttendanceListTableComponent = __decorate([
    core_1.Component({
        selector: 'attendance-list-table',
        templateUrl: './attendance-list-table.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router])
], AttendanceListTableComponent);
exports.AttendanceListTableComponent = AttendanceListTableComponent;
//# sourceMappingURL=attendance-list-table.component.js.map