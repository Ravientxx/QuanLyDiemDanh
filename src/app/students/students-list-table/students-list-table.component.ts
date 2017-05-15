import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'students-list-table',
    templateUrl: './students-list-table.component.html'
})
export class StudentsListTableComponent implements OnInit {
    public TableData: Array < any > = [
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
    public rows: Array < any > = [];
    public columns: Array < any > = [
        { title: 'ID', name: 'id' }, {
            title: 'Name',
            name: 'name',
        },
        { title: 'Class', name: 'class', sort: false },
        { title: 'Status', name: 'status' },
        { title: 'Enrolled courses', name: 'enrolled-courses' }
    ];
    public page: number = 1;
    public itemsPerPage: number = 10;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '' },
        className: ['table-striped', 'table-bordered','text-center','table-hover']
    };

    private data: Array < any > = this.TableData;

    public constructor(private router : Router) {
        this.length = this.data.length;
    }

    public ngOnInit(): void {
        this.onChangeTable(this.config);
    }

    public changePage(page: any, data: Array < any > = this.data): Array < any > {
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    public changeSort(data: any, config: any): any {
        if (!config.sorting) {
            return data;
        }

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        // simple sorting
        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    public changeFilter(data: any, config: any): any {
        let filteredData: Array < any > = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
                    return item[column.name].match(column.filtering.filterString);
                });
            }
        });

        if (!config.filtering) {
            return filteredData;
        }

        if (config.filtering.columnName) {
            return filteredData.filter((item: any) =>
                item[config.filtering.columnName].match(this.config.filtering.filterString));
        }

        let tempArray: Array < any > = [];
        filteredData.forEach((item: any) => {
            let flag = false;
            this.columns.forEach((column: any) => {
                if (item[column.name].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;

        return filteredData;
    }

    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }

        let filteredData = this.changeFilter(this.data, this.config);
        let sortedData = this.changeSort(filteredData, this.config);
        this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.length = sortedData.length;
    }

    public onCellClick(data: any): any {
        //console.log(data.row.id);
        this.router.navigate(['/students', data.row.id]);
    }
}
