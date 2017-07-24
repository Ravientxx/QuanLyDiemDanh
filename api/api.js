var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var jwt = require('jsonwebtoken');
var async = require("async");
var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, _global.jwt_secret_key, function(error, decoded) {
            if (error) {
                //return res.json(error);
                if(error.name == 'TokenExpiredError'){
                    return res.status(401).send({
                        success: false,
                        message: error.message
                    });
                }
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.use('/teacher', require('./teacher'));
router.use('/absence-request', require('./absence-request'));
router.use('/student', require('./student'));
router.use('/schedule', require('./schedule'));
router.use('/course', require('./course'));
router.use('/attendance', require('./attendance'));
router.use('/user', require('./user'));
router.use('/semester', require('./semester'));
router.use('/feedback', require('./feedback'));
router.use('/check-attendance', require('./check-attendance'));
router.use('/quiz', require('./quiz'));

router.get('/semesters-programs-classes', function(req, res, next) {
    var program_id = req.body.program_id;
    var class_id = req.body.class_id;
    var semester_id = req.body.semester_id;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(`SELECT * FROM semesters`, function(error, result, fields) {         
            if (error){
                done(error);
                return console.log(error);
            }
            var semesters = result.rows;
            connection.query(`SELECT * FROM programs`, function(error, result, fields) {
                if (error) {
                    done(error);
                    return console.log(error);
                }
                var programs = result.rows;
                connection.query(`SELECT * FROM classes`, function(error, result, fields) {
                    if (error) {
                        done(error);
                        return console.log(error);
                    }
                    var classes = result.rows;
                    res.send({ result: 'success', semesters: semesters, programs: programs, classes: classes });
                    done();
                });
            });
        });
    });
});

router.post('/semester/create', function(req, res, next) {
    if (req.body.name == undefined || req.body.name == '') {
        _global.sendError(res, null, "Name is required");
        return;
    }
    if (req.body.start_date == undefined || req.body.start_date == 0) {
        _global.sendError(res, null, "Start date is required");
        return;
    }
    if (req.body.end_date == undefined || req.body.end_date == 0) {
        _global.sendError(res, null, "End date is required");
        return;
    }
    var semester = [
        req.body.name,
        req.body.start_date,
        req.body.end_date,
        req.body.vacation_time,
    ];
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done(error);
            return console.log(error);
        }
        connection.query(format(`SELECT * FROM semesters WHERE name = %L`,req.body.name),function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done(error);
                return console.log(error);
            }
            if(result.rowCount > 0){
                _global.sendError(res, null, "Semester's existed");
                done();
                return console.log("Semester's existed");
            }else{
                connection.query(format(`INSERT INTO semesters (name,start_date,end_date,vacation_time) VALUES %L`,semester),function(error, rows, fields) {
                    if (error) {
                        _global.sendError(res, error.message);
                        done(error);
                        return console.log(error);
                    }
                    res.send({ result: 'success', message: 'Semester added successfully'});
                    done();
                });
            }
        });
    });
});

router.post('/class/create', function(req, res, next) {
    if (req.body.name == undefined || req.body.name == '') {
        _global.sendError(res, null, "Name is required");
        return;
    }
    if (req.body.email == undefined || req.body.email == 0) {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.email.indexOf('@') == -1) {
        _global.sendError(res, null, "Invalid Email");
        return;
    }
    var _class = [
        req.body.name,
        req.body.email,
        req.body.program_id
    ];
    var student_list = req.body.student_list;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done(error);
            return console.log(error);
        }
        connection.query(format(`SELECT * FROM classes WHERE name = %L`,req.body.name),function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done(error);
                return console.log(error);
            }
            if(result.rowCount > 0){
                _global.sendError(res, null, "Class's existed");
                done(error);
                return console.log("Class's existed");
            }else{
                connection.query(format(`INSERT INTO classes (name,email,program_id) VALUES %L`,_class),function(error, result, fields) {
                    if (error) {
                        _global.sendError(res, error.message);
                        done(error);
                        return console.log(error);
                    }
                    var class_id = result.rows[0].id;
                    if(student_list == undefined || student_list == []){
                        res.send({ result: 'success', message: 'Class added successfully'});
                        done();
                        return;
                    }else{
                        async.each(student_list, function(student, callback) {
                            connection.query(format(`SELECT id FROM students WHERE stud_id = %L LIMIT 1`, student.stud_id), function(error, result, fields) {
                                if (error) {
                                    console.log(error.message + ' at get student_id from datbase (file)');
                                    callback(error);
                                } else {
                                    if(result.rowCount == 0){
                                        //new student to system
                                        var new_user = [
                                            _global.getFirstName(student.name),
                                            _global.getLastName(student.name),
                                            student.stud_id + '@student.hcmus.edu.vn',
                                            student.phone,
                                            _global.role.student,
                                            bcrypt.hashSync(student.stud_id.toString(), 10),
                                        ];
                                        connection.query(format(`INSERT INTO users (first_name,last_name,email,phone,role_id,password) VALUES %L`, new_user), function(error, results, fields) {
                                            if (error) {
                                                callback(error);
                                            } else {
                                                var student_id = results.rows[0].id;
                                                var new_student = [
                                                    student_id,
                                                    student.stud_id,
                                                    class_id,
                                                ];
                                                connection.query(format(`INSERT INTO students (id,stud_id,class_id) VALUES %L`, new_student), function(error, results, fields) {
                                                    if (error) {
                                                        callback(error);
                                                    } else {
                                                        callback();
                                                    }
                                                });
                                            }
                                        });
                                    }else{
                                        //old student => ignore
                                        callback();
                                    }
                                }
                            });
                        }, function(error) {
                            if (error) {
                                _global.sendError(res, error.message,'Error at add student to class from file');
                                done(error);
                                return console.log(error);
                            }
                            else {
                                res.send({ result: 'success', message: 'Class added successfully'});
                                done();
                            }
                        });
                    }
                });
            }
        });
    });
});

router.post('/program/create', function(req, res, next) {
    if (req.body.name == undefined || req.body.name == '') {
        _global.sendError(res, null, "Name is required");
        return;
    }
    if (req.body.code == undefined || req.body.start_date == 0) {
        _global.sendError(res, null, "Code is required");
        return;
    }
    var program = [
        req.body.name,
        req.body.code
    ];
    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
        connection.query(format(`SELECT * FROM programs WHERE code = %L OR name = %L`,program[0],program[1]),function(error, result, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            if(result.rowCount > 0){
                _global.sendError(res, null, "Program's existed");
                done();
                return console.log("Program's existed");
            }else{
                connection.query(format(`INSERT INTO programs (name,code) VALUES %L`,program),function(error, rows, fields) {
                    if (error) {
                        _global.sendError(res, error.message);
                        done();
                        return console.log(error);
                    }
                    res.send({ result: 'success', message: 'Program added successfully'});
                    done();
                });
            }
        });
    });
});

module.exports = router;
