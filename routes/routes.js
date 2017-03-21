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

router.get('/statistics', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('statistics', {});
});

router.get('/absence-requests', function(req, res, next) {
    //res.send('respond with a resource');
    res.render('absence_requests', {});
});

router.get('/login', function(req, res, next) {
    res.render('login', {});
});

module.exports = router;
