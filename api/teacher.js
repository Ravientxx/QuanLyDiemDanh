var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];
router.post('/add', function(req, res, next) {
    var new_name = req.body.name;
    var new_email = req.body.email;
    var new_phone = req.body.phone;
    pool.getConnection(function(error, connection) {
        console.log()
        connection.query(`SELECT email FROM users`, function(error, rows, fields) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].email == new_email) {
                    res.send({ result: 'failure', message: 'Email already existed' });
                    throw "Email already existed";
                }
            }
            var new_password = new_email.split('@')[0];
            var new_user = { name: new_name, email: new_email, phone: new_phone, password: bcrypt.hashSync(new_password, 10), role_id: 2 };
            connection.beginTransaction(function(error) {
                if (error) throw error;
                connection.query('INSERT INTO users SET ?', new_user,
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        var teacher = { id: results.insertId };
                        connection.query('INSERT INTO teachers SET ?', teacher, function(error, results, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            connection.commit(function(error) {
                                if (error) {
                                    return connection.rollback(function() {
                                        throw error;
                                    });
                                }
                                console.log('success adding teacher!');
                                res.send({ result: 'success', message: 'Teacher Added Successfully' });
                            });
                        });
                    });
            });
        });
        connection.release();
        if (error) throw error;
    });
});
router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page;
    var limit = req.body.limit;
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT teachers.id,name,phone,email,(SELECT COUNT(*) FROM teacher_teach_course WHERE teacher_teach_course.teacher_id = teachers.id) AS current_courses 
        FROM teachers,users
        WHERE teachers.id = users.id`, function(error, rows, fields) {
            teacher_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = teacher_list;
            } else {
                for (var i = 0; i < teacher_list.length; i++) {
                    console.log(teacher_list[i].name.toLowerCase());
                    if (teacher_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(teacher_list[i]);
                    }
                }
            }
            res.send({ result: 'success', total_items: search_list.length, teacher_list: _global.filterListByPage(page, limit, search_list) });
            connection.release();
            if (error) throw error;
        });
    });
});
router.get('/detail/:id', function(req, res, next) {
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT * FROM users WHERE id = ?`, id, function(error, rows, fields) {
            var teacher = rows[0];
            connection.query(`SELECT teacher_teach_course.teacher_role, courses.code AS course_code, courses.name AS course_name,courses.attendance_count,programs.name AS program_name, semesters.name AS semester_name 
                FROM teacher_teach_course , courses, programs , semesters 
                WHERE teacher_teach_course.course_id = courses.id AND teacher_teach_course.teacher_id = ? AND programs.id = courses.program_id 
                GROUP BY courses.code`, id, function(error, rows, fields) {
                res.send({ result: 'success', teacher: teacher,teaching_courses: rows});
                connection.release();
                if (error) throw error;
            });
            connection.release();
            if (error) throw error;
        });
    });
});

module.exports = router;
