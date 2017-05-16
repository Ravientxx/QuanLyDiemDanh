var express = require('express');
var router = express.Router();
var _global = require('../global.js');
var mysql = require('mysql');
var connection = mysql.createConnection(_global.db);
var pool = mysql.createPool(_global.db);
var bcrypt = require('bcrypt');
var student_list = [];

/**
* @swagger
* /ditmemay:
*   post:
*     summary: Login to the application
*     description: 
*     tags: [csgo]
*     produces:
*       - application/json
*     parameters:
*       - name: username
*         description: User's name.
*         in: formData
*         required: true
*         type: string
*       - name: password
*         description: User's password.
*         in: formData
*         required: true
*         type: string
*     responses:
*       200:
*         description: login
*/

/**
* @swagger
* /dumemay:
*   get:
*     description: Returns users
*     tags:
*      - Users
*     produces:
*      - application/json
*     responses:
*       200:
*         description: users
*/

router.get('/',function (req,res,next) {
	console.log('bac');
});

module.exports = router;