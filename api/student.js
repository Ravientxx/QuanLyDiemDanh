var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    var sort = req.body.sort != null ? req.body.sort : 'none';

    var program_id = req.body.program_id != null ? req.body.program_id : 1;
    var class_id = req.body.class_id != null ? req.body.class_id : 0;
    var status = req.body.status != null ? req.body.status : 0;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        var return_function = function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }

            student_list = result.rows;
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
            if (limit == -1) {
                //all
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    student_list: search_list
                });
            } else {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    student_list: _global.filterListByPage(page, limit, search_list)
                });
            }
            done();
        };
        if (class_id == 0) {
            connection.query(format(`SELECT users.id, students.stud_id as code, CONCAT(users.first_name,' ',users.last_name) as name, users.phone, students.status, students.current_courses as enroll_course, classes.name as class_name
                                FROM users,students,classes
                                WHERE users.id = students.id AND classes.id = students.class_id AND classes.program_id = %L AND students.status = %L`, program_id, status), return_function);
        } else {
            connection.query(format(`SELECT users.id, students.stud_id as code, CONCAT(users.first_name,' ',users.last_name) as name, users.phone, students.status, students.current_courses as enroll_course, classes.name as class_name
                                FROM users,students,classes
                                WHERE users.id = students.id AND classes.id = students.class_id AND classes.id = %L AND classes.program_id = %L AND students.status = %L`, class_id, program_id, status), return_function);
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
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }

        connection.query(format(`SELECT stud_id FROM students WHERE stud_id = %L LIMIT 1`, new_code), function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            //check email exist
            if (result.rowCount > 0) {
                _global.sendError(res, null, "Student code already existed");
                done();
                return console.log("Student code already existed");
            }
            connection.query(format(`SELECT email FROM users WHERE email = %L LIMIT 1`, new_email), function(error, result, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    done();
                    return console.log(error);
                }
                //check email exist
                if (result.rowCount > 0) {
                    _global.sendError(res, "Email already existed");
                    done();
                    return console.log("Email already existed");
                }
                //new data to users table
                var new_password = new_email.split('@')[0];
                var new_user = [[
                    new_first_name,
                    new_last_name,
                    new_email,
                    new_phone,
                    bcrypt.hashSync(new_password, 10),
                    _global.role.student
                ]];
                var new_student = [];
                async.series([
                    //Start transaction
                    function(callback) {
                        connection.query('BEGIN', (error) => {
                            if (error) callback(error);
                            else callback();
                        });
                    },
                    //add data to user table
                    function(callback) {
                        connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L RETURNING id', new_user), function(error, result, fields) {
                            if (error) {
                                callback(error);
                            }else{
                                new_student = [[
                                    result.rows[0].id,
                                    new_code,
                                    new_class_id,
                                    new_note
                                ]];
                                callback();
                            }
                        });
                    },
                    //insert student
                    function(callback) {
                        connection.query(format('INSERT INTO students VALUES %L', new_student), function(error, result, fields) {
                            if (error) {
                                callback(error);
                            }else{
                                callback();
                            }
                        });
                    },
                    //Commit transaction
                    function(callback) {
                        connection.query('COMMIT', (error) => {
                            if (error) callback(error);
                            else callback();
                        });
                    },
                ], function(error) {
                    if (error) {
                        _global.sendError(res, error.message);
                        connection.query('ROLLBACK', (error) => {
                            if (error) return console.log(error);
                        });
                        done();
                        return console.log(error);
                    } else {
                        console.log('success adding student!');
                        res.send({ result: 'success', message: 'Student Added Successfully' });
                        done();
                    }
                });
            });
        });
    });
});

router.get('/detail/:id', function(req, res, next) {
    var id = req.params['id'];
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT users.*,students.stud_id AS code, students.status,classes.id AS class_id ,classes.name AS class_name 
            FROM users,students,classes 
            WHERE users.id = %L AND users.id = students.id AND students.class_id = classes.id  LIMIT 1`, id), function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            var student = result.rows[0];
            connection.query(format(`SELECT courses.id, code, name, attendance_status, enrollment_status,
                                (SELECT array_to_string(array_agg(CONCAT(users.first_name,' ',users.last_name)), E'\r\n')
                                FROM teacher_teach_course,users 
                                WHERE users.id = teacher_teach_course.teacher_id AND 
                                    courses.id = teacher_teach_course.course_id AND 
                                    teacher_teach_course.teacher_role = 0) as lecturers,
                                (SELECT COUNT(attendance_detail.attendance_id) 
                                FROM attendance,attendance_detail 
                                WHERE attendance_detail.student_id = student_enroll_course.student_id AND attendance_detail.attendance_type = 0 AND attendance.course_id = courses.id AND attendance.id = attendance_detail.attendance_id ) as absence_count 
                FROM student_enroll_course,courses,class_has_course
                WHERE student_enroll_course.class_has_course_id = class_has_course.id AND class_has_course.course_id = courses.id AND student_enroll_course.student_id = %L`, id), function(error, result, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    done();
                    return console.log(error);
                }
                res.send({ result: 'success', student: student, current_courses: result.rows });
                done();
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
    var new_avatar = req.body.avatar;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }

        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //update Student table
            function(callback) {
                connection.query(format(`UPDATE students SET status = %L WHERE id = %L`, new_status, user_id), function(error, result, fields) {
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
                if(new_avatar != null){
                    connection.query(format(`UPDATE users SET first_name = %L, last_name = %L, email = %L, phone = %L ,avatar = %L WHERE id = %L`, new_first_name, new_last_name, new_email, new_phone, new_avatar, user_id), function(error, result, fields) {
                        if (error) {
                            console.log(error.message + ' at Update Users info');
                            callback(error);
                        } else {
                            callback();
                        }
                    });
                }else{
                    connection.query(format(`UPDATE users SET first_name = %L, last_name = %L, email = %L, phone = %L WHERE id = %L`, new_first_name, new_last_name, new_email, new_phone, user_id), function(error, result, fields) {
                        if (error) {
                            console.log(error.message + ' at Update Users info');
                            callback(error);
                        } else {
                            callback();
                        }
                    });
                }
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success updating student!---------------------------------------');
                res.send({ result: 'success', message: 'Student Updated Successfully' });
                done();
            }
        });
    });
});

router.post('/import', function(req, res, next) {
    if (req.body.class_name == undefined || req.body.class_name == '') {
        _global.sendError(res, null, "Class name is required");
        return;
    }
    if (req.body.student_list == undefined || req.body.student_list.length == 0) {
        _global.sendError(res, null, "Student list is required");
        return;
    }
    var class_name = req.body.class_name;
    var student_list = req.body.student_list;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        var class_id = 0;
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //Get class id
            function(callback) {
                connection.query(format(`SELECT id FROM classes WHERE UPPER(name) = UPPER(%L) LIMIT 1`, class_name), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        if (result.rowCount == 0) {
                            //new class => insert
                            var program_code = _global.getProgramCodeFromClassName(class_name);
                            connection.query(format(`SELECT id FROM programs WHERE UPPER(code) = UPPER(%L) LIMIT 1`, program_code), function(error, result, fields) {
                                if (error) {
                                    callback(error);
                                } else {
                                    if (result.rowCount == 0) {
                                        //program not found
                                        callback({ message: 'Program not found' });
                                    } else {
                                        var email = class_name.toLowerCase() + '@student.hcmus.edu.vn';
                                        var new_class = [[
                                            class_name,
                                            email,
                                            result.rows[0].id
                                        ]];
                                        connection.query(format(`INSERT INTO classes VALUES %L RETURNING id`, new_class), function(error, result, fields) {
                                            if (error) {
                                                callback(error);
                                            } else {
                                                class_id = result.rows[0].id;
                                                callback();
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            class_id = result.rows[0].id;
                            callback();
                        }
                    }
                });
            },
            //Insert student into class
            function(callback) {
                async.each(student_list, function(student, callback) {
                    connection.query(format(`SELECT id FROM students WHERE stud_id = %L LIMIT 1`, student.stud_id), function(error, result, fields) {
                        if (error) {
                            console.log(error.message + ' at get student_id from datbase (file)');
                            callback(error);
                        } else {
                            if (result.rowCount == 0) {
                                //new student to system
                                var new_user = [[
                                    _global.getFirstName(student.name),
                                    _global.getLastName(student.name),
                                    student.stud_id + '@student.hcmus.edu.vn',
                                    student.phone,
                                    _global.role.student,
                                    bcrypt.hashSync(student.stud_id.toString(), 10),
                                ]];
                                connection.query(format(`INSERT INTO users (first_name,last_name,email,phone,role_id,password) VALUES %L RETURNING id`, new_user), function(error, result, fields) {
                                    if (error) {
                                        callback(error);
                                    } else {
                                        var student_id = result.rows[0].id;
                                        var new_student = [[
                                            student_id,
                                            student.stud_id,
                                            class_id,
                                        ]];
                                        connection.query(format(`INSERT INTO students (id,stud_id,class_id) VALUES %L`, new_student), function(error, result, fields) {
                                            if (error) {
                                                callback(error);
                                            } else {
                                                callback();
                                            }
                                        });
                                    }
                                });
                            } else {
                                //old student => ignore
                                callback();
                            }
                        }
                    });
                }, function(error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success import students!---------------------------------------');
                res.send({ result: 'success', message: 'Students imported successfully' });
                done();
            }
        });
    });
});

router.post('/export', function(req, res, next) {
    if (req.body.classes_id == undefined || req.body.classes_id.length == 0) {
        _global.sendError(res, null, "Classes id is required");
        return;
    }
    var classes_id = req.body.classes_id;
    var student_lists = [];
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //get student from each class
            function(callback) {
                async.each(classes_id, function(class_id, callback) {
                    connection.query(format(`SELECT users.id, students.stud_id as code, CONCAT(users.first_name,' ',users.last_name) as name, users.phone, classes.name as class_name
                                FROM users,students,classes
                                WHERE users.id = students.id AND classes.id = students.class_id AND classes.id = %L`, class_id), function(error, result, fields) {
                        if (error) {
                            console.log(error.message + ' at get student by class');
                            callback(error);
                        } else {
                            student_lists.push(result.rows);
                            callback();
                        }
                    });
                }, function(error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success export students!---------------------------------------');
                res.send({ result: 'success', message: 'Students exported successfully', student_lists: student_lists });
                done();
            }
        });
    });
});

router.post('/export-examinees', function(req, res, next) {
    if (req.body.class_has_course_id == undefined || req.body.class_has_course_id.length == 0) {
        _global.sendError(res, null, "class_has_course_id is required");
        return;
    }
    var class_has_course_ids = req.body.class_has_course_id;
    var student_lists = [];
    var examinees_lists = [];
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //get student from each class_has_course
            function(callback) {
                async.each(class_has_course_ids, function(class_has_course_id, callback) {
                    connection.query(format(`SELECT student_enroll_course.*,users.last_name,users.first_name, students.stud_id as student_code, students.id,
                                    class_has_course.class_id, class_has_course.course_id, class_has_course.attendance_count 
                        FROM student_enroll_course,users, students, class_has_course 
                        WHERE class_has_course.id = class_has_course_id AND users.id = student_enroll_course.student_id AND users.id = students.id AND class_has_course_id = %L 
                        ORDER BY students.stud_id`, class_has_course_id), function(error, result, fields) {
                        if (error) {
                            console.log(error.message + ' at get student by class_has_course');
                            callback(error);
                        } else {
                            student_lists.push(result.rows);
                            callback();
                        }
                    });
                }, function(error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //check student attendance progression from each list
            function(callback) {
                async.eachOf(student_lists, function(student_list, student_list_index, callback) {
                    var examinees_list = [];
                    async.eachOf(student_list, function(student, student_index, callback) {
                        if (student.attendance_status == _global.attendance_status.exemption) {
                            //Sinh viên được miễn điểm danh
                            examinees_list.push(student);
                            callback();
                        } else {
                            //Sinh viên ko được miễn điểm danh
                            //count absences and total attendance
                            connection.query(format(`SELECT COUNT(*) as count, attendance_type FROM attendance,attendance_detail 
                                WHERE attendance.closed = TRUE AND id = attendance_id AND student_id = %L AND course_id = %L AND class_id = %L 
                                GROUP BY attendance_type`, student.id, student.course_id, student.class_id), function(error, result, fields) {
                                if (error) {
                                    console.log(error.message + ' at count attendance_details');
                                    callback(error);
                                } else {
                                    var total = 0;
                                    var absence = 0;
                                    for (var i = 0; i < result.rowCount; i++) {
                                        if (result.rows[i].attendance_type == _global.attendance_type.absent) absence = (+result.rows[i].count);
                                        total += (+result.rows[i].count);
                                    }
                                    console.log(student.student_code + ' ' + absence + ' ' + total + ' ' +Math.floor(100 * absence / total));
                                    if (Math.floor(100 * absence / total) <= 30) {
                                        examinees_list.push(student);
                                    }
                                    callback();
                                }
                            });
                        }
                    }, function(error) {
                        if (error) {
                            callback(error);
                        } else {
                            examinees_lists.push(examinees_list);
                            callback();
                        }
                    });
                }, function(error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success export examinees!---------------------------------------');
                res.send({ result: 'success', message: 'Examinees exported successfully', examinees_lists: examinees_lists });
                done();
            }
        });
    });
});

router.post('/export-attendance-summary', function(req, res, next) {
    if (req.body.class_has_course_id == undefined || req.body.class_has_course_id.length == 0) {
        _global.sendError(res, null, "class_has_course_id is required");
        return;
    }
    var class_has_course_ids = req.body.class_has_course_id;
    var student_lists = [];
    var attendance_summary_lists = [];
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //get student from each class_has_course
            function(callback) {
                async.each(class_has_course_ids, function(class_has_course_id, callback) {
                    connection.query(format(`SELECT student_enroll_course.*,users.last_name,users.first_name, students.stud_id as student_code, students.id,
                                    class_has_course.class_id, class_has_course.course_id, class_has_course.attendance_count 
                        FROM student_enroll_course,users, students, class_has_course 
                        WHERE class_has_course.id = class_has_course_id AND users.id = student_enroll_course.student_id AND users.id = students.id AND class_has_course_id = %L 
                        ORDER BY students.stud_id`, class_has_course_id), function(error, result, fields) {
                        if (error) {
                            console.log(error.message + ' at get student by class_has_course');
                            callback(error);
                        } else {
                            student_lists.push(result.rows);
                            callback();
                        }
                    });
                }, function(error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //check student attendance progression from each list
            function(callback) {
                async.eachOf(student_lists, function(student_list, student_list_index, callback) {
                    var attendance_summary_list = [];
                    async.eachOf(student_list, function(student, student_index, callback) {
                        if (student.attendance_status == _global.attendance_status.exemption) {
                            //Sinh viên được miễn điểm danh => bỏ qua
                            callback();
                        } else {
                            //Sinh viên ko được miễn điểm danh
                            //count absences and total attendance
                            connection.query(format(`SELECT COUNT(*) as count, attendance_type FROM attendance,attendance_detail 
                                WHERE attendance.closed = TRUE AND id = attendance_id AND student_id = %L AND course_id = %L AND class_id = %L 
                                GROUP BY attendance_type`, student.id, student.course_id, student.class_id), function(error, result, fields) {
                                if (error) {
                                    console.log(error.message + ' at count attendance_details');
                                    callback(error);
                                } else {
                                    var total = 0;
                                    var absence = 0;
                                    for (var i = 0; i < result.rowCount; i++) {
                                        if (result.rows[i].attendance_type == _global.attendance_type.absent) absence = (+result.rows[i].count);
                                        total += (+result.rows[i].count);
                                    }
                                    student['absent_count'] = +absence;
                                    student['absent_percentage'] = Math.floor(100 * absence / total) + '%';
                                    attendance_summary_list.push(student);
                                    callback();
                                }
                            });
                        }
                    }, function(error) {
                        if (error) {
                            callback(error);
                        } else {
                            attendance_summary_lists.push(attendance_summary_list);
                            callback();
                        }
                    });
                }, function(error) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success export attendance summary!---------------------------------------');
                res.send({ result: 'success', message: 'Attendance summary exported successfully', attendance_summary_lists: attendance_summary_lists });
                done();
            }
        });
    });
});

router.post('/detail-by-code', function(req, res, next) {
    if (req.body.code == undefined || req.body.code == '') {
        _global.sendError(res, null, "Student code is required");
        return;
    }
    var student_code = req.body.code;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT * FROM users,students 
            WHERE students.stud_id = %L AND users.id = students.id LIMIT 1`, student_code), function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            if (result.rowCount == 0) {
                res.send({ result: 'failure', message: 'Student not found' });
            } else {
                res.send({ result: 'success', student: result.rows[0] });
            }
            done();
        });
    });
});

router.post('/change-attendance-status', function(req, res, next) {
    if (req.body.student_id == undefined || req.body.student_id == 0) {
        _global.sendError(res, null, "Student id is required");
        return;
    }
    if (req.body.course_id == undefined || req.body.course_id == 0) {
        _global.sendError(res, null, "course id is required");
        return;
    }
    if (req.body.class_id == undefined || req.body.class_id == 0) {
        _global.sendError(res, null, "class id is required");
        return;
    }
    if (req.body.status == undefined) {
        _global.sendError(res, null, "status is required");
        return;
    }
    var student_id = req.body.student_id;
    var course_id = req.body.course_id;
    var class_id = req.body.class_id;
    var status = req.body.status;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT id FROM class_has_course WHERE class_id = %L AND course_id = %L LIMIT 1`, class_id, course_id), function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                return console.log(error);
            }
            if (result.rowCount == 0) {
                res.send({ result: 'failure', message: 'class_has_course not found' });
                done();
                return;
            } else {
                connection.query(format(`UPDATE student_enroll_course SET attendance_status = %L 
                    WHERE student_id = %L AND class_has_course_id = %L`, status, student_id, result.rows[0].id), function(error, result, fields) {
                    if (error) {
                        _global.sendError(res, error.message);
                        done();
                        return console.log(error);
                    }
                    res.send({ result: 'success', message: 'Change attendance status successfully' });
                    done();
                });
            }
        });
    });
});

router.post('/update-interaction', function(req, res, next) {
    if (req.body.id == undefined || req.body.id == 0) {
        _global.sendError(res, null, "Student id is required");
        return;
    }
    if (req.body.class_id == undefined || req.body.class_id == 0) {
        _global.sendError(res, null, "Class id is required");
        return;
    }
    if (req.body.course_id == undefined || req.body.course_id == 0) {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.interaction_type == undefined) {
        _global.sendError(res, null, "Interaction type is required");
        return;
    }
    var student_id = req.body.id;
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    var interaction_type = req.body.interaction_type;
    var class_has_course_id = 0;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //get class_has_course_id
            function(callback) {
                connection.query(format(`SELECT id FROM class_has_course WHERE class_id = %L AND course_id = %L`, class_id, course_id), function(error, result, fields) {
                    if (error) {
                        console.log(error.message + "at get class_has_course_id");
                        callback(error);
                    } else {
                        class_has_course_id = result.rows[0].id;
                        callback();
                    }
                });
            },
            //update user interaction
            function(callback) {
                var query = 'UPDATE student_enroll_course ';
                switch(interaction_type){
                    case _global.student_interaction_type.answer_question:
                        query += 'SET answered_questions = answered_questions + 1 ';
                    break;
                    case _global.student_interaction_type.discuss:
                        query += 'SET discussions = discussions + 1 ';
                    break;
                    case _global.student_interaction_type.present:
                        query += 'SET presentations = presentations + 1 ';
                    break;
                }
                query += 'WHERE class_has_course_id = %L AND student_id = %L ';
                connection.query(format(query, class_has_course_id, student_id), function(error, result, fields) {
                    if (error) {
                        console.log(error.message + ' at Update Student interaction');
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done(error);
                return console.log(error);
            } else {
                console.log('success updating student interaction!---------------------------------------');
                res.send({ result: 'success', message: 'Student Interaction Updated Successfully' });
                done();
            }
        });
    });
});
module.exports = router;
