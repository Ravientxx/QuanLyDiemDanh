var express = require('express');
var router = express.Router();
var _global = require('../global.js');

var argv = require('minimist')(process.argv.slice(2));
var subpath = express();

router.use('/', function (req, res, next) {
    res.redirect('/v' + _global.api_ver);
});

router.use('/v1',  function (req, res, nex) {
    res.sendFile(__dirname + 'swagger-ui/dist/v1.html');
});

var swagger = require('swagger-node-express').createNew(subpath);

swagger.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});

module.exports = router;
