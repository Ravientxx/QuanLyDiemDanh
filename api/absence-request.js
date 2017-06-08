var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");

var pool = mysql.createPool(_global.db);

router.get('/by-student/:id', function(req, res, next) {
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT * FROM absence_requests WHERE student_id = ?`, id, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            res.send({ result: 'success', absence_requests: rows});
            connection.release();
        });
    });
});
router.put('/change-status', function(req, res, next) {
    if (req.body.id == undefined || req.body.id == 0) {
        _global.sendError(res, null, "Request Id is required");
        return;
    }
    if (req.body.status == undefined) {
        _global.sendError(res, null, "Request status is required");
        return;
    }
    var id = req.body.id;
    var status = req.body.status;
    pool.getConnection(function(error, connection) {
        connection.query(`UPDATE absence_requests SET status = ? WHERE id = ?`,[status, id], function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            res.send({ result: 'success', message: 'successfully changed request status'});
            connection.release();
        });
    });
});

module.exports = router;
