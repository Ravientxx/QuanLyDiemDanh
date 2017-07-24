var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var async = require("async");
var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

router.get('/:id', function(req, res, next) {
    var id = req.params['id'];
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT * FROM semesters WHERE id = %L`, id), function(error, result, fields) {
            if (error) {
                var message = error.message + ' at get semester info';
                _global.sendError(res, message);
                done();
                return console.log(error);
            } else {
                res.send({ result: 'success', semester : results.rows[0]});
                done();
            }
        });
    });
});

module.exports = router;