var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');

router.get(['/detail/:id', '/detail?'], function (req,res,next){
	var user_id;
	if (req.query.id != null){
		user_id = req.query.id;
	} 
	else if (req.body.id != null){
		user_id = req.body.id;
	}
	else {	
		_global.sendError(res, "Missing user id", "Require user\'s ID");
        return;
	}

	pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT id,lastname,firstname,email,phone,role_id as role FROM users WHERE id=? LIMIT 1`, user_id ,
        	function(error, rows, fields) {
            if (error){
                _global.sendError(res, error.message);
                throw error;
            }

            //check user exist
            if (rows.length == 0) { 
                _global.sendError(res, 'User\'s ID not exist');
                throw 'User\'s ID not exist';
            }

            var user = rows[0];
            res.send({ result: 'success', user: user });
            connection.release();
        });
    });
});

router.put(['/update/:id', '/update?'], function (req, res, next){
	var user_id;
	if (req.query.id != null){
		user_id = req.query.id;
	} 
	else if (req.body.id != null){
		user_id = req.body.id;
	}
	else {	
		_global.sendError(res, "Missing user id", "Require user\'s ID");
        return;
	}

	pool.getConnection(function(error, connection) {
        if (error) {
            sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT lastname,firstname,email,phone FROM users WHERE id=? LIMIT 1`, user_id ,function(error, rows, fields) {
            if (error){
                sendError(res, error.message);
                throw error;
            }

            //check user exist
            if (rows.length == 0) { 
                sendError(res, 'User\'s ID not exist');
                throw 'User\'s ID not exist';
            }

            //build query
            var params = [];
            var query = '';

            if (req.body.firstname != null){
            	params.push(req.body.firstname);
            	query = 'firstname = ?';
            }
            if (req.body.lastname != null){
            	params.push(req.body.lastname);
            	query += ', lastname = ?';
            }
            if (req.body.email != null){
            	params.push(req.body.email);
            	query += ', email = ?';
            }
            if (req.body.phone != null){
            	params.push(req.body.phone);
            	query += ', phone = ?'
            }

            params.push(user_id);
            //update to user table
            connection.query('UPDATE user SET ' + query + 'WHERE id=? LIMIT 1', params, function(error, results, fields) {
                if (error) {
                    sendError(res. error.message);
                    return connection.rollback(function() {
                        throw error;
                    });
                }

                res.send({ result: 'success', message: 'User Updated Successfully' });
            });
            connection.release();
        });
    });
});

router.delete(['/delete/:id', '/delete?'], function (req,res,next){
	var user_id;
	if (req.query.id != null){
		user_id = req.query.id;
	} 
	else if (req.body.id != null){
		user_id = req.body.id;
	}
	else {	
		_global.sendError(res, "Missing user id", "Require user\'s ID");
        return;
	}

	pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT id,lastname,firstname,email,phone,role_id FROM users WHERE id=? LIMIT 1`, user_id ,
        	function(error, rows, fields) {
            if (error){
                _global.sendError(res, error.message);
                throw error;
            }

            //check user exist
            if (rows.length == 0) { 
                _global.sendError(res, 'User\'s ID not exist');
                throw 'User\'s ID not exist';
            }

            var user = rows[0];
            /*res.send({ result: 'success', message: 'Delete User Successfully', detail: user });
            connection.query('INSERT INTO teachers SET ?', teacher, function(error, results, fields) {
                if (error) {
                    _global.sendError(res. error.message);
                    return connection.rollback(function() {
                        throw error;
                    });
                }
                connection.commit(function(error) {
                    if (error) {
                        _global.sendError(res. error.message);
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                    console.log('success adding teacher!');
                    res.send({ result: 'success', message: 'Teacher Added Successfully' });
                });
            });*/
            //check user role
            if (user.role_id == _global.role.student){

            }
            else if (user.role_id ==_global.role.teacher){

            }
            else {
            	//user is staff
            }

			//begin delete user
            connection.beginTransaction(function(error) {
                if (error){
                    _global.sendError(res, error.message);
                    throw error;
                }
                
            });

            connection.release();
        });
    });
});

router.put(['/changePassword/:id', '/changePassword?'], function (req, res, next){
	var user_id;
	if (req.query.id == null){
		if (req.body.id == null){
			_global.sendError(res, "Missing user id", "Require user\'s ID");
        	return;
		} 
		user_id = req.body.id;
	} 
	else {
		user_id = req.query.id;
	}

	if (req.body.currentPassword == null){
		_global.sendError(res, "Missing user currentPassword", "currentPassword is a required field");
        	return;
	}
	if (req.body.newPassword == null){
		_global.sendError(res, "Missing user newPassword", "newPassword is a required field");
        	return;
	}

	pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT password FROM users WHERE id=? LIMIT 1`, user_id ,function(error, rows, fields) {
            if (error){
                _global.sendError(res, error.message);
                throw error;
            }

            //check user exist
            if (rows.length == 0) { 
                _global.sendError(res, 'User\'s ID not exist');
                throw 'User\'s ID not exist';
            }

            //check currentPassword is correct
            if (bcrypt.hashSync(currentPassword, 10) != rows[0].password){
            	_global.sendError(res, "Missing user newPassword", "newPassword is a required field");
            	throw 'currentPassword not match';
            }

            var params = [bcrypt.hashSync(newPassword, 10), user_id];
            //update password
            connection.query('UPDATE user SET password = ? WHERE id = ? LIMIT 1', params, function(error, results, fields) {
                if (error) {
                    _global.sendError(res. error.message);
                    return connection.rollback(function() {
                        throw error;
                    });
                }

                res.send({ result: 'success', message: 'User\'s password Updated Successfully' });
            });
            connection.release();
        });
    });
});

module.exports = router;