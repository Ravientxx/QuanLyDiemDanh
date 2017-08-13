var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");
var pool = mysql.createPool(_global.db);
var pg = require('pg');
var format = require('pg-format');
var nodemailer = require('nodemailer');
const pool_postgres = new pg.Pool(_global.db_postgres);

router.post('/list', function(req, res, next) {
    var role_id = req.body.role_id ? req.body.role_id : 0;
    var search_text = req.body.search_text ? req.body.search_text : '';
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    pool_postgres.connect(function(error, connection, done) {
        var query = `SELECT id, title, content, replied, feedbacks.read, created_at , 
            (SELECT CONCAT(users.first_name,' ',users.last_name,E'\r\n',users.email) FROM users WHERE users.id = feedbacks.from_id) as _from, 
            (SELECT CONCAT(first_name,' ',last_name) FROM users WHERE users.id = feedbacks.to_id) as _to 
            FROM feedbacks`;
        if(role_id != 0){
            query += ' WHERE type = ' + role_id;
        }
        query += ' ORDER BY feedbacks.read , feedbacks.created_at';
        connection.query(query,function(error, result, fields) {
            if (error) {
                _global.sendError(res,null,error);
                done();
                return console.log(error);
            }
            var feedbacks = result.rows;
            for(var i = 0 ; i < feedbacks.length; i++){
                if(feedbacks[i]._to == null){
                    feedbacks[i]._to = 'Giáo vụ';
                }
                if(feedbacks[i]._from == null){
                    feedbacks[i]._from = 'Anonymous';
                }
            }
            var search_list = [];
            if (search_text == null) {
                search_list = feedbacks;
            } else {
                for (var i = 0; i < feedbacks.length; i++) {
                    if (feedbacks[i]._from.toLowerCase().indexOf(search_text.toLowerCase()) != -1 ||
                        feedbacks[i]._to.toLowerCase().indexOf(search_text.toLowerCase()) != -1 ||
                        feedbacks[i].title.toLowerCase().indexOf(search_text.toLowerCase()) != -1) {
                        search_list.push(feedbacks[i]);
                    }
                }
            }
            if (limit != -1) {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    feedbacks: _global.filterListByPage(page, limit, search_list)
                });
            } else {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    feedbacks: search_list
                });
            }
            done();
        });
    });
});

router.put('/read', function(req, res, next) {
    if (req.body.feedback_id == undefined || req.body.feedback_id == 0) {
        _global.sendError(res, null, "feedback id is required");
        return;
    }
    var feedback_id = req.body.feedback_id;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res,null,error);
            done();
                return console.log(error);
        }
        connection.query(format(`UPDATE feedbacks SET read = TRUE WHERE id = %L`,feedback_id),function(error, result, fields) {
            if (error) {
                _global.sendError(res,null,error);
                done();
                return console.log(error);
            }
            res.send({ result: 'success'});
            done();
        });
    });
});

router.post('/send', function(req, res, next) {
    if (req.body.title == undefined || req.body.title == '') {
        _global.sendError(res, null, "title is required");
        return;
    }
    if (req.body.content == undefined || req.body.content == '') {
        _global.sendError(res, null, "content is required");
        return;
    }
    var feedback = [[
        req.body.title,
        req.body.content,
        (req.body.isAnonymous ? null : req.decoded.id),
        (req.body.isAnonymous ? 3 : (req.decoded.role_id == _global.role.student ? 1 : 2)),
    ]];
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res,null,error);
            done();
                return console.log(error);
        }
        connection.query(format(`INSERT INTO feedbacks (title,content,from_id,type) VALUES %L RETURNING id`,feedback),function(error, result, fields) {
            if (error) {
                _global.sendError(res,null,error);
                done();
                return console.log(error);
            }
            connection.query(format(`INSERT INTO notifications (from_id,message,object_id,type) VALUES %L RETURNING id`, [[
                    req.decoded.id,
                    'sent a feedback',
                    result.rows[0].id,
                    _global.notification_type.send_feedback
                ]]), function(error, result, fields) {
                if (error) {
                    _global.sendError(res,null,error);
                    done();
                    return console.log(error);
                }
                res.send({ result: 'success', message: 'Feedback sent successfully'});
                done();
            });
        });
    });
});

router.post('/history', function(req, res, next) {
    var user_id = req.decoded.id;
    var search_text = req.body.search_text ? req.body.search_text : '';
    var page = req.body.page != null ? req.body.page : _global.default_page;
    var limit = req.body.limit != null ? req.body.limit : _global.detail_limit;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res,null,error);
            done();
            return console.log(error);
        }

        var query = `SELECT id, title, content, feedbacks.read, created_at as time, replied FROM feedbacks 
        WHERE from_id = %L ORDER BY feedbacks.read, feedbacks.created_at DESC`;

        connection.query(query,function(error, result, fields) {
            
            done();
        });
        connection.query(format(query, user_id), function(error, result, fields) {
            if (error) {
                _global.sendError(res, null, error);
                done();
                return console.log(error);
            }

            var feedbacks = result.rows;
            var search_list = [];
            if (search_text == null) {
                search_list = feedbacks;
            } else {
                for (var i = 0; i < feedbacks.length; i++) {
                    if (feedbacks[i].title.toLowerCase().indexOf(search_text.toLowerCase()) != -1) {
                        search_list.push(feedbacks[i]);
                    }
                }
            }
            if (limit != -1) {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    feedbacks: _global.filterListByPage(page, limit, search_list)
                });
            } else {
                res.send({
                    result: 'success',
                    total_items: search_list.length,
                    feedbacks: search_list
                });
            }
            done();
        });
    });
});

router.post('/send-reply', function(req, res, next) {
    if (req.body.content == undefined || req.body.content == '') {
        _global.sendError(res, null, "reply_content is required");
        return;
    }
    
    if (req.body.id == undefined || req.body.id == '') {
        _global.sendError(res, null, "feedback_id is required");
        return;
    }

    var reply_content = req.body.content;
    var feedback_id = req.body.id;    

    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res,null,error);
            done();
                return console.log(error);
        }

        var query = `SELECT id, title, content, from_id, 
            (SELECT users.email FROM users WHERE users.id = feedbacks.from_id) as _from,  
            (SELECT users.last_name FROM users WHERE users.id = feedbacks.from_id) as _last_name  
            FROM feedbacks
            WHERE id = %L`;
        connection.query(format(query, feedback_id),function(error, result, fields) {
            if (error) {
                _global.sendError(res,null,error);
                done();
                return console.log(error);
            }

            var email = result.rows[0]._from;
            var title = result.rows[0].title;
            var last_name = result.rows[0]._last_name;
            var reply_to = result.rows[0].from_id;
            connection.query(format('UPDATE feedbacks SET replied = TRUE WHERE id = %L', feedback_id), function(error, result, fields) {
                if (error) {
                    res.send({ result: 'failure', message: 'Reply Failed' });
                    done();
                    return console.log(error);
                }

                let transporter = nodemailer.createTransport(_global.email_setting);
                let mailOptions = {
                    from: '"Giáo vụ", giaovu@fit.hcmus.edu.vn', // sender address
                    to: email, // list of receivers
                    subject: 'Reply your feedback ' + title, // Subject line
                    text: `Hi ` + last_name +`,\r\n\r\nTo your feedback:\r\n` + reply_content + `\r\n Reply by ` + req.decoded.first_name + ` ` + req.decoded.last_name + `.\r\n\r\nIf you need help, please contact giaovu@fit.hcmus.edu.vn`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        done();
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });

                connection.query(format(`INSERT INTO notifications (to_id,from_id,message,object_id,type) VALUES %L RETURNING id`, [[
                        reply_to,
                        req.decoded.id,
                        'replied your feedback',
                        feedback_id,
                        _global.notification_type.reply_feedback
                    ]]), function(error, result, fields) {
                        if (error) {
                            res.send({ result: 'failure', message: 'Reply Failed' });
                            done();
                        } else {
                            res.send({ result: 'success', message: 'Replied Successfully' });
                            done();
                        }
                    });
                
            });
        });
    });
});

router.post('/delete', function(req, res, next) {
    if (req.body.id == undefined || req.body.id == 0) {
        _global.sendError(res, null, "Feedback id is required");
        return;
    }
    var feedback_id = req.body.id;
    pool_postgres.connect(function(error, connection, done) {
        if (error) {
            _global.sendError(res,null,error);
            done();
                return console.log(error);
        }
        connection.query(format(`SELECT * FROM feedbacks WHERE id = %L AND from_id = %L`,feedback_id,req.decoded.id),function(error, result, fields) {
            if (error) {
                _global.sendError(res,null,error);
                done();
                return console.log(error);
            }
            if(result.rowCount == 0){
                _global.sendError(res,null,'Feedback not existed or not belong to you');
                done();
                return console.log('Feedback not existed or not belong to you');
            }else{
                connection.query(format(`DELETE FROM feedbacks WHERE id = %L`, feedback_id), function(error, result, fields) {
                    if (error) {
                        _global.sendError(res,null,error);
                        done();
                        return console.log(error);
                    }
                    res.send({ result: 'success', message: 'Feedback deleted successfully'});
                    done();
                });
            }
        });
    });
});
module.exports = router;
