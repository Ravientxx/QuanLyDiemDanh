var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");

var pool = mysql.createPool(_global.db);

router.post('/list', function(req, res, next) {
    if (req.body.course_id == null || req.body.course_id == 0) {
        _global.sendError(res, null, "Course_id is required");
        throw "Course_id is required";
    }
    if (req.body.class_id == null || req.body.class_id == 0) {
        _global.sendError(res, null, "Classes id is required");
        throw "Classes id is required";
    }
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    var quiz_list = [];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT quiz.* FROM quiz,class_has_course 
            WHERE quiz.class_has_course_id = class_has_course.id AND class_has_course.class_id = ? AND
             class_has_course.course_id = ?`, [class_id, course_id], function(error, quizzes, fields) {
            if (error) {
                _global.sendError(res, error.message);
                return console.log(error);
            }
            var list = quizzes;
            async.each(list, function(_quiz, callback) {
                connection.query(`SELECT * FROM quiz_questions WHERE quiz_questions.quiz_id = ?`, _quiz.id, function(error, questions, fields) {
                    if (error) {
                        callback(error.message);
                    } else {
                        _quiz['questions'] = [];
                        async.each(questions, function(question, callback) {
                            connection.query(`SELECT quiz_answers.* ,CONCAT(users.first_name,' ',users.last_name) as student_name, students.stud_id as student_code 
                                FROM quiz_answers,students,users 
                                WHERE users.id = students.id AND users.id = quiz_answers.answered_by AND quiz_question_id = ?`, question.id, function(error, answers, fields) {
                                if (error) {
                                    callback(error.message);
                                } else {
                                    question['answers'] = answers.slice();
                                    _quiz['questions'].push(question);
                                    callback();
                                }
                            });
                        }, function(error) {
                            if (error) {
                                callback(error);
                            } else {
                                quiz_list.push(_quiz);
                                callback();
                            }
                        });
                    }
                });
            }, function(error) {
                if (error) {
                    _global.sendError(res, null, error);
                    console.log(error);
                } else {
                    console.log('Get quiz_list successfully-----------------');
                    res.send({
                        result: 'success',
                        quiz_list: quiz_list
                    });
                    connection.release();
                }
            });
        });
    });
});
module.exports = router;
