var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var user_list = [];

router.get('/',function(req,res,next){
	console.log('bac');
});

router.get('/user/:id',function(req,res,next){
	console.log('bac');
});

router.put('/user/:id', function(req, res, next){
	pool.getConnection(function(error, connection) {
        if (error) {
            sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT lastname,firstname,email,phone FROM users WHERE id=? LIMIT 1`, id ,function(error, rows, fields) {
            if (error){
                sendError(res, error.message);
                throw error;
            }

            //check email exist
            if (rows.length > 0) { 
                sendError(res, "Id user not exist")
                throw "Id user not exist";
            }

            //new teacher data
            var user_data = { 
                name: new_name, 
                email: new_email, 
                phone: new_phone, 
                role_id: 2 
            };
            
            //begin add teacher
            connection.beginTransaction(function(error) {
                if (error){
                    sendError(res, error.message);
                    throw error;
                }
                //add data to user table
                connection.query('INSERT INTO users SET ?', new_user, function(error, results, fields) {
                    if (error) {
                        sendError(res. error.message);
                        return connection.rollback(function() {
                            throw error;
                        });
                    }

                    res.send({ result: 'success', message: 'Teacher Added Successfully' });
                });
            });
            connection.release();
        });
    });
});

router.put('/user/:id/changePassword', function(req, res, next){

});

module.exports = router;