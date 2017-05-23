import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'student-absence-requests-table',
  templateUrl: './student-absence-requests-table.component.html'
})
export class StudentAbsenceRequestsTableComponent implements OnInit {
  public TableData: Array < any > = [
    {
        no: '1',
        date: '13-08-2017 Thu 12:40:29',
        userStatus: 0,
        method: 'FaceReg',
        action: '<button class="btn" type="button">Report</button>'
    },{
        no: '2',
        date: '13-08-2017 Thu 12:40:29',
        userStatus: "1 <a>view reason</a>",
        method: 'Quiz',
        action: '<button class="btn" type="button">Report</button>'
    },{
        no: '3',
        date: '13-08-2017 Thu 12:40:29',
        userStatus: 1,
        method: 'Check Name',
        action: '<button class="btn" type="button">Report</button>'
    },];
    public rows: Array < any > = [];
    public columns: Array < any > = [
        { title: 'No', name: 'no' },
        { title: 'Date', name: 'date'},
        { title: 'Your status', name: 'userStatus' },
        { title: 'Method', name: 'method' },
        { title: 'Action', name: 'action' },
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
