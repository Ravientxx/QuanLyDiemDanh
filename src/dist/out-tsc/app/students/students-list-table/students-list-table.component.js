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
var StudentsListTableComponent = (function () {
    function StudentsListTableComponent(router) {
        this.router = router;
        this.TableData = [
            {
                'id': '1353002',
                'name': 'Lê Vũ Hoài Ân',
                'class': '13CLC',
                'status': 'Active',
                'enrolled-courses': '4'
            }, {
                'id': '1353004',
                'name': 'Nguyễn Quốc Bảo',
                'class': '13CLC',
                'status': 'Reserved',
                'enrolled-courses': '2'
            }, {
                'id': '1353001',
                'name': 'Trần Lê Công Hậu',
                'class': '13CLC',
                'status': 'Abandon',
                'enrolled-courses': '3'
            }
        ];
        this.rows = [];
        this.columns = [
            { title: 'ID', name: 'id' }, {
                title: 'Name',
                name: 'name',
            },
            { title: 'Class', name: 'class', sort: false },
            { title: 'Status', name: 'status' },
            { title: 'Enrolled courses', name: 'enrolled-courses' }
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
        this.data = this.TableData;
        this.length = this.data.length;
    }
    StudentsListTableComponent.prototype.ngOnInit = function () {
        this.onChangeTable(this.config);
    };
    StudentsListTableComponent.prototype.changePage = function (page, data) {
        if (data === void 0) { data = this.data; }
        var start = (page.page - 1) * page.itemsPerPage;
        var end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    };
    StudentsListTableComponent.prototype.changeSort = function (data, config) {
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
    StudentsListTableComponent.prototype.changeFilter = function (data, config) {
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
    StudentsListTableComponent.prototype.onChangeTable = function (config, page) {
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
    StudentsListTableComponent.prototype.onCellClick = function (data) {
        //console.log(data.row.id);
        this.router.navigate(['/students', data.row.id]);
    };
    return StudentsListTableComponent;
}());
StudentsListTableComponent = __decorate([
    core_1.Component({
        selector: 'students-list-table',
        templateUrl: './students-list-table.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router])
], StudentsListTableComponent);
exports.StudentsListTableComponent = StudentsListTableComponent;
//# sourceMappingURL=students-list-table.component.js.map