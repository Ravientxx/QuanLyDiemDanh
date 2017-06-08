var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var async = require("async");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');

router.post('/login', function(req, res, next) {
    if (req.body.email == undefined || req.body.email == '') {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.password == undefined || req.body.password == '') {
        _global.sendError(res, null, "Password is required");
        return;
    }
    var email = req.body.email;
    var password = req.body.password;
    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT * FROM users WHERE email = ? LIMIT 1`, email, function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            //check email exist
            if (rows.length == 0) {
                _global.sendError(res, null, "Email not found");
                throw "Email is not existed";
            }
            var password_hash = rows[0].password;
            if (bcrypt.compareSync(password, password_hash)) {
                var token = jwt.sign(rows[0], _global.jwt_secret_key, { expiresIn: _global.jwt_expire_time });
                res.send({ result: 'success' , token : token, user : rows[0]});
                connection.release();
            } else {
                _global.sendError(res, null, "Wrong password");
                throw "Wrong password";
            }
        });
    });
});

module.exports = router;
