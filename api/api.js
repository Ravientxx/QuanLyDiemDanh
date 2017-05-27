var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);

router.use('/seed', require('./seed'));
router.use('/teacher', require('./teacher'));
router.use('/absence-request', require('./absence-request'));
router.use('/student', require('./student'));
router.use('/schedule', require('./schedule'));
router.use('/course', require('./course'));
router.use('/attendance',require('./attendance'));
router.use('/user', require('./user'));

router.get('/semesters-programs-classes', function(req, res, next) {
    var program_id = req.body.program_id;
    var class_id = req.body.class_id;
    var semester_id = req.body.semester_id;
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT * FROM semesters`, function(error, rows, fields) {
            var semesters = rows;
            connection.query(`SELECT * FROM programs`, function(error, rows, fields) {
                var programs = rows;
                connection.query(`SELECT * FROM classes`, function(error, rows, fields) {
                    var classes = rows;
                    res.send({ result: 'success', semesters: semesters, programs: programs, classes: classes });
                    connection.release();
                    if (error) throw error;
                });
                if (error) throw error;
            });
            if (error) throw error;
        });
    });
});

module.exports = router;
