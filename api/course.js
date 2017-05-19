var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];

/**
* @swagger
* tags:
*   name: Course
*   description: Course management
*/

/**
* @swagger
* /api/course/list:
*   post:
*     summary: Get Course list
*     description: 
*     tags: [Course]
*     produces:
*       - application/json
*     parameters:
*       - name: searchText
*         description: words exist in name
*         in: formData
*         type: string
*       - name: page
*         description: page number for pagination
*         in: formData
*         type: integer
*       - name: limit
*         description: number records per page
*         in: formData
*         type: integer
*       - name: sort
*         description: asc or dsc
*         in: formData
*         type: string
*     responses:
*       200:
*         description: json
*/
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

/**
* @swagger
* /api/course/detail:
*   post:
*     summary: get a Course detail
*     description: 
*     tags: [Course]
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: course id
*         in: formData
*         type: integer
*         required: true
*     responses:
*       200:
*         description: json
*/
router.post('/detail',function(req,res,next){
    if (req.body.id != null){
        course_id = req.body.id;
    }
    else {  
        _global.sendError(res, "Missing course id", "Require course ID");
        return;
    }

    pool.getConnection(function(error, connection) {
        if (error) {
            _global.sendError(res, error.message);
            throw error;
        }

        connection.query(`SELECT id, code, name, semester_id, program_id, attendance_count, total_stud,
                            note, office_hour FROM users WHERE id=? LIMIT 1`, course_id ,
            function(error, rows, fields) {
            if (error){
                _global.sendError(res, error.message);
                throw error;
            }

            //check course exist
            if (rows.length == 0) { 
                _global.sendError(res, 'course ID not exist');
                throw 'course ID not exist';
            }

            var course = rows[0];
            res.send({ result: 'success', course: course });
            connection.release();
        });
    });
});

module.exports = router;
