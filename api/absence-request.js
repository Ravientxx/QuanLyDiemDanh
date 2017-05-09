var express = require('express');
var router = express.Router();


/* GET home page. */
var requests = [{
    id: 1,
    code: '1353019',
    name: 'Nguyễn Đức T',
    reason: 'Đi khám nghĩa vụ',
    from_to: '10/7/2016 - 17/7/2016',
    days: '7',
    submited_at: '10/7/2016',
    accepted_at: null,
    status: '0'
}, {
    id: 2,
    code: '1353051',
    name: 'Hoàng Tuấn',
    reason: 'Đi khám nghĩa vụ',
    from_to: '10/7/2016 - 17/7/2016',
    days: '7',
    submited_at: '10/7/2016',
    accepted_at: '15/7/2016',
    status: '1'
}, {
    id: 3,
    code: '1353015',
    name: 'Nguyễn Khoa',
    reason: 'Đi khám nghĩa vụ',
    from_to: '10/7/2016 - 17/7/2016',
    days: '7',
    submited_at: '10/7/2016',
    accepted_at: null,
    status: '0'
}, {
    id: 4,
    code: '1353033',
    name: 'Văn Tín',
    reason: 'Đi khám nghĩa vụ',
    from_to: '10/7/2016 - 17/7/2016',
    days: '7',
    submited_at: '10/7/2016',
    accepted_at: '15/7/2016',
    status: '1'
}, ];

router.get('/student/new', function(req, res, next) {
    var newRequests = [];
    for (var i = 0; i < requests.length; i++) {
        if (requests[i].status == 0) {
            newRequests.push(requests[i]);
        }
    }
    res.send(newRequests);
});
router.get('/student/accepted', function(req, res, next) {
    var acceptedRequests = [];
    for (var i = 0; i < requests.length; i++) {
        if (requests[i].status == 1) {
            acceptedRequests.push(requests[i]);
        }
    }
    res.send(acceptedRequests);
});
router.put('/student/accept', function(req, res, next) {
    var id = req.body.id;
    for (var i = 0; i < requests.length; i++) {
        if (requests[i].id == id) {
            requests[i].status = 1;
        }
    }
    res.sendStatus(200);

});

module.exports = router;
