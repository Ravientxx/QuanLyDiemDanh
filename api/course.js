var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];

router.get('/detail/:id',function(req,res,next){
    var id = req.params['id'];
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT courses.*,semesters.name as semester_name,programs.name as program_name FROM courses,semesters,programs WHERE programs.id = courses.program_id AND courses.id = ? AND courses.semester_id = semesters.id LIMIT 1`,id,function(error, rows, fields) {
            if (error) {
                _global.sendError(res, error.message);
                throw error;
            }
            var course = rows[0];
            connection.query(`SELECT * FROM users,teacher_teach_course
                WHERE users.id = teacher_teach_course.teacher_id AND teacher_teach_course.course_id = ?`, id, function(error, rows, fields) {
                var lecturers = [];
                var TAs = [];
                for(var i = 0 ; i < rows.length; i++){
                    if(rows[i].teacher_role == 0){
                        lecturers.push(rows[i]);
                    }else{
                        TAs.push(rows[i]);
                    }
                }
                res.send({ result: 'success', course: course,lecturers: lecturers, TAs : TAs});
                connection.release();
                if (error) throw error;
            });
        });
    });
});
router.post('/list', function(req, res, next) {
    var searchText = req.body.searchText;
    var page = req.body.page;
    var limit = req.body.limit;
    pool.getConnection(function(error, connection) {
        connection.query(``, function(error, rows, fields) {
            teacher_list = rows;
            var search_list = [];
            if (searchText == null) {
                search_list = teacher_list;
            } else {
                for (var i = 0; i < teacher_list.length; i++) {
                    console.log(teacher_list[i].name.toLowerCase());
                    if (teacher_list[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                        search_list.push(teacher_list[i]);
                    }
                }
            }
            res.send({ result: 'success', total_items: search_list.length, teacher_list: _global.filterListByPage(page, limit, search_list) });
            connection.release();
            if (error) throw error;
        });
    });
});
module.exports = router;
