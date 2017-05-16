var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];

router.post('/add', function(req, res, next) {
    if (req.body.name == null || req.body.email == null || req.body.password == null){
        _global.sendError(res, null, "Fill all required fields");
        return;
    }

    var new_firstname = req.body.firstname;    
    var new_lastname = req.body.lastname;    
    var new_email = req.body.email;
    var new_phone = req.body.phone;
    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT email FROM users WHERE email=? LIMIT 1`, new_email ,function(error, rows, fields) {
            if (error){
                _global.sendError(res, error.message);
                throw error;
            }

            //check email exist
            if (rows.length > 0) { 
                _global.sendError(res, "Email already existed")
                throw "Email already existed";
            }

            //new teacher data
            var new_password = new_email.split('@')[0];
            var new_user = {
                firstname: new_firstname,
                lastname: new_lastname,
                email: new_email,
                phone: new_phone,
                password: bcrypt.hashSync(new_password, 10),
                role_id: 2 
            };
            
            //begin adding teacher
            connection.beginTransaction(function(error) {
                if (error){
                    _global.sendError(res, error.message);
                    throw error;
                }
                //add data to user table
                connection.query('INSERT INTO users SET ?', new_user, function(error, results, fields) {
                    if (error) {
                        _global.sendError(res. error.message);
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    //add data to teacher table
                    var teacher = { id: results.insertId };
                    connection.query('INSERT INTO teachers SET ?', teacher, function(error, results, fields) {
                        if (error) {
                            _global.sendError(res. error.message);
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        connection.commit(function(error) {
                            if (error) {
                                _global.sendError(res. error.message);
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
            connection.release();
        });
    });
});

router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;

    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT teachers.id,firstname,lastname,phone,email,current_courses 
        FROM teachers,users
        WHERE teachers.id = users.id`, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }

            teacher_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = teacher_list;
            } else {
                for (var i = 0; i < teacher_list.length; i++) {
                    if (teacher_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(teacher_list[i]);
                    }
                }
            }

            res.send({ 
                result: 'success', 
                total_items: search_list.length, 
                teacher_list: _global.filterListByPage(page, limit, search_list) 
            });

            connection.release();
        });
    });
});

router.get('/detail/:id', function(req, res, next) {
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT * FROM users WHERE id = ? LIMIT 1`,id,function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
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
        });
    });
});

module.exports = router;
