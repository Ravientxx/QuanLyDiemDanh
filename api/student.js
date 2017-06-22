var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');

router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    var sort = req.body.sort != null ? req.body.sort : 'none';

    var program_id = req.body.program_id != null ? req.body.program_id : 1;
    var class_id = req.body.class_id != null ? req.body.class_id : 0;

    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }
        var return_function = function(error, rows, fields) {
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
                    if (student_list[i].code.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        student_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(student_list[i]);
                    }
                }
            }
            if (sort != 'none') {
                _global.sortListByKey(sort, search_list, 'last_name');
            }
            res.send({
                result: 'success',
                total_items: search_list.length,
                student_list: _global.filterListByPage(page, limit, search_list)
            });

            connection.release();
        };
        if (class_id == 0) {
            connection.query(`SELECT users.id, students.stud_id as code, CONCAT(users.first_name,' ',users.last_name) as name, users.phone, students.status, students.current_courses as enroll_course, classes.name as class_name
                                FROM users,students,classes
                                WHERE users.id = students.id AND classes.id = students.class_id AND classes.program_id = ?`,
                program_id, return_function);
        } else {
            connection.query(`SELECT users.id, students.stud_id as code, CONCAT(users.first_name,' ',users.last_name) as name, users.phone, students.status, students.current_courses as enroll_course, classes.name as class_name
                                FROM users,students,classes
                                WHERE users.id = students.id AND classes.id = students.class_id AND classes.id = ? AND classes.program_id = ?`, [class_id, program_id], return_function);
        }
    });
});

router.post('/add', function(req, res, next) {
    if (req.body.program_id == undefined || req.body.program_id == 0) {
        _global.sendError(res, null, "Program is required");
        return;
    }
    if (req.body.class_id == undefined || req.body.class_id == 0) {
        _global.sendError(res, null, "Class is required");
        return;
    }
    if (req.body.code == undefined || req.body.code == '') {
        _global.sendError(res, null, "Student code is required");
        return;
    }
    if (req.body.first_name == undefined || req.body.first_name == '') {
        _global.sendError(res, null, "First name is required");
        return;
    }
    if (req.body.last_name == undefined || req.body.last_name == '') {
        _global.sendError(res, null, "Last name is required");
        return;
    }
    if (req.body.email == undefined || req.body.email == '') {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.email.indexOf('@') == -1) {
        _global.sendError(res, null, "Invalid Email");
        return;
    }
    if (req.body.phone == undefined || isNaN(req.body.phone)) {
        _global.sendError(res, null, "Invalid Phone Number");
        return;
    }
    var new_class_id = req.body.class_id;
    var new_program_id = req.body.program_id;
    var new_code = req.body.code;
    var new_first_name = req.body.first_name;
    var new_last_name = req.body.last_name;
    var new_email = req.body.email;
    var new_phone = req.body.phone;
    var new_note = req.body.note;
    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT stud_id FROM students WHERE stud_id = ? LIMIT 1`, new_code, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            //check email exist
            if (rows.length > 0) {
                _global.sendError(res, null, "Student code already existed");
                throw "Student code already existed";
            }
            connection.query(`SELECT email FROM users WHERE email=? LIMIT 1`, new_email, function(error, rows, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                }
                //check email exist
                if (rows.length > 0) {
                    _global.sendError(res, "Email already existed")
                    throw "Email already existed";
                }
                //new data to users table
                var new_password = new_email.split('@')[0];
                var new_user = {
                    first_name: new_first_name,
                    last_name: new_last_name,
                    email: new_email,
                    phone: new_phone,
                    password: bcrypt.hashSync(new_password, 10),
                    role_id: 1
                };

                //begin adding user
                connection.beginTransaction(function(error) {
                    if (error) {
                        _global.sendError(res, error.message);
                        throw error;
                    }
                    //add data to user table
                    connection.query('INSERT INTO users SET ?', new_user, function(error, results, fields) {
                        if (error) {
                            _global.sendError(res.error.message);
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        //add data to student table
                        var new_student = {
                            id: results.insertId,
                            stud_id: new_code,
                            class_id: new_class_id,
                            note: new_note
                        };
                        connection.query('INSERT INTO students SET ?', new_student, function(error, results, fields) {
                            if (error) {
                                _global.sendError(res.error.message);
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            connection.commit(function(error) {
                                if (error) {
                                    _global.sendError(res.error.message);
                                    return connection.rollback(function() {
                                        throw error;
                                    });
                                }
                                console.log('success adding student!');
                                res.send({ result: 'success', message: 'Student Added Successfully' });
                            });
                        });
                    });
                });
                connection.release();
            })
        });
    });
});

router.get('/detail/:id', function(req, res, next) {
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT users.*,students.stud_id AS code, students.status, classes.name AS class_name FROM users,students,classes WHERE users.id = ? AND users.id = students.id AND students.class_id = classes.id  LIMIT 1`, id, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            var student = rows[0];
            connection.query(`SELECT courses.id, code, name, attendance_status, enrollment_status,
                                (SELECT GROUP_CONCAT( CONCAT(users.first_name,' ',users.last_name) SEPARATOR "\r\n")
                                FROM teacher_teach_course,users 
                                WHERE users.id = teacher_teach_course.teacher_id AND 
                                    courses.id = teacher_teach_course.course_id AND 
                                    teacher_teach_course.teacher_role = 0) as lecturers,
                                (SELECT COUNT(attendance_detail.attendance_id) 
                                FROM attendance,attendance_detail 
                                WHERE attendance_detail.student_id = student_enroll_course.student_id AND attendance_detail.attendance_type = -1 AND attendance.course_id = courses.id AND attendance.id = attendance_detail.attendance_id ) as absence_count 
                FROM student_enroll_course,courses,class_has_course
                WHERE student_enroll_course.class_has_course_id = class_has_course.id AND class_has_course.course_id = courses.id AND student_enroll_course.student_id = ?`, id, function(error, rows, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                }
                res.send({ result: 'success', student: student, current_courses: rows });
                connection.release();
            });
        });
    });
});

router.put('/update', function(req, res, next) {
    if (req.body.id == undefined || req.body.id == '') {
        _global.sendError(res, null, "Student code is required");
        return;
    }
    if (req.body.name == undefined || req.body.name == '') {
        _global.sendError(res, null, "Name is required");
        return;
    }
    if (req.body.email == undefined || req.body.email == '') {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.email.indexOf('@') == -1) {
        _global.sendError(res, null, "Invalid Email");
        return;
    }
    if (req.body.phone == undefined || isNaN(req.body.phone)) {
        _global.sendError(res, null, "Invalid Phone Number");
        return;
    }
    var user_id = req.body.id;
    var new_last_name = _global.getLastName(req.body.name);
    var new_first_name = _global.getFirstName(req.body.name);
    var new_email = req.body.email;
    var new_phone = req.body.phone;
    var new_status = req.body.status ? req.body.status : 0;
    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        async.series([
                    //Start transaction
                    function(callback) {
                        connection.beginTransaction(function(error) {
                            if (error) callback(error);
                            else callback();
                        });
                    },
                    //update Student table
                    function(callback) {
                        connection.query(`UPDATE students SET status = ? WHERE id = ?`, [new_status,user_id], function(error, results, fields) {
                            if (error) {
                                console.log(error.message + "at Update student's status");
                                callback(error);
                            } else {
                                callback();
                            }
                        });
                    },
                    //update user table
                    function(callback) {
                        connection.query(`UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?`, [new_first_name,new_last_name,new_email,new_phone, user_id], function(error, results, fields) {
                            if (error) {
                                console.log(error.message + ' at Update Users info');
                                callback(error);
                            } else {
                                callback();
                            }
                        });
                    },
                    //Commit transaction
                    function(callback) {
                        connection.commit(function(error) {
                            if (error) callback(error);
                            else callback();
                        });
                    },
                ], function(error) {
                    if (error) {
                        _global.sendError(res, error.message);
                        connection.rollback(function() {
                            throw error;
                        });
                        throw error;
                    } else {
                        console.log('success updating student!---------------------------------------');
                        res.send({ result: 'success', message: 'Student Updated Successfully' });
                    }
                    connection.release();
                });
    });
});

//API mobile

router.post('/studying', function (req, res, next) {
    var teacher_id = req.body.teacher_id;
    var course_id = req.body.course_id;

    if(teacher_id && course_id){
        pool.getConnection(function(error, connection) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }

            var return_function = function(error, rows, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                }

                res.send({
                    result: 'success',
                    total_items: rows.length,
                    courses: rows
                });

                connection.release();
            };

            connection.query(`SELECT users.first_name, users.last_name, students.stud_id
                                FROM users join students on students.id = users.id 
                                join student_enroll_course on students.id = student_enroll_course.student_id 
                                join class_has_course on class_has_course.id = student_enroll_course.class_has_course_id
                                where class_has_course.course_id = ?`,
                [course_id], return_function);
        });
    }
    else {
        return res.status(401).send({
            result: 'failure',
            message: teacher_id === undefined ? 'teacher_id' : 'course_id' + 'is required'
        });
    }
});

module.exports = router;
