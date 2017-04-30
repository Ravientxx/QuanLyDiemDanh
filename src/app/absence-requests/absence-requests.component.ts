import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-absence-requests',
  templateUrl: './absence-requests.component.html'
})
export class AbsenceRequestsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public caption1:string = 'Request';
  public data1 = [{
        'code': '1353002',
        'name': 'Nguyễn Văn A',
        'reason': 'Đi khám nghĩa vụ',
        'from_to': '10/7/2016 - 17/7/2016',
        'days': '7',
        'submited_at': '10/7/2016'
    },{
        'code': '1353002',
        'name': 'Nguyễn Văn B',
        'reason': 'Đi khám nghĩa vụ',
        'from_to': '10/7/2016 - 17/7/2016',
        'days': '7',
        'submited_at': '10/7/2016'
    },{
        'code': '1353002',
        'name': 'Nguyễn Văn C',
        'reason': 'Đi khám nghĩa vụ',
        'from_to': '10/7/2016 - 17/7/2016',
        'days': '7',
        'submited_at': '10/7/2016'
    }
  ];
  public head1 = [
    { title: 'Code', name: 'code'},
    { title: 'Name', name: 'name'},
    { title: 'Reason', name: 'reason', sort: false},
    { title: 'From-To', name: 'from_to'},
    { title: 'Days', name: 'days'},
    { title: 'Submited At', name: 'submited_at'}
  ];

  public caption2:string = 'Accepted';
  public data2 = [{
        'code': '1353002',
        'name': 'Nguyễn Văn A',
        'reason': 'Đi khám nghĩa vụ',
        'from_to': '10/7/2016 - 17/7/2016',
        'days': '7',
        'accepted_at': '10/7/2016'
    },{
        'code': '1353002',
        'name': 'Nguyễn Văn A',
        'reason': 'Đi khám nghĩa vụ',
        'from_to': '10/7/2016 - 17/7/2016',
        'days': '7',
        'accepted_at': '10/7/2016'
    }
  ];
  public head2 = [
    { title: 'Code', name: 'code'},
    { title: 'Name', name: 'name'},
    { title: 'Reason', name: 'reason', sort: false},
    { title: 'From-To', name: 'from_to'},
    { title: 'Days', name: 'days'},
    { title: 'Accepted At', name: 'accepted_at'}
  ];
}
