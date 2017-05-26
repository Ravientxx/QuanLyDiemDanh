var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];

router.get('/detail/:id', function(req, res, next) {
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT courses.*,semesters.name as semester_name,programs.name as program_name FROM courses,semesters,programs WHERE programs.id = courses.program_id AND courses.id = ? AND courses.semester_id = semesters.id LIMIT 1`, id, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            var course = rows[0];
            connection.query(`SELECT * FROM users,teacher_teach_course
                WHERE users.id = teacher_teach_course.teacher_id AND teacher_teach_course.course_id = ?`, id, function(error, rows, fields) {
                if (error) {
                    var message = error.message + ' at get lecturers/TAs';
                    _global.sendError(res, message);
                    throw message;
                }
                var lecturers = [];
                var TAs = [];
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].teacher_role == 0) {
                        lecturers.push(rows[i]);
                    } else {
                        TAs.push(rows[i]);
                    }
                }
                connection.query(`SELECT class_id, classes.name as class_name, classes.email as class_email,schedules 
                    FROM classes,class_has_course 
                    WHERE course_id = ? AND classes.id = class_has_course.class_id `, id, function(error, rows, fields) {
                    if (error) {
                        var message = error.message + ' at get schedule';
                        _global.sendError(res, message);
                        throw message;
                    }
                    res.send({ result: 'success', course: course, lecturers: lecturers, TAs: TAs,class_has_course: rows });
                    connection.release();
                });
            });
        });
    });
});
router.post('/list/current', function(req, res, next) {
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

            course_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = course_list;
            } else {
                for (var i = 0; i < course_list.length; i++) {
                    if (course_list[i].code.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        course_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        course_list[i].lecturers.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(course_list[i]);
                    }
                }
            }
            if (sort != 'none') {
                _global.sortListByKey(sort, search_list, 'last_name');
            }
            res.send({
                result: 'success',
                total_items: search_list.length,
                courses: _global.filterListByPage(page, limit, search_list)
            });

            connection.release();
        };
        if (class_id == 0) {
            connection.query(`SELECT courses.id,courses.code,courses.name,attendance_count,total_stud, 
                                (SELECT GROUP_CONCAT( CONCAT(users.first_name,' ',users.last_name) SEPARATOR "\r\n")
                                FROM teacher_teach_course,users 
                                WHERE users.id = teacher_teach_course.teacher_id AND 
                                    courses.id = teacher_teach_course.course_id AND 
                                    teacher_teach_course.teacher_role = 0) as lecturers 
                        FROM courses, class_has_course
                        WHERE class_has_course.course_id = courses.id AND 
                            courses.program_id = ? AND
                            courses.semester_id = (SELECT MAX(ID) FROM semesters)`,
                program_id, return_function);
        } else {
            connection.query(`SELECT courses.id,courses.code,courses.name,attendance_count,total_stud, 
                                (SELECT GROUP_CONCAT( CONCAT(users.first_name,' ',users.last_name) SEPARATOR "\r\n")
                                FROM teacher_teach_course,users 
                                WHERE users.id = teacher_teach_course.teacher_id AND 
                                    courses.id = teacher_teach_course.course_id AND 
                                    teacher_teach_course.teacher_role = 0) as lecturers 
                        FROM courses, class_has_course
                        WHERE class_has_course.course_id = courses.id AND 
                            courses.program_id = ? AND 
                            class_has_course.class_id = ? AND
                            courses.semester_id = (SELECT MAX(ID) FROM semesters)`, [program_id, class_id], return_function);
        }
    });
});
router.post('/list/previous', function(req, res, next) {
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

            course_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = course_list;
            } else {
                for (var i = 0; i < course_list.length; i++) {
                    if (course_list[i].code.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        course_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                        course_list[i].lecturers.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(course_list[i]);
                    }
                }
            }
            if (sort != 'none') {
                _global.sortListByKey(sort, search_list, 'last_name');
            }
            res.send({
                result: 'success',
                total_items: search_list.length,
                courses: _global.filterListByPage(page, limit, search_list)
            });

            connection.release();
        };
        if (class_id == 0) {
            connection.query(`SELECT courses.id,courses.code,courses.name,attendance_count,total_stud, 
                                (SELECT GROUP_CONCAT( CONCAT(users.first_name,' ',users.last_name) SEPARATOR "\r\n")
                                FROM teacher_teach_course,users 
                                WHERE users.id = teacher_teach_course.teacher_id AND 
                                    courses.id = teacher_teach_course.course_id AND 
                                    teacher_teach_course.teacher_role = 0) as lecturers 
                        FROM courses, class_has_course
                        WHERE class_has_course.course_id = courses.id AND 
                            courses.program_id = ? AND
                            courses.semester_id <> (SELECT MAX(ID) FROM semesters)`,
                program_id, return_function);
        } else {
            connection.query(`SELECT courses.id,courses.code,courses.name,attendance_count,total_stud, 
                                (SELECT GROUP_CONCAT( CONCAT(users.first_name,' ',users.last_name) SEPARATOR "\r\n")
                                FROM teacher_teach_course,users 
                                WHERE users.id = teacher_teach_course.teacher_id AND 
                                    courses.id = teacher_teach_course.course_id AND 
                                    teacher_teach_course.teacher_role = 0) as lecturers 
                        FROM courses, class_has_course
                        WHERE class_has_course.course_id = courses.id AND 
                            courses.program_id = ? AND 
                            class_has_course.class_id = ? AND
                            courses.semester_id <> (SELECT MAX(ID) FROM semesters)`, [program_id, class_id], return_function);
        }
    });
});
router.post('/add', function(req, res, next) {
    if (req.body.code === undefined || req.body.code == '') {
        _global.sendError(res, null, "Course code is required");
        return;
    }
    if (req.body.name === undefined || req.body.name == '') {
        _global.sendError(res, null, "Course name is required");
        return;
    }
    if (req.body.lecturers === undefined || req.body.lecturers.length == 0) {
        _global.sendError(res, null, "Lecturers is required");
        return;
    }
    if (req.body.program_id === undefined || req.body.program_id == 0) {
        _global.sendError(res, null, "Program is required");
        return;
    }
    if (req.body.class_id === undefined || req.body.class_id == 0) {
        _global.sendError(res, null, "Class is required");
        return;
    }
    if (req.body.schedule === undefined || req.body.schedule == '') {
        _global.sendError(res, null, "Schedule is required");
        return;
    }
    var new_name = req.body.name;
    var new_code = req.body.code;
    var new_lecturers = req.body.lecturers;
    var new_TAs = req.body.TAs === undefined ? [] : req.body.TAs;
    var new_program_id = req.body.program_id;
    var new_class_id = req.body.class_id;
    var new_note = req.body.note === undefined ? null : req.body.note;
    var new_office_hour = req.body.office_hour === undefined ? null : req.body.office_hour;
    var new_isAddStudentFromClass = req.body.isAddStudentFromCLass === undefined ? true : req.body.isAddStudentFromCLass;
    var new_isAddStudentFromFile = req.body.isAddStudentFromFile === undefined ? false : req.body.isAddStudentFromFile;
    var new_schedule = req.body.schedule;
    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT id FROM courses WHERE code=? AND semester_id = (SELECT MAX(id) FROM semesters)  LIMIT 1`, new_code, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            //check course with same code in the same semester exist
            if (rows.length > 0) {
                _global.sendError(res, null, "The course already existed this semester");
                throw "The course already existed this semester";
            }
            console.log('start adding course!---------------------------------------');
            connection.query(`SELECT MAX(id) as id FROM semesters`, function(error, rows, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                }
                var new_course = {
                    code: new_code,
                    name: new_name,
                    semester_id: rows[0].id,
                    program_id: new_program_id,
                    note: new_note,
                    office_hour: new_office_hour,
                };
                connection.beginTransaction(function(error) {
                    if (error) {
                        _global.sendError(res, error.message);
                        throw error;
                    }
                    //add course
                    connection.query(`INSERT INTO courses SET ?`, new_course, function(error, results, fields) {
                        if (error) {
                            console.log('insert courses error');
                            _global.sendError(res, error.message);
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        var new_course_id = results.insertId;
                        var new_class_has_course = {
                            class_id: new_class_id,
                            course_id: new_course_id,
                            schedules: new_schedule
                        };
                        var new_teacher_teach_course = [];
                        //// Lecturers
                        for (var i = 0; i < new_lecturers.length; i++) {
                            var temp = [];
                            temp.push(new_lecturers[i].id);
                            temp.push(new_course_id);
                            temp.push(_global.lecturer_role);
                            new_teacher_teach_course.push(temp);
                        }
                        //// TAs
                        for (var i = 0; i < new_TAs.length; i++) {
                            var temp = [];
                            temp.push(new_TAs[i].id);
                            temp.push(new_course_id);
                            temp.push(_global.ta_role);
                            new_teacher_teach_course.push(temp);
                        }
                        var started_class_has_course = started_teacher_teach_course = started_student_enroll_course = false;
                        while (!started_class_has_course && !started_teacher_teach_course && !started_student_enroll_course) {
                            //add class_has_course
                            if (started_class_has_course == false) {
                                started_class_has_course = true;
                                connection.query(`INSERT INTO class_has_course SET ?`, new_class_has_course, function(error, results, fields) {
                                    if (error) {
                                        console.log(error.message + ' at insert class_has_course');
                                        _global.sendError(res, error.message + ' at insert class_has_course');
                                        return connection.rollback(function() {
                                            throw error;
                                        });
                                    }
                                    console.log('inserted class_has_course');
                                });
                            }
                            // add teacher_teach_course
                            if (started_teacher_teach_course == false) {
                                started_teacher_teach_course = true;
                                connection.query(`INSERT INTO teacher_teach_course (teacher_id,course_id,teacher_role) VALUES ?`, [new_teacher_teach_course], function(error, results, fields) {
                                    if (error) {
                                        console.log(error.message + ' at insert teacher_teach_course');
                                        _global.sendError(res, error.message + ' at insert teacher_teach_course');
                                        return connection.rollback(function() {
                                            throw error;
                                        });
                                    }
                                    console.log('inserted teacher_teach_course');
                                });
                            }
                            //add student_enroll_course
                            if (started_student_enroll_course == false) {
                                started_student_enroll_course = true;
                                if (new_isAddStudentFromClass) {
                                    connection.query(`SELECT id FROM students WHERE class_id = ?`, new_class_id, function(error, results, fields) {
                                        if (error) {
                                            console.log(error.message + ' at get students from class');
                                            _global.sendError(res, error.message + ' at get students from class');
                                            return connection.rollback(function() {
                                                throw error;
                                            });
                                        }
                                        //Get students from class
                                        var new_student_enroll_course = [];
                                        for (var i = 0; i < results.length; i++) {
                                            var temp = [];
                                            temp.push(new_course_id);
                                            temp.push(results[i].id);
                                            new_student_enroll_course.push(temp);
                                        }

                                        //Add students from file

                                        //
                                        connection.query(`INSERT INTO student_enroll_course (course_id,student_id) VALUES ?`, [new_student_enroll_course], function(error, results, fields) {
                                            if (error) {
                                                console.log(error.message + ' at insert student_enroll_course');
                                                _global.sendError(res, error.message + ' at insert student_enroll_course');
                                                return connection.rollback(function() {
                                                    throw error;
                                                });
                                            }
                                            console.log('inserted student_enroll_course');
                                        });
                                    });
                                }
                            }
                        }
                        connection.commit(function(error) {
                            if (error) {
                                _global.sendError(res, error.message);
                                console.log('commit error');
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            console.log('success adding course!---------------------------------------');
                            res.send({ result: 'success', message: 'Course Added Successfully' });
                        });
                    });
                });
            });
            connection.release();
        });
    });
});
module.exports = router;
