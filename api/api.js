var express = require('express');
var router = express.Router();
var absence_request_api = require('./absence-request');
var teacher_api = require('./teacher');

router.use('/teacher',teacher_api);
router.use('/absence-request',absence_request_api);

module.exports = router;
