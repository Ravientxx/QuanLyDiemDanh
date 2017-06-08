var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var async = require("async");

router.post('/list-by-course/', function(req, res, next) {
    if (req.body.course_id == null) {
        _global.sendError(res, null, "Course_id is required");
        throw "Course_id is required";
    }
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    var sort = req.body.sort != null ? req.body.sort : 'none';
    var sort_tag = req.body.sort_tag != null ? req.body.sort_tag : '';
    var course_id = req.body.course_id;
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT students.id, students.stud_id as code, CONCAT(users.first_name, ' ', users.last_name) AS name 
            FROM users,student_enroll_course,students,class_has_course 
            WHERE users.id = students.id AND users.id = student_enroll_course.student_id AND student_enroll_course.class_has_course_id = class_has_course.id AND class_has_course.course_id = ?`, course_id, function(error, rows, fields) {
            if (error) {
                var message = error.message + ' at get student_list by course';
                _global.sendError(res, message);
                throw message;
            }
            var student_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = student_list;
            } else {
                for (var i = 0; i < student_list.length; i++) {
                    if (student_list[i].code.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        student_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(student_list[i]);
                    }
                }
            }
            if (sort != 'none') {
                _global.sortListByKey(sort, search_list, sort_tag);
            }
            student_list = _global.filterListByPage(page, limit, search_list);
            var attendance_list = [];
            async.each(student_list, function(student, callback) {
                var attendance = {
                    id: student.id,
                    code: student.code,
                    name: student.name,
                    attendance_details: []
                };
                // for (var i = 0; i < 20; i++) {
                //     attendance.attendance_details.push({
                //         attendance_id: 0,
                //         attendance_time: '',
                //         attendance_type: 0
                //     });
                // }
                connection.query(`SELECT attendance_id, attendance_time, attendance_type FROM attendance, attendance_detail WHERE attendance.id = attendance_detail.attendance_id AND  course_id = ? AND student_id = ?`, [course_id, student.id], function(error, results, fields) {
                    if (error) {
                        console.log(error.message + ' at get attendance_details');
                        callback(error);
                    } else {
                        for (var i = 0; i < results.length; i++) {
                            // attendance.attendance_details[i].attendance_id = results[i].attendance_id;
                            // attendance.attendance_details[i].attendance_time = results[i].attendance_time;
                            // attendance.attendance_details[i].attendance_type = results[i].attendance_type;
                            attendance.attendance_details.push({
                                attendance_id: results[i].attendance_id,
                                attendance_time: results[i].attendance_time,
                                attendance_type: results[i].attendance_type
                            });
                        }
                        attendance_list.push(attendance);
                        callback();
                    }
                });
            }, function(error) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                } else {
                    console.log('loaded attendance_list');
                    res.send({
                        result: 'success',
                        total_items: search_list.length,
                        attendance_list: attendance_list
                    });
                }
                connection.release();
            });
        });
    });
});
router.post('/check-add-to-course/', function(req, res, next) {
    if (req.body.course_id == null || req.body.course_id == 0) {
        _global.sendError(res, null, "Course_id is required");
        throw "Course_id is required";
    }
    if (req.body.student_code == null || req.body.student_code == '') {
        _global.sendError(res, null, "Student code is required");
        throw "Student code is required";
    }
    if (isNaN(req.body.student_code)) {
        _global.sendError(res, null, "Student code must contain only numbers");
        return;
    }
    if (req.body.student_name == null || req.body.student_name == '') {
        _global.sendError(res, null, "Student name is required");
        throw "Student name is required";
    }

    var course_id = req.body.course_id;
    var student_code = req.body.student_code;
    var student_name = req.body.student_name;


    pool.getConnection(function(error, connection) {
        connection.query(`SELECT students.stud_id 
            FROM attendance,attendance_detail, students 
            WHERE attendance.id = attendance_detail.attendance_id AND attendance_detail.student_id = students.id AND attendance.course_id = ? AND students.stud_id = ?`, [course_id, student_code], function(error, rows, fields) {
            if (error) {
                var message = error.message + ' at get check add to course';
                _global.sendError(res, message);
                throw message;
            }
            if (rows.length > 0) {
                _global.sendError(res, null, 'Student code found in attendance list');
            } else {
                res.send({
                    result: 'success'
                });
            }
            connection.release();
        });
    });
});
module.exports = router;
