var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var student_list = [];

/**
* @swagger
* tags:
*   name: Student
*   description: Student management
*/

/**
* @swagger
* /api/student/list:
*   post:
*     summary: Get student list
*     description: 
*     tags: [Student]
*     produces:
*       - application/json
*     parameters:
*       - name: searchText
*         description: words exist in name
*         in: formData
*         type: string
*       - name: page
*         description: page number for pagination
*         in: formData
*         type: integer
*       - name: limit
*         description: number records per page
*         in: formData
*         type: integer
*       - name: sort
*         description: asc or dsc
*         in: formData
*         type: string
*     responses:
*       200:
*         description: json
*/
router.post('/list',function (req,res,next) {
var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : 50;
    var sort = req.body.sort;

    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT students.*, first_name, last_name, phone, email 
        FROM students,users
        WHERE students.id = users.id`, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }

            student_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = student_list;
            } else {
                for (var i = 0; i < student_list.length; i++) {
                    if (student_list[i].first_name.toLowerCase().indexOf(searchText.toLowerCase()) != -1 || student_list[i].last_name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(student_list[i]);
                    }
                }
            }
            if(sort != 'none'){
                _global.sortListByName(sort,search_list);
            }
            res.send({ 
                result: 'success', 
                total_items: search_list.length, 
                page: page,
                limit: limit,
                student_list: _global.filterListByPage(page, limit, search_list) 
            });

            connection.release();
        });
    });
});

/**
* @swagger
* /api/student/detail:
*   post:
*     summary: Get a student detail
*     description: 
*     tags: [Student]
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: student id
*         in: formData
*         required: true
*         type: string
*     responses:
*       200:
*         description: json
*/
router.post('/detail', function(req, res, next) {
    if (req.body.id != null){
        course_id = req.body.id;
    }
    else {  
        _global.sendError(res, "Missing course id", "Require course ID");
        return;
    }

    pool.getConnection(function(error, connection) {
        connection.query(`SELECT id,last_name,first_name,email,phone,current_courses FROM users join students on users.id = students.id WHERE id = ? LIMIT 1`,id,function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            //check student exist
            if (rows.length == 0) { 
                _global.sendError(res, 'User\'s ID not exist');
                throw 'User\'s ID not exist';
            }
            var student = rows[0];
            connection.query(`SELECT courses.id, courses.code AS course_code, courses.name AS course_name,courses.attendance_count,programs.name AS program_name, semesters.name AS semester_name 
                FROM student_enroll_course , courses, programs , semesters 
                WHERE student_enroll_course.course_id = courses.id AND student_enroll_course.student_id = ? AND 
                programs.id = courses.program_id`, id, function(error, rows, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                }
                res.send({ result: 'success', student: student, student_courses: rows});
                connection.release();
            });
        });
    });
});

module.exports = router;