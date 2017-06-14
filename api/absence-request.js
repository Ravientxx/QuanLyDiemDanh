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
router.post('/list', function(req, res, next) {
    var status = req.body.status ? req.body.status : 0;
    var search_text = req.body.search_text ? req.body.search_text : '';
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT absence_requests.*,students.stud_id as code, CONCAT(users.first_name,' ', users.last_name) as name 
            FROM absence_requests,students,users 
            WHERE users.id = students.id AND absence_requests.student_id = students.id AND absence_requests.status = ?`,status, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            absence_requests = rows;
            var search_list = [];
            if (search_text == null) {
                search_list = absence_requests;
            } else {
                for (var i = 0; i < absence_requests.length; i++) {
                    if (absence_requests[i].code.toLowerCase().indexOf(search_text.toLowerCase()) != -1 ||
                        absence_requests[i].name.toLowerCase().indexOf(search_text.toLowerCase()) != -1 ||
                        absence_requests[i].reason.toLowerCase().indexOf(search_text.toLowerCase()) != -1) {
                        search_list.push(absence_requests[i]);
                    }
                }
            }
            res.send({
                result: 'success',
                absence_requests: search_list
            });
            connection.release();
        });
    });
});
module.exports = router;
