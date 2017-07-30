var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");
var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');

router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    var sort = req.body.sort != null ? req.body.sort : 'none';

    var program_id = req.body.program_id != null ? req.body.program_id : 1;
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

            class_list = result.rows;
            var search_list = [];
            if (searchText == null) {
                search_list = class_list;
            } else {
                for (var i = 0; i < class_list.length; i++) {
                    if (class_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(class_list[i]);
                    }
                }
            }
            if (sort != 'none') {
                _global.sortListByKey(sort, search_list, 'name');
            }
            if (limit != -1) {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    classes: _global.filterListByPage(page, limit, search_list)
                });
            } else {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    classes: search_list
                });
            }
            done();
        };
        connection.query(format(`SELECT *, (SELECT COUNT(id) FROM students WHERE class_id = classes.id) as total_stud
						FROM classes WHERE program_id = %L
						ORDER BY classes.id`,program_id), return_function);
    });
});

router.post('/create', function(req, res, next) {
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
    var _class = [[
        req.body.name,
        req.body.email,
        req.body.program_id
    ]];
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
                                        var new_user = [[
                                            _global.getFirstName(student.name),
                                            _global.getLastName(student.name),
                                            student.stud_id + '@student.hcmus.edu.vn',
                                            student.phone,
                                            _global.role.student,
                                            bcrypt.hashSync(student.stud_id.toString(), 10),
                                        ]];
                                        connection.query(format(`INSERT INTO users (first_name,last_name,email,phone,role_id,password) VALUES %L`, new_user), function(error, results, fields) {
                                            if (error) {
                                                callback(error);
                                            } else {
                                                var student_id = results.rows[0].id;
                                                var new_student = [[
                                                    student_id,
                                                    student.stud_id,
                                                    class_id,
                                                ]];
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

module.exports = router;