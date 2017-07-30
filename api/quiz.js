var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var async = require("async");
var randomstring = require("randomstring");
var pool = mysql.createPool(_global.db);
var pg = require('pg');
var format = require('pg-format');
const pool_postgres = new pg.Pool(_global.db_postgres);

var quiz_code_list = [];

router.post('/list', function(req, res, next) {
    if (req.body.course_id == null || req.body.course_id == 0) {
        _global.sendError(res, null, "Course_id is required");
        return console.log("Course_id is required");
    }
    if (req.body.class_id == null || req.body.class_id == 0) {
        _global.sendError(res, null, "Classes id is required");
        return console.log("Classes id is required");
    }
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    var quiz_list = [];
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT quiz.* FROM quiz,class_has_course 
            WHERE quiz.class_has_course_id = class_has_course.id AND class_has_course.class_id = %L AND
             class_has_course.course_id = %L AND closed = TRUE`, class_id, course_id), function(error, quizzes, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            var list = quizzes.rows;
            var quiz_code = randomstring.generate({
                length: 5,
                capitalization: 'uppercase',
                charset: 'numeric'
            });
            async.each(list, function(_quiz, callback) {
                connection.query(format(`SELECT * FROM quiz_questions WHERE quiz_questions.quiz_id = %L`, _quiz.id), function(error, questions, fields) {
                    if (error) {
                        callback(error.message);
                    } else {
                        _quiz['questions'] = [];
                        _quiz['code'] = quiz_code;
                        async.each(questions.rows, function(question, callback) {
                            connection.query(format(`SELECT quiz_answers.* ,CONCAT(users.first_name,' ',users.last_name) as student_name, students.stud_id as student_code 
                                FROM quiz_answers,students,users 
                                WHERE users.id = students.id AND users.id = quiz_answers.answered_by AND quiz_question_id = %L`, question.id), function(error, answers, fields) {
                                if (error) {
                                    callback(error.message);
                                } else {
                                    question['answers'] = answers.rows.slice();
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
                    done();
                    return console.log(error);
                } else {
                    console.log('Get quiz_list successfully-----------------');
                    res.send({
                        result: 'success',
                        quiz_list: quiz_list,
                        quiz_code: quiz_code
                    });
                    done();
                }
            });
        });
    });
});

router.post('/detail', function(req, res, next) {
    if (req.body.quiz_id == null || req.body.quiz_id == 0) {
        _global.sendError(res, null, "quiz_id is required");
        return console.log("quiz_id is required");
    }
    var quiz_id = req.body.quiz_id;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT * FROM quiz WHERE id = %L LIMIT 1`, quiz_id), function(error, quiz, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            var _quiz = quiz.rows[0];
            connection.query(format(`SELECT * FROM quiz_questions WHERE quiz_id = %L`, quiz_id), function(error, questions, fields) {
                if (error) {
                    _global.sendError(res, null, error);
                    done();
                    return console.log(error);
                } else {
                    _quiz['questions'] = questions.rows;
                    console.log('Get quiz detail successfully-----------------');
                    res.send({
                        result: 'success',
                        quiz: _quiz,
                        total_item: questions.rowCount
                    });
                    done();
                }
            });
        });
    });
});

router.post('/opening', function(req, res, next) {
    if (req.body.course_id == null || req.body.course_id == 0) {
        _global.sendError(res, null, "Course_id is required");
        return console.log("Course_id is required");
    }
    if (req.body.class_id == null || req.body.class_id == 0) {
        _global.sendError(res, null, "Classes id is required");
        return console.log("Classes id is required");
    }
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    var quiz_list = [];
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT quiz.* FROM quiz,class_has_course 
            WHERE quiz.class_has_course_id = class_has_course.id AND class_has_course.class_id = %L AND
             class_has_course.course_id = %L AND quiz.closed = FALSE`, class_id, course_id), function(error, quizzes, fields) {
            if (error) {
                _global.sendError(res, error.message);
                done();
                return console.log(error);
            }
            var list = quizzes.rows;
            async.each(list, function(_quiz, callback) {
                connection.query(format(`SELECT * FROM quiz_questions WHERE quiz_questions.quiz_id = %L`, _quiz.id), function(error, questions, fields) {
                    if (error) {
                        callback(error.message);
                    } else {
                        _quiz['questions'] = [];
                        async.each(questions.rows, function(question, callback) {
                            connection.query(format(`SELECT quiz_answers.* ,CONCAT(users.first_name,' ',users.last_name) as student_name, students.stud_id as student_code 
                                FROM quiz_answers,students,users 
                                WHERE users.id = students.id AND users.id = quiz_answers.answered_by AND quiz_question_id = %L`, question.id), function(error, answers, fields) {
                                if (error) {
                                    callback(error.message);
                                } else {
                                    question['answers'] = answers.rows.slice();
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
                    done();
                    console.log(error);
                } else {
                    console.log('Get quiz_list successfully-----------------');
                    res.send({
                        result: 'success',
                        quiz: quiz_list[0]
                    });
                    done();
                }
            });
        });
    });
});

router.post('/start', function(req, res, next) {
    if (req.body.course_id == null || req.body.course_id == 0) {
        _global.sendError(res, null, "Course_id is required");
        return console.log("Course_id is required");
    }
    if (req.body.class_id == null || req.body.class_id == 0) {
        _global.sendError(res, null, "Classes id is required");
        return console.log("Classes id is required");
    }
    if (req.body.quiz == null || req.body.quiz.length == 0) {
        _global.sendError(res, null, "Quiz is required");
        return console.log("Quiz is required");
    }
    if (req.body.quiz.title == null || req.body.quiz.title == '') {
        _global.sendError(res, null, "Quiz title id is required");
        return console.log("Quiz title id is required");
    }
    if (req.body.quiz.questions == null || req.body.quiz.questions.length == 0) {
        _global.sendError(res, null, "Quiz questions are required");
        return console.log("Quiz questions are required");
    }
    var quiz = req.body.quiz;
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    for (var i = 0; i < quiz.questions.length; i++) {
        if (req.body.quiz.questions[i].text == null || req.body.quiz.questions[i].text == '') {
            _global.sendError(res, null, "Title of question " + (i + 1) + " are required");
            return console.log("Title of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_a == null || req.body.quiz.questions[i].option_a == '') {
            _global.sendError(res, null, "Option A of question " + (i + 1) + " are required");
            return console.log("Option A of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_b == null || req.body.quiz.questions[i].option_b == '') {
            _global.sendError(res, null, "Option B of question " + (i + 1) + " are required");
            return console.log("Option B of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_c == null || req.body.quiz.questions[i].option_c == '') {
            _global.sendError(res, null, "Option C of question " + (i + 1) + " are required");
            return console.log("Option C of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_d == null || req.body.quiz.questions[i].option_d == '') {
            _global.sendError(res, null, "Option D of question " + (i + 1) + " are required");
            return console.log("Option D of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].correct_option == null || req.body.quiz.questions[i].correct_option == '') {
            _global.sendError(res, null, "Correct option of question " + (i + 1) + " are required");
            return console.log("Correct option of question " + (i + 1) + " are required");
        }
    }
    var class_has_course_id = 0;
    var quiz_id = 0;
    pool_postgres.connect(function(error, connection, done) {
        if (quiz.start_date == null && quiz.id != 0) {
            var temp = quiz.timer.split(':');
            var seconds = (+temp[0] * 60 + (+temp[1])) * 1000;
            var query = '';
            if(!quiz.is_show_one_question && quiz.is_use_timer){
                query = format(`UPDATE quiz SET closed = FALSE, code = %L,timer = %L,is_use_timer = %L,
                    is_show_one_question = %L, is_show_question_text = %L, started_at = %L , ended_at = %L 
                    WHERE id = %L`, quiz.code,quiz.timer,quiz.is_use_timer,quiz.is_show_one_question,quiz.is_show_question_text, new Date(), new Date(new Date().getTime() + seconds), quiz.id);
            }else{
                query = format(`UPDATE quiz SET closed = FALSE, code = %L, timer = %L,is_use_timer = %L,
                    is_show_one_question = %L, is_show_question_text = %L,started_at = %L 
                    WHERE id = %L`, quiz.code,quiz.timer,quiz.is_use_timer,quiz.is_show_one_question,quiz.is_show_question_text, new Date(), quiz.id);
            }
            connection.query(query, function(error, result, fields) {
                if (error) {
                    _global.sendError(res, error.message);
                    done();
                    return console.log(error);
                } else {
                    console.log('success start quiz---------------------------------------1');
                    res.send({ result: 'success', quiz_id: quiz.id, message: 'Start quiz successfully' });
                    done();
                    return;
                }
            });
        } else {
            async.series([
                //Start transaction
                function(callback) {
                    connection.query('BEGIN', (error) => {
                        if (error) callback(error);
                        else callback();
                    });
                },
                //get class_has_course id
                function(callback) {
                    connection.query(format(`SELECT id FROM class_has_course WHERE class_id = %L AND course_id = %L`, class_id, course_id), function(error, result, fields) {
                        if (error) {
                            callback(error);
                        } else {
                            class_has_course_id = result.rows[0].id;
                            callback();
                        }
                    });
                },
                //insert quiz
                function(callback) {
                    var new_quiz = {};
                    if (quiz.is_use_timer && !quiz.is_show_one_question) {
                        var temp = quiz.timer.split(':');
                        var seconds = (+temp[0] * 60 + (+temp[1])) * 1000;
                        new_quiz = [[
                            quiz.title,
                            class_has_course_id,
                            0,
                            new Date(),
                            new Date(new Date().getTime() + seconds),
                            quiz.timer,
                            quiz.is_use_timer,
                            quiz.is_show_question_text,
                            quiz.is_show_one_question,
                            quiz.code
                        ]];
                    } else {
                        new_quiz = [[
                            quiz.title,
                            class_has_course_id,
                            0,
                            new Date(),
                            null,
                            quiz.timer,
                            quiz.is_use_timer,
                            quiz.is_show_question_text,
                            quiz.is_show_one_question,
                            quiz.code
                        ]];
                    }
                    connection.query(format(`INSERT INTO quiz (title,class_has_course_id,closed,started_at,ended_at,timer,is_use_timer,is_show_question_text,is_show_one_question,code) 
                        VALUES %L RETURNING id`, new_quiz), function(error, result, fields) {
                        if (error) {
                            callback(error);
                        } else {
                            quiz_id = result.rows[0].id;
                            callback();
                        }
                    });
                },
                //insert questions
                function(callback) {
                    var new_questions = [];
                    for (var i = 0; i < quiz.questions.length; i++) {
                        new_questions.push([
                            quiz_id, 
                            quiz.questions[i].text,
                            quiz.questions[i].option_a,
                            quiz.questions[i].option_b,
                            quiz.questions[i].option_c,
                            quiz.questions[i].option_d,
                            quiz.questions[i].correct_option
                        ]);
                    }
                    connection.query(format(`INSERT INTO quiz_questions (quiz_id,text,option_a,option_b,option_c,option_d,correct_option) VALUES %L`, new_questions), function(error, result, fields) {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    });
                },
                //Commit transaction
                function(callback) {
                    connection.query('COMMIT', (error) => {
                        if (error) callback(error);
                        else callback();
                    });
                },
            ], function(error) {
                if (error) {
                    _global.sendError(res, error.message);
                    connection.query('ROLLBACK', (error) => {
                        if (error) return console.log(error);
                    });
                    done();
                    return console.log(error);
                } else {
                    console.log('success start quiz---------------------------------------2');
                    res.send({ result: 'success', quiz_id: quiz_id, message: 'Start quiz successfully' });
                    done();
                }
            });
        }
    });
});

router.post('/stop', function(req, res, next) {
    if (req.body.quiz_id == null || req.body.quiz_id == 0) {
        _global.sendError(res, null, "quiz_id is required");
        return console.log("quiz_id is required");
    }
    var quiz_id = req.body.quiz_id;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`UPDATE quiz SET closed = TRUE WHERE id = %L`, quiz_id), function(error, result, fields) {
            if (error) {
                _global.sendError(res, null, error.message);
                done();
                return console.log(error);
            } else {
                console.log('success stop quiz---------------------------------------');
                res.send({ result: 'success', message: 'Stop quiz successfully' });
                done();
            }
        });
    });
});

router.post('/check-code', function(req, res, next) {
    if (req.body.code == null || req.body.code == '') {
        _global.sendError(res, null, "Quiz code is required");
        return console.log("Quiz code is required");
    }
    var student_id = req.decoded.id;
    var code = req.body.code;
    pool_postgres.connect(function(error, connection, done) {
        connection.query(format(`SELECT id,class_has_course_id FROM quiz WHERE code = %L AND closed = FALSE LIMIT 1`, code), function(error, result, fields) {
            if (error) {
                _global.sendError(res, null, error.message);
                done();
                return console.log(error);
            } else {
                if (result.cowCount == 0) {
                    _global.sendError(res, null, 'Invalid code! It might have been expired or the quiz is already closed');
                    done();
                    return console.log('Invalid code! It might have been expired or the quiz is already closed');
                } else {
                    connection.query(format(`SELECT * FROM quiz,quiz_questions,quiz_answers 
                        WHERE quiz.id = quiz_questions.quiz_id AND quiz_questions.id = quiz_answers.quiz_question_id AND quiz_id = %L AND quiz_answers.answered_by = %L`, result.rows[0].id, student_id), function(error, result, fields) {
                        if (error) {
                            _global.sendError(res, null, error.message);
                            done();
                            return console.log(error);
                        } else {
                            if (result.cowCount == 0) {
                                connection.query(format(`SELECT * FROM student_enroll_course WHERE class_has_course_id = %L AND student_id = %L`, result.rows[0].class_has_course_id, student_id), function(error, result, fields) {
                                    if (error) {
                                        _global.sendError(res, null, error.message);
                                        done();
                                        return console.log(error);
                                    } else {
                                        if (result.cowCount == 0) {
                                            _global.sendError(res, null, 'You are not in this course');
                                            done();
                                            return console.log('You are not in this course');
                                        } else {
                                            console.log('success check quiz code---------------------------------------');
                                            res.send({ result: 'success', quiz_id: result.rows[0].id, message: 'check quiz successfully' });
                                            done();
                                        }
                                    }
                                });
                            } else {
                                _global.sendError(res, null, 'You already took this quiz');
                                done();
                                return console.log('You already took this quiz');
                            }
                        }
                    });
                }
            }
        });
    });
});

router.post('/submit', function(req, res, next) {
    if (req.body.student_id == null || req.body.student_id == 0) {
        _global.sendError(res, null, "student_id is required");
        throw "student_id is required";
    }
    if (req.body.quiz == null) {
        _global.sendError(res, null, "Quiz is required");
        throw "Quiz is required";
    }
    if (req.body.quiz.questions == null || req.body.quiz.questions.length == 0) {
        _global.sendError(res, null, "Questions is required");
        throw "Questions is required";
    }
    var quiz = req.body.quiz;
    var student_id = req.body.student_id;
    for (var i = 0; i < quiz.questions.length; i++) {
        if (req.body.quiz.questions[i].answer == null || req.body.quiz.questions[i].answer == '') {
            _global.sendError(res, null, "Answer for question " + (i + 1) + " are required");
            throw "Answer for question " + (i + 1) + " are required";
        }
    }
    var attendance_id = 0;
    var check_attendance_exist = false;
    pool_postgres.connect(function(error, connection, done) {
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //insert quiz_answers
            function(callback) {
                var answers = [];
                for (var i = 0; i < quiz.questions.length; i++) {
                    answers.push([quiz.questions[i].id, student_id, quiz.questions[i].answer, new Date()]);
                }
                connection.query(format(`INSERT INTO quiz_answers (quiz_question_id,answered_by,text,answered_at) VALUES %L`, answers), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //insert attendance_id
            function(callback) {
                connection.query(format(`SELECT attendance.id 
                    FROM quiz,class_has_course,attendance 
                    WHERE quiz.class_has_course_id = class_has_course.id AND class_has_course.class_id = attendance.class_id 
                    AND class_has_course.course_id = class_has_course.course_id AND attendance.closed = FALSE AND quiz.id = %L`, quiz.id), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        attendance_id = result.rows[0].id;
                        callback();
                    }
                });
            },
            //check if attendance_detail exist
            function(callback) {
                connection.query(format(`SELECT * FROM attendance_detail WHERE attendance_id = %L AND student_id = %L`, attendance_id, student_id), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        if (result.cowCount == 0) {
                            check_attendance_exist = false;
                        } else {
                            check_attendance_exist = true;
                        }
                        callback();
                    }
                });
            },
            //insert attendance_detail
            function(callback) {
                if (check_attendance_exist) {
                    connection.query(format(`UPDATE attendance_detail SET attendance_type = %L WHERE attendance_id = %L AND student_id = %L`, _global.attendance_type.quiz, attendance_id, student_id), function(error, result, fields) {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    });
                } else {
                    var attendance_detail = [[
                        attendance_id,
                        student_id,
                        new Date(),
                        _global.attendance_type.quiz,
                    ]];
                    connection.query(format(`INSERT INTO attendance_detail (attendance_id,student_id,attendance_time,attendance_type) VALUES %L`, attendance_detail), function(error, result, fields) {
                        if (error) {
                            callback(error);
                        } else {
                            callback();
                        }
                    });
                }
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done();
                return console.log(error);
            } else {
                console.log('success submit quiz---------------------------------------');
                res.send({ result: 'success', message: 'Submit quiz successfully' });
                done();
            }
        });
    });
});

router.post('/delete', function(req, res, next) {
    if (req.body.quiz_id == null || req.body.quiz_id == 0) {
        _global.sendError(res, null, "quiz_id is required");
        return console.log("quiz_id is required");
    }
    var quiz_id = req.body.quiz_id;
    pool_postgres.connect(function(error, connection, done) {
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //delete Answers
            function(callback) {
                connection.query(format(`SELECT id FROM quiz_questions WHERE quiz_id = %L`, quiz_id), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        async.each(result.rows, function(question, callback) {
                            connection.query(format(`DELETE FROM quiz_answers WHERE quiz_question_id = %L`, question.id), function(error, result, fields) {
                                if (error) {
                                    callback(error.message);
                                } else {
                                    callback();
                                }
                            });
                        }, function(error) {
                            if (error) {
                                callback(error);
                            } else {
                                callback();
                            }
                        });
                    }
                });
            },
            //delete Questions
            function(callback) {
                connection.query(format(`DELETE FROM quiz_questions WHERE quiz_id = %L`, quiz_id), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Delete quiz
            function(callback) {
                connection.query(format(`DELETE FROM quiz WHERE id = %L`, quiz_id), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.rollback(function() {
                    done();
                    return console.log(error);
                });
                return console.log(error);
                done();
            } else {
                console.log('success delete quiz---------------------------------------');
                res.send({ result: 'success', message: 'Delete quiz successfully' });
                done();
            }
        });
    });
});

router.post('/add', function(req, res, next) {
    if (req.body.course_id == null || req.body.course_id == 0) {
        _global.sendError(res, null, "Course_id is required");
        return console.log("Course_id is required");
    }
    if (req.body.class_id == null || req.body.class_id == 0) {
        _global.sendError(res, null, "Classes id is required");
        return console.log("Classes id is required");
    }
    if (req.body.quiz == null || req.body.quiz.length == 0) {
        _global.sendError(res, null, "Quiz is required");
        return console.log("Quiz is required");
    }
    if (req.body.quiz.title == null || req.body.quiz.title == '') {
        _global.sendError(res, null, "Quiz title id is required");
        return console.log("Quiz title id is required");
    }
    if (req.body.quiz.questions == null || req.body.quiz.questions.length == 0) {
        _global.sendError(res, null, "Quiz questions are required");
        return console.log("Quiz questions are required");
    }
    var quiz = req.body.quiz;
    var class_id = req.body.class_id;
    var course_id = req.body.course_id;
    for (var i = 0; i < quiz.questions.length; i++) {
        if (req.body.quiz.questions[i].text == null || req.body.quiz.questions[i].text == '') {
            _global.sendError(res, null, "Title of question " + (i + 1) + " are required");
            return console.log("Title of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_a == null || req.body.quiz.questions[i].option_a == '') {
            _global.sendError(res, null, "Option A of question " + (i + 1) + " are required");
            return console.log("Option A of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_b == null || req.body.quiz.questions[i].option_b == '') {
            _global.sendError(res, null, "Option B of question " + (i + 1) + " are required");
            return console.log("Option B of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_c == null || req.body.quiz.questions[i].option_c == '') {
            _global.sendError(res, null, "Option C of question " + (i + 1) + " are required");
            return console.log("Option C of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].option_d == null || req.body.quiz.questions[i].option_d == '') {
            _global.sendError(res, null, "Option D of question " + (i + 1) + " are required");
            return console.log("Option D of question " + (i + 1) + " are required");
        }
        if (req.body.quiz.questions[i].correct_option == null || req.body.quiz.questions[i].correct_option == '') {
            _global.sendError(res, null, "Correct option of question " + (i + 1) + " are required");
            return console.log("Correct option of question " + (i + 1) + " are required");
        }
    }
    var class_has_course_id = 0;
    var quiz_id = 0;
    var quiz_code = '';
    pool_postgres.connect(function(error, connection, done) {
        async.series([
            //Start transaction
            function(callback) {
                connection.query('BEGIN', (error) => {
                    if(error) callback(error);
                    else callback();
                });
            },
            //get class_has_course id
            function(callback) {
                connection.query(format(`SELECT id FROM class_has_course WHERE class_id = %L AND course_id = %L`, class_id, course_id), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        class_has_course_id = result.rows[0].id;
                        callback();
                    }
                });
            },
            //insert quiz
            function(callback) {
                var new_quiz = [[
                    quiz.title,
                    class_has_course_id,
                    1,
                ]];
                connection.query(format(`INSERT INTO quiz (title,class_has_course_id,closed) VALUES %L RETURNING id`, new_quiz), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        quiz_id = result.rows[0].id;
                        callback();
                    }
                });
            },
            //insert questions
            function(callback) {
                var new_questions = [];
                for (var i = 0; i < quiz.questions.length; i++) {
                    new_questions.push([
                        quiz_id, 
                        quiz.questions[i].text,
                        quiz.questions[i].option_a,
                        quiz.questions[i].option_b,
                        quiz.questions[i].option_c,
                        quiz.questions[i].option_d,
                        quiz.questions[i].correct_option
                        ]);
                }
                connection.query(format(`INSERT INTO quiz_questions (quiz_id,text,option_a,option_b,option_c,option_d,correct_option) VALUES %L`, new_questions), function(error, result, fields) {
                    if (error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });
            },
            //Commit transaction
            function(callback) {
                connection.query('COMMIT', (error) => {
                    if (error) callback(error);
                    else callback();
                });
            },
        ], function(error) {
            if (error) {
                _global.sendError(res, error.message);
                connection.query('ROLLBACK', (error) => {
                    if (error) return console.log(error);
                });
                done();
                return console.log(error);
            } else {
                console.log('success add quiz---------------------------------------');
                res.send({ result: 'success', message: 'Add quiz successfully' });
                done();
            }
        });
    });
});

module.exports = router;
