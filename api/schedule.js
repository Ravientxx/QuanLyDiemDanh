var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var async = require("async");

router.put('/update/', function(req, res, next) {
    if (req.body.classes == undefined) {
        _global.sendError(res, null, "Class is required");
        return;
    }
    var classes = [];
    if (Array.isArray(req.body.classes)) {
        classes = req.body.classes;
    } else {
        classes.push(req.body.classes);
    }
    pool.getConnection(function(error, connection) {
        async.each(classes, function(_class, callback) {
            connection.query(`UPDATE class_has_course SET schedules = ? WHERE class_id = ? AND course_id = ?`,[_class.schedules, _class.class_id, _class.course_id], function(error, results, fields) {
                if (error) {
                    console.log(error.message + ' at insert class_has_course');
                    callback(error);
                } else {
                    callback();
                }
            });
        }, function(error) {
            if (error) {
                var message = error.message + ' at update schedule at class_has_course';
                _global.sendError(res, message);
                throw error;
            } else {
                console.log('updated class_has_course');
                res.send({ result: 'success', });
                connection.release();
            }
        });
    });
});

module.exports = router;
