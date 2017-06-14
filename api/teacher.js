var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var queryBuilder = require('../query.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];
var async = require("async");

router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.default_limit;
    var sort = req.body.sort;

    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT teachers.id,first_name,last_name,phone,email,current_courses 
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
                    if (teacher_list[i].first_name.toLowerCase().indexOf(searchText.toLowerCase()) != -1 || teacher_list[i].last_name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(teacher_list[i]);
                    }
                }
            }
            if(sort != 'none'){
                _global.sortListByKey(sort,search_list,'last_name');
            }
            res.send({ 
                result: 'success', 
                total_items: search_list.length, 
                page: page,
                limit: limit,
                teacher_list: _global.filterListByPage(page, limit, search_list) 
            });

            connection.release();
        });
    });
});

router.get('/detail/:id', function(req, res, next) {
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT users.id,last_name,first_name,email,phone,current_courses FROM users join teachers on users.id = teachers.id WHERE users.id = ? LIMIT 1`,id,function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            var teacher = rows[0];
            connection.query(`SELECT courses.id, teacher_teach_course.teacher_role, courses.code AS course_code, courses.name AS course_name,courses.attendance_count,programs.name AS program_name, semesters.name AS semester_name 
                FROM teacher_teach_course , courses, programs , semesters 
                WHERE teacher_teach_course.course_id = courses.id AND teacher_teach_course.teacher_id = ? AND programs.id = courses.program_id 
                GROUP BY courses.code`, id, function(error, rows, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    throw error;
                }
                res.send({ result: 'success', teacher: teacher,teaching_courses: rows});
                connection.release();
            });
        });
    });
});

/**
* @swagger
* /api/teacher/add:
*   post:
*     summary: Add a teacher
*     description: 
*     tags: [Teacher]
*     produces:
*       - application/json
*     parameters:
*       - name: firstname
*         description: user firstname
*         in: formData
*         required: true
*         type: string
*       - name: lastname
*         description: user lastname
*         in: formData
*         required: true
*         type: string
*       - name: email
*         description: user email
*         in: formData
*         required: true
*         type: string
*         format: email
*       - name: phone
*         description: user phone
*         in: formData
*         type: string
*     responses:
*       200:
*         description: json
*/
router.post('/add', function(req, res, next) {
    if (req.body.first_name == ''){
        _global.sendError(res, null, "First name is required");
        return;
    }
    if (req.body.last_name == ''){
        _global.sendError(res, null, "Last name is required");
        return;
    }
    if (req.body.email == ''){
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.email.indexOf('@') == -1){
        _global.sendError(res, null, "Invalid Email");
        return;
    }
    if (isNaN(req.body.phone)){
        _global.sendError(res, null, "Invalid Phone Number");
        return;
    }
    var new_first_name = req.body.first_name;    
    var new_last_name = req.body.last_name;    
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
                first_name: new_first_name,
                last_name: new_last_name,
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
                    //Move to trigger

                    connection.commit(function(error) {
                        if (error) {
                            _global.sendError(res. error.message);
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                        console.log('success adding teacher!');
                        res.send({ result: 'success', message: 'Teacher Added Successfully' });
                        connection.release();
                    });
                });
            });
        });
    });
});

router.put('/update', function(req, res, next) {
    if (req.body.id == undefined || req.body.id == '') {
        _global.sendError(res, null, "Teacher id is required");
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
                        console.log('success updating teacher!---------------------------------------');
                        res.send({ result: 'success', message: 'Teacher Updated Successfully' });
                    }
                    connection.release();
                });
    });
});

module.exports = router;
