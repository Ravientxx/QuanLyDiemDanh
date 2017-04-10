var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', {});
});

router.get('/students', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('students', {});
});

router.get('/students/:student_id', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('student_detail', {});
});

router.get('/courses', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('courses', {});
});

router.get('/courses/CS345', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('course_detail', {});
});

router.get('/teachers', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('teachers', {});
});

router.get('/teachers/:teachers_id', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('teacher_detail', {});
});

router.get('/statistics', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('statistics', {});
});

router.get('/absence-requests', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('absence_requests', {});
});

router.get('/settings', function(req, res, next) {
    res.render('settings', {});
});

router.get('/login', function(req, res, next) {
    res.render('login', {});
});

router.get('/timetable', function(req, res, next) {
    res.render('timetable', {});
});

module.exports = router;
