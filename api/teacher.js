var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
/* GET home page. */
var teacher_list = [];
var insert_users = [
    { name: 'Đặng Bình Phương', email: 'dbphuong@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("dbphuong", 10), role_id: 2 },
    { name: 'Đinh Bá Tiến', email: 'dbtien@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("dbtien", 10), role_id: 2 },
    { name: 'Lương Vĩ Minh', email: 'lvminh@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("lvminh", 10), role_id: 2 },
    { name: 'Nguyễn Cao Thùy Liên', email: 'nctlien@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("nctlien", 10), role_id: 2 },
    { name: 'Trần Thái Sơn', email: 'ttson@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("ttson", 10), role_id: 2 },
    { name: 'Phạm Thị Bích Huệ', email: 'ptbhue@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("ptbhue", 10), role_id: 2 },
    { name: 'Nguyễn Tri Tuấn', email: 'nttuan@hcmus.edu.vn', phone: '01228718705', password: bcrypt.hashSync("nttuan", 10), role_id: 2 },
];
router.get('/seed', function(req, res, next) {
    pool.getConnection(function(error, connection) {
        connection.beginTransaction(function(error) {
            if (error) throw error;
            for (var i = 0; i < insert_users.length; i++) {
                connection.query('INSERT INTO users SET ?', insert_users[i],
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
                        });
                    });
            }
            connection.commit(function(err) {
                if (err) {
                    return connection.rollback(function() {
                        throw err;
                    });
                }
                console.log('success seeding teacher!');
            });
        });
        connection.release();
        if (error) throw error;
    });
});
router.post('/add', function(req, res, next) {
    var new_name = req.body.name;
    var new_email = req.body.email;
    var new_phone = req.body.phone;
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT email FROM users`, function(error, rows, fields) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].email == email) {
                    connection.release();
                    res.send({ result: 'failure', message: 'Email already existed' });
                }
            }
            var new_password = new_email.split('@')[0];
            console.log(new_password);
            var new_user = { name: new_name, email: new_email, phone: new_phone, password: bcrypt.hashSync(new_password, 10), role_id: 2 };
            connection.beginTransaction(function(err) {
                if (err) throw err;
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
                            connection.commit(function(err) {
                                if (err) {
                                    return connection.rollback(function() {
                                        throw err;
                                    });
                                }
                                console.log('success adding teacher!');
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
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT teachers.id,name,phone,email,COUNT(teach.courses_id) AS current_courses 
        FROM teachers,users,teacher_teach_course AS teach 
        WHERE teachers.id = users.id AND teachers.id = teach.teachers_id 
        GROUP BY teach.teachers_id`, function(error, rows, fields) {
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

module.exports = router;
