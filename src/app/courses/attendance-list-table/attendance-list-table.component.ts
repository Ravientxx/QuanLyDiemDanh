import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'attendance-list-table',
    templateUrl: './attendance-list-table.component.html'
})
export class AttendanceListTableComponent implements OnInit {
    @Input() type: string;

    public TableData: Array < any > = [{
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
    public rows: Array < any > = [];
    public columns: Array < any > = [
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
    public page: number = 1;
    public itemsPerPage: number = 10;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '' },
        className: ['table-striped', 'table-bordered', 'text-center', 'table-hover']
    };

    private data: Array < any > = [];

    public constructor(private router: Router) {
        this.data = this.TableData;
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
        this.router.navigate(['/students/', data.row.code]);
    }
}
