var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var jwt = require('jsonwebtoken');

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
