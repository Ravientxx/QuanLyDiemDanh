var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);


router.put('/detail/', function(req, res, next) {
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    var schedule = req.body.schedule;

    pool.getConnection(function(error, connection) {
        connection.query(`UPDATE class_has_course SET schedules = ? WHERE class_id = ? AND course_id = ?`, [schedule,class_id,course_id] , function(error, rows, fields) {
            if (error) {
                var message = error.message + ' at update schedule at class_has_course';
                _global.sendError(res, message);
                throw message;
            }
            res.send({result: 'success', });
            connection.release();
        });
    });
});

module.exports = router;
