var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');

router.post('/list-by-course/', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    var sort = req.body.sort != null ? req.body.sort : 'none';
    var sort_tag = req.body.sort_tag != null ? req.body.sort_tag : '';
    if(req.body.course_id == null){
    	_global.sendError(res, null, "Course_id is required");
        throw "Course_id is required";
    }
    var course_id = req.body.course_id;
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT students.stud_id as code, CONCAT(users.first_name, ' ', users.last_name) AS name 
        	FROM users,student_enroll_course,students 
        	WHERE users.id = students.id AND users.id = student_enroll_course.student_id AND student_enroll_course.course_id = ?`, course_id, function(error, rows, fields) {
            if (error) {
                var message = error.message + ' at get attendance_list by course';
                _global.sendError(res, message);
                throw message;
            }
            var attendance_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = attendance_list;
            } else {
                for (var i = 0; i < attendance_list.length; i++) {
                    if (attendance_list[i].code.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        attendance_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(attendance_list[i]);
                    }
                }
            }
            if (sort != 'none') {
                _global.sortListByKey(sort, search_list, sort_tag);
            }
            res.send({
                result: 'success',
                total_items: search_list.length,
                attendance_list: _global.filterListByPage(page, limit, search_list)
            });
            connection.release();
        });
    });
});

module.exports = router;

