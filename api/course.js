var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var teacher_list = [];

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
