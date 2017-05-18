var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);

router.use('/teacher', require('./teacher'));
router.use('/absence-request', require('./absence-request'));
router.use('/student', require('./student'));
router.use('/schedule', require('./schedule'));
router.use('/course', require('./course'));
router.use('/user', require('./user'));

router.get('/semesters-programs-classes', function(req, res, next) {
    var program_id = req.body.program_id;
    var class_id = req.body.class_id;
    var semester_id = req.body.semester_id;
    pool.getConnection(function(error, connection) {
        connection.query(`SELECT * FROM semesters`, function(error, rows, fields) {
            var semesters = rows;
            connection.query(`SELECT * FROM programs`, function(error, rows, fields) {
                var programs = rows;
                connection.query(`SELECT * FROM classes`, function(error, rows, fields) {
                    var classes = rows;
                    res.send({ result: 'success', semesters: semesters, programs: programs, classes: classes });
                    connection.release();
                    if (error) throw error;
                });
                if (error) throw error;
            });
            if (error) throw error;
        });
    });
});

//[name]
var insert_roles = [
    ['Student'],
    ['Teacher'],
    ['Staff'],
];
//[name, start_date, end_date, vacation_time]
var insert_semesters = [
    ['HK1 2015-2016', '10-1-2015 00:00:00', '12-23-2015 00:00:00', '12/24/2015 - 1/5/2016'],
    ['HK2 2015-2016', '1-15-2016 00:00:00', '4-28-2016 00:00:00', '4/30/2016 - 5/2/2016'],
    ['HK3 2015-2016', '5-5-2016 00:00:00', '8-8-2016 00:00:00', '8/16/2016 - 9/25/2016'],
    ['HK1 2016-2017', '10-2-2016 00:00:00', '12-25-2016 00:00:00', '12/24/2016 - 1/6/2017'],
];
//[name,code]
var insert_programs = [
    ['Chất lượng cao','CLC' ],
    ['Việt Pháp','VP' ],
    ['APCS','APCS' ],
];
//[code,email,program_id]
var insert_classes = [
    ['16CTT', '16apcs@student.hcmus.edu.vn', 3],
    ['15CTT', '15apcs@student.hcmus.edu.vn', 3],
    ['14CTT', '14apcs@student.hcmus.edu.vn', 3],
    ['13CTT', '13apcs@student.hcmus.edu.vn', 3],
    ['16VP', '16vp@student.hcmus.edu.vn', 2],
    ['15VP', '15vp@student.hcmus.edu.vn', 2],
    ['14VP', '14vp@student.hcmus.edu.vn', 2],
    ['13VP', '13vp@student.hcmus.edu.vn', 2],
    ['16CLC1', '16clc@student.hcmus.edu.vn', 1],
    ['16CLC2', '16clc@student.hcmus.edu.vn', 1],
    ['15CLC', '15clc@student.hcmus.edu.vn', 1],
    ['14CLC', '14clc@student.hcmus.edu.vn', 1],
    ['13CLC', '13clc@student.hcmus.edu.vn', 1],
];
//[code, name, semester_id,program_id]
var insert_courses = [
    ['CS162', 'Introduction to Computer Science II', '4', '3'], //
    ['MTH252', 'Calculus II', '4', '3'], //
    ['PH212', 'General Physics II', '4', '3'], //
    ['CTH001', 'Fundamental principles of  Marxism and Leninism', '4', '3'], //
    ['TC001', 'Physical Education', '4', '3'], //
    ['WR227', 'Technical Writing', '4', '3'],
    ['STAT451', 'Applied Statistics for Engineers and Scientists I', '4', '3'],
    ['CS251', 'Logical Structures', '4', '3'],
    ['CTH003', "Ho Chi Minh's Ideology", '4', '3'],
    ['ECE341', 'Computer Hardware', '4', '3'],
    ['CS322', 'Languages and Compiler Design II', '4', '3'],
    ['CS333', 'Introduction to Operating Systems', '4', '3'],
    ['CS350', 'Introduction to Computer Science II', '4', '3'],
    ['CS411', 'Computer Graphics', '4', '3'],
    ['CS419', 'Introduction to Information Retrieval', '4', '3'],
    ['CS422', 'Software analysis and design', '4', '3'],
    ['CS407', 'Technology Innovation and Leadership', '4', '3'],
    ['CS423', 'Software Testing', '4', '3'],
    ['CS488', 'Software Engineering Capstone II', '4', '3'],
];
//[class_id,course_id,schedules]
var insert_class_has_course = [
    ['1', '1', '5-I44-LT;9-I41-LT;15-I11C-TH;16-I11C-TH;23-I44-LT'],
    ['1', '2', '3-I42-TH;4-I42-TH;6-I44-LT;13-I44-LT'],
    ['1', '3', '14-I42-LT;16-I42-TH;19-I42-LT;20-I42-TH'],
    ['1', '4', '17-I44-LT;18-I44-LT'],
    ['1', '5', '21-OUT-TH;22-OUT-TH'],

    ['2', '6', '13-I42-LT;21-I42-LT'],
    ['2', '7', '9-I42-LT;10-I42-LT;19-B11A-TH'],
    ['2', '8', '2-I42-LT;11-I23-TH;12-I23-TH;18-I23-LT'],
    ['2', '9', '15-I23-LT;16-I23-LT'],
    ['2', '10', '7-B11A-LT;8-B11A-LT;14-I11C-TH'],

    ['3', '11', '2-I23-LT;6-I23-LT;13-I11C-TH;13-I44-LT'],
    ['3', '12', '1-I23-LT;7-I11C-TH;8-I11C-TH;17-I23-LT'],
    ['3', '13', '5-I23-LT;14-I23-LT;23-I23-TH'],
    ['3', '14', '3-I11C-TH;12-I44-LT;20-I44-LT'],
    ['3', '15', '4-I44-LT;21-I44-LT;24-I23-TH'],
    ['3', '16', '9-I23-LT;10-I23-LT'],

    ['4', '17', '7-I44-LT;8-I41-LT'],
    ['4', '18', '3-I44-LT;11-I44-LT'],
    ['4', '19', '13-I41-LT;14-I41-LT'],
];
//[first_name,last_name,email,phone,password,role_id]
var insert_users = [
    ['Đinh Bá', 'Tiến', 'dbtien@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('dbtien', 10) , 2],
    ['Nguyễn Hữu', 'Anh', 'nhanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nhanh', 10), 2],
    ['Nguyễn Hữu', 'Nhã', 'nhnha@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nhnha', 10), 2],
    ['Nguyễn Ngọc', 'Thu', 'nnthu@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nnthu', 10), 2],
    ['Nguyễn Văn', 'Hùng', 'nvhung@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nvhung', 10), 2],
    ['Trần Minh', 'Triết', 'tmtriet@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tmtriet', 10), 2],
    ['Phạm Hoàng', 'Uyên', 'phuyen@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('phuyen', 10), 2],
    ['Nguyễn Phúc', 'Sơn', 'npson@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('npson', 10), 2],
    ['Ngô Tuấn', 'Phương', 'ntphuong@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ntphuong', 10), 2],
    ['Nguyễn Tuấn', 'Nam', 'ntnam@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ntnam', 10), 2],
    ['Nguyễn Thanh', 'Phương', 'ntphuong1@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ntphuong1', 10), 2],
    ['Trần Trung', 'Dũng', 'ttdung@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ttdung', 10), 2],
    ['Trần Thái', 'Sơn', 'ttson@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ttson', 10), 2],
    ['Ngô Đức', 'Thành', 'ndthanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ndthanh', 10), 2],
    ['Dương Nguyên', 'Vũ', 'dnvu@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('dnvu', 10), 2],
    ['Lâm Quang', 'Vũ', 'lqvu@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('lqvu', 10), 2],
    ['Hồ Tuấn', 'Thanh', 'htthanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('htthanh', 10), 2],
    ['Trương Phước', 'Lộc', 'tploc@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tploc', 10), 2],
    ['Nguyễn Hữu Trí', 'Nhật', 'nhtnhat@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nhtnhat', 10), 2],
    ['Nguyễn Duy Hoàng', 'Minh', 'ndhminh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ndhminh', 10), 2],
    ['Lương Vĩ', 'Minh', 'lvminh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('lvminh', 10), 2],
    ['Nguyễn Vinh', 'Tiệp', 'nvtiep@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nvtiep', 10), 2],
    ['Phạm Việt', 'Khôi', 'pvkhoi@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('pvkhoi', 10), 2],
    ['Nguyễn Văn', 'Thìn', 'nvthin@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nvthin', 10), 2],
    ['Nguyễn Thị Thanh', 'Huyền', 'ntthuyen@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ntthuyen', 10), 2],
    ['Vũ Quốc', 'Hoàng', 'vqhoang@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('vqhoang', 10), 2],
    ['Lê Quốc', 'Hòa', 'lqhoa@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('lqhoa', 10), 2],
    ['Chung Thùy', 'Linh', 'ctlinh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ctlinh', 10), 2],
    ['Lê Yên', 'Thanh', 'lythanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('lythanh', 10), 2],
    ['Võ Hoài', 'Việt', 'vhviet@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('vhviet', 10), 2],
    ['Phạm Thanh', 'Tùng', 'pttung@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('pttung', 10), 2],
    ['Nguyễn Đức', 'Huy', 'ndhuy@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ndhuy', 10), 2],
    ['Nguyễn Khắc', 'Huy', 'nkhuy@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('nkhuy', 10), 2],
    ['Trần Duy', 'Quang', 'tdquang@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tdquang', 10), 2],
    ['Trần Ngọc Đạt', 'Thành', 'tndthanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tndthanh', 10), 2],
    ['Lê Minh', 'Quốc', 'lmquoc@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('lmquoc', 10), 2],
    ['Phạm Đức', 'Thịnh', 'pdthinh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('pdthinh', 10), 2],
    ['Bùi Quốc', 'Minh', 'bqminh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('bqminh', 10), 2],
    ['Võ Duy', 'Anh', 'vdanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('vdanh', 10), 2],
    ['Trần Thị Bích', 'Hạnh', 'ttbhanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('ttbhanh', 10), 2],
    ['Trương Phước', 'Lộc', 'tploc@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tploc', 10), 2],
    ['Trần Duy', 'Quang', 'tdquang@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tdquang', 10), 2],
    ['Tuấn Nguyên Đức', 'Hoài', 'tndhoai@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('tndhoai', 10), 2],
    ['Trần Hoàng', 'Khanh', 'thkhanh@fit.hcmus.edu.vn','090xxxx', bcrypt.hashSync('thkhanh', 10), 2],
];
//[teacher_id,course_id,teacher_role],
var insert_teacher_teach_course = [
    ['1', '1', '0'],
    ['17', '1', '1'],
    ['18', '1', '1'],

    ['2', '2', '0'],
    ['19', '2', '1'],

    ['3', '3', '0'],
    ['20', '3', '1'],

    ['4', '4', '0'],

    ['5', '5', '0'],

    ['6', '6', '0'],
    ['21', '6', '1'],
    ['22', '6', '1'],
    ['23', '6', '1'],

    ['7', '7', '0'],
    ['24', '7', '1'],
    ['8', '8', '0'],

    ['19', '8', '1'],

    ['9', '9', '0'],

    ['10', '10', '0'],
    ['25', '10', '1'],

    ['11', '11', '0'],
    ['26', '11', '1'],

    ['12', '12', '0'],
    ['27', '12', '1'],
    ['28', '12', '1'],

    ['2', '13', '0'],
    ['6', '13', '0'],
    ['22', '13', '1'],
    ['23', '13', '1'],
    ['29', '13', '1'],

    ['13', '14', '0'],
    ['31', '14', '1'],
    ['30', '14', '1'],

    ['14', '15', '0'], //
    ['22', '15', '1'],

    ['16', '16', '0'],
    ['23', '16', '1'],
    ['31', '16', '1'],
    ['32', '16', '1'],
    ['33', '16', '1'],
    ['34', '16', '1'],

    ['15', '17', '0'],
    ['38', '17', '1'],
    ['37', '17', '1'],
    ['36', '17', '1'],
    ['35', '17', '1'],

    ['16', '18', '0'],
    ['40', '18', '1'],
    ['39', '18', '1'],

    ['16', '19', '0'],
    ['31', '19', '1'],
    ['43', '19', '1'],
    ['17', '19', '1'],
    ['42', '19', '1'],
    ['40', '19', '1'],
];

var insert_students = [
    { id: 8, stud_id: '1353019', status: 1, note: '', class_id: 13 },
    { id: 9, stud_id: '1353020', status: 1, note: '', class_id: 13 },
    { id: 10, stud_id: '1353021', status: 1, note: '', class_id: 13 },
    { id: 11, stud_id: '1353022', status: 1, note: '', class_id: 13 },
    { id: 12, stud_id: '1353023', status: 1, note: '', class_id: 13 },
    { id: 13, stud_id: '1353024', status: 1, note: '', class_id: 13 },
    { id: 14, stud_id: '1353025', status: 1, note: '', class_id: 13 },
];


router.get('/seed', function(req, res, next) {
    pool.getConnection(function(error, connection) {
        connection.beginTransaction(function(error) {
            if (error) throw error;
            connection.query('INSERT INTO roles (name) VALUES ?', [insert_roles],
                function(error, results, fields) {
                    if (error) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                });

            connection.query('INSERT INTO semesters (name,start_date,end_date,vacation_time) VALUES ?', [insert_semesters],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            
            connection.query('INSERT INTO programs (name,code) VALUES ?', [insert_programs],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });

            connection.query('INSERT INTO classes (name,email,program_id) VALUES ?', [insert_classes],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });

            connection.query('INSERT INTO courses (code,name,semester_id,program_id) VALUES ?', [insert_courses],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });

            connection.query('INSERT INTO class_has_course (class_id,course_id,schedules) VALUES ?', [insert_class_has_course],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });

            connection.query('INSERT INTO users (first_name,last_name,email,phone,password,role_id) VALUES ?', [insert_users],
                        function(error, results, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            //Teacher
                            // Move to trigger
                        });

            connection.query('INSERT INTO teacher_teach_course (teacher_id,course_id,teacher_role) VALUES ?', [insert_teacher_teach_course],
                function(error, results, fields) {
                    if (error) {
                        return connection.rollback(function() {
                            throw error;
                        });
                    }
                });
            
            connection.commit(function(err) {
                if (err) {
                    return connection.rollback(function() {
                        throw err;
                    });
                }
                res.send('success');
                console.log('success seeding!');
            });
        });
        connection.release();
        if (error) throw error;
    });
});

module.exports = router;
