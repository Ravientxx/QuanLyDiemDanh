var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var async = require("async");
var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

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
router.use('/quiz', require('./quiz'));
router.use('/class', require('./classes'));
router.use('/program', require('./program'));
router.use('/notification', require('./notification'));

router.get('/semesters-programs-classes', function(req, res, next) {
    var program_id = req.body.program_id;
    var class_id = req.body.class_id;
    var semester_id = req.body.semester_id;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(`SELECT * FROM semesters`, function(error, result, fields) {         
            if (error){
                done(error);
                return console.log(error);
            }
            var semesters = result.rows;
            connection.query(`SELECT * FROM programs`, function(error, result, fields) {
                if (error) {
                    done(error);
                    return console.log(error);
                }
                var programs = result.rows;
                connection.query(`SELECT * FROM classes`, function(error, result, fields) {
                    if (error) {
                        done(error);
                        return console.log(error);
                    }
                    var classes = result.rows;
                    res.send({ result: 'success', semesters: semesters, programs: programs, classes: classes });
                    done();
                });
            });
        });
    });
});

router.get('/staffs', function(req, res, next) {
    pool_postgres.connect(function(error, connection, done) {
        connection.query(`SELECT * FROM users WHERE role_id = 3`, function(error, result, fields) {
            if (error) {
                done(error);
                return console.log(error);
            }
    
            res.send({ result: 'success', staffs: result.rows });
            done();
        }); 
    });
});

router.post('/add-staff', function(req, res, next) {
    if (req.body.first_name == undefined || req.body.first_name == '') {
        _global.sendError(res, null, "First name is required");
        return;
    }
    if (req.body.last_name == undefined || req.body.last_name == '') {
        _global.sendError(res, null, "Last name is required");
        return;
    }
    if (req.body.email == undefined || req.body.email == '') {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.email.indexOf('@') == -1) {
        _global.sendError(res, null, "Invalid Email");
        return;
    }
    if (req.body.phone == undefined || isNaN(req.body.phone)) {
        _global.sendError(res, null, "Invalid Phone Number");
        return;
    }

    var new_first_name = req.body.first_name;
    var new_last_name = req.body.last_name;
    var new_email = req.body.email;
    var new_phone = req.body.phone;

    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }

            connection.query(format(`SELECT email FROM users WHERE email = %L LIMIT 1`, new_email), function(error, result, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    done();
                    return console.log(error);
                }
                //check email exist
                if (result.rowCount > 0) {
                    _global.sendError(res, "Email already existed");
                    done();
                    return console.log("Email already existed");
                }
                //new data to users table
                var new_password = new_email.split('@')[0];
                var new_user = [[
                    new_first_name,
                    new_last_name,
                    new_email,
                    new_phone,
                    bcrypt.hashSync(new_password, 10),
                    _global.role.staff
                ]];
                
                connection.query(format('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES %L RETURNING id', new_user), function(error, result, fields) {
                    if (error) {
                        _global.sendError(res, "Email already existed");
                        done();
                        return console.log("Email already existed");
                    }else{
                        let transporter = nodemailer.createTransport(_global.email_setting);
                        var token = jwt.sign({ email: new_email }, _global.jwt_secret_key, { expiresIn: _global.jwt_register_expire_time });
                        console.log(token);
                        var link = _global.host + '/register;token=' + token;
                        let mailOptions = {
                            from: '"Giáo vụ"',
                            to: new_email,
                            subject: 'Register your account',
                            text: 'Hi,'+ new_first_name + '\r\n' + 
                                'Your account has been created.To setup your account for the first time, please go to the following web address: \r\n\r\n' +
                                link + 
                                '\r\n(This link is valid for 7 days from the time you received this email)\r\n\r\n' +
                                'If you need help, please contact the site administrator,\r\n' +
                                'Admin User \r\n\r\n' +
                                'admin@fit.hcmus.edu.vn'
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });
                        res.send({ result: 'success',  message : "ok" });
                        done();
                    }
                });
                
        });
    });
});

router.post('/remove-staff', function(req, res, next) {
    if (req.body.email == undefined || req.body.email == '') {
        _global.sendError(res, null, "Email is required");
        return;
    }
    if (req.body.email.indexOf('@') == -1) {
        _global.sendError(res, null, "Invalid Email");
        return;
    }
    
    var email = req.body.email;
    
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res, error.message);
            done();
            return console.log(error);
        }
         
        connection.query(format(`DELETE FROM users WHERE email = %L`, [email]), function(error, result, fields) {
            if (error) {
                _global.sendError(res, null, 'error at delete staff');
                done();
                return console.log(error.message + ' at delete staff');
            } else {
                res.send({ result: 'success' });
                done();
            }
        });
    });
});

module.exports = router;
