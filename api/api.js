var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var absence_request_api = require('./absence-request');
var teacher_api = require('./teacher');
var student_api = require('./student');
var _global = require('../global.js');
var mysql = require('mysql');
var pool = mysql.createPool(_global.db);

router.use('/teacher', teacher_api);
router.use('/absence-request', absence_request_api);
router.use('/student', student_api);
var insert_roles = [
    { name: 'Student' },
    { name: 'Teacher' },
    { name: 'Staff' },
]
var insert_semesters = [
    { name: 'HK1 2015-2016', start_date: '10/1/2015', end_date: '12/23/2015', vacation_time: '12/24/2015 - 1/5/2016' },
    { name: 'HK2 2015-2016', start_date: '1/15/2016', end_date: '4/28/2016', vacation_time: '4/30/2016 - 5/2/2016' },
    { name: 'HK3 2015-2016', start_date: '5/5/2016', end_date: '8/8/2016', vacation_time: '8/16/2016 - 9/25/2016' },
    { name: 'HK1 2016-2017', start_date: '10/2/2016', end_date: '12/25/2016', vacation_time: '12/24/2016 - 1/6/2017' },
];
var insert_programs = [
    { name: 'Chất lượng cao', code: 'CLC' },
    { name: 'Việt Pháp', code: 'VP' },
    { name: 'APCS', code: 'APCS' },
];
var insert_classes = [
    { name: '16CTT', email: '16apcs@student.hcmus.edu.vn', program_id: 3 },
    { name: '15CTT', email: '15apcs@student.hcmus.edu.vn', program_id: 3 },
    { name: '14CTT', email: '14apcs@student.hcmus.edu.vn', program_id: 3 },
    { name: '13CTT', email: '13apcs@student.hcmus.edu.vn', program_id: 3 },
    { name: '16VP', email: '16vp@student.hcmus.edu.vn', program_id: 2 },
    { name: '15VP', email: '15vp@student.hcmus.edu.vn', program_id: 2 },
    { name: '14VP', email: '14vp@student.hcmus.edu.vn', program_id: 2 },
    { name: '13VP', email: '13vp@student.hcmus.edu.vn', program_id: 2 },
    { name: '16CLC1', email: '16clc@student.hcmus.edu.vn', program_id: 1 },
    { name: '16CLC2', email: '16clc@student.hcmus.edu.vn', program_id: 1 },
    { name: '15CLC', email: '15clc@student.hcmus.edu.vn', program_id: 1 },
    { name: '14CLC', email: '14clc@student.hcmus.edu.vn', program_id: 1 },
    { name: '13CLC', email: '13clc@student.hcmus.edu.vn', program_id: 1 },
];
var insert_courses = [
    { code: 'CS162', name: 'Introduction to Computer Science II', semester_id: '4', program_id: '3' }, //
    { code: 'MTH252', name: 'Calculus II', semester_id: '4', program_id: '3' }, //
    { code: 'PH212', name: 'General Physics II', semester_id: '4', program_id: '3' }, //
    { code: 'CTH001', name: 'Fundamental principles of  Marxism and Leninism', semester_id: '4', program_id: '3' }, //
    { code: 'TC001', name: 'Physical Education', semester_id: '4', program_id: '3' }, //
    { code: 'WR227', name: 'Technical Writing', semester_id: '4', program_id: '3' },
    { code: 'STAT451', name: 'Applied Statistics for Engineers and Scientists I', semester_id: '4', program_id: '3' },
    { code: 'CS251', name: 'Logical Structures', semester_id: '4', program_id: '3' },
    { code: 'CTH003', name: "Ho Chi Minh's Ideology", semester_id: '4', program_id: '3' },
    { code: 'ECE341', name: 'Computer Hardware', semester_id: '4', program_id: '3' },
    { code: 'CS322', name: 'Languages and Compiler Design II', semester_id: '4', program_id: '3' },
    { code: 'CS333', name: 'Introduction to Operating Systems', semester_id: '4', program_id: '3' },
    { code: 'CS350', name: 'Introduction to Computer Science II', semester_id: '4', program_id: '3' },
    { code: 'CS411', name: 'Computer Graphics', semester_id: '4', program_id: '3' },
    { code: 'CS419', name: 'Introduction to Information Retrieval', semester_id: '4', program_id: '3' },
    { code: 'CS422', name: 'Software analysis and design', semester_id: '4', program_id: '3' },
    { code: 'CS407', name: 'Technology Innovation and Leadership', semester_id: '4', program_id: '3' },
    { code: 'CS423', name: 'Software Testing', semester_id: '4', program_id: '3' },
    { code: 'CS488', name: 'Software Engineering Capstone II', semester_id: '4', program_id: '3' },
];

var insert_class_has_course = [
    { class_id: '1', course_id: '1', schedules: '5-I44-LT;9-I41-LT;15-I11C-TH;16-I11C-TH;23-I44-LT' },
    { class_id: '1', course_id: '2', schedules: '3-I42-TH;4-I42-TH;6-I44-LT;13-I44-LT' },
    { class_id: '1', course_id: '3', schedules: '14-I42-LT;16-I42-TH;19-I42-LT;20-I42-TH' },
    { class_id: '1', course_id: '4', schedules: '17-I44-LT;18-I44-LT' },
    { class_id: '1', course_id: '5', schedules: '21-OUT-TH;22-OUT-TH' },

    { class_id: '2', course_id: '6', schedules: '13-I42-LT;21-I42-LT' },
    { class_id: '2', course_id: '7', schedules: '9-I42-LT;10-I42-LT;19-B11A-TH' },
    { class_id: '2', course_id: '8', schedules: '2-I42-LT;11-I23-TH;12-I23-TH;18-I23-LT' },
    { class_id: '2', course_id: '9', schedules: '15-I23-LT;16-I23-LT' },
    { class_id: '2', course_id: '10', schedules: '7-B11A-LT;8-B11A-LT;14-I11C-TH' },

    { class_id: '3', course_id: '11', schedules: '2-I23-LT;6-I23-LT;13-I11C-TH;13-I44-LT' },
    { class_id: '3', course_id: '12', schedules: '1-I23-LT;7-I11C-TH;8-I11C-TH;17-I23-LT' },
    { class_id: '3', course_id: '13', schedules: '5-I23-LT;14-I23-LT;23-I23-TH' },
    { class_id: '3', course_id: '14', schedules: '3-I11C-TH;12-I44-LT;20-I44-LT' },
    { class_id: '3', course_id: '15', schedules: '4-I44-LT;21-I44-LT;24-I23-TH' },
    { class_id: '3', course_id: '16', schedules: '9-I23-LT;10-I23-LT' },

    { class_id: '4', course_id: '17', schedules: '7-I44-LT;8-I41-LT' },
    { class_id: '4', course_id: '18', schedules: '3-I44-LT;11-I44-LT' },
    { class_id: '4', course_id: '19', schedules: '13-I41-LT;14-I41-LT' },
];
var insert_users = [
    { name: 'Đinh Bá Tiến', email: 'dbtien@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Hữu Anh', email: 'nhanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Hữu Nhã', email: 'nhnha@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Ngọc Thu', email: 'nnthu@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Văn Hùng', email: 'nvhung@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Minh Triết', email: 'tmtriet@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Phạm Hoàng Uyên', email: 'phuyen@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Phúc Sơn', email: 'npson@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Ngô Tuấn Phương', email: 'ntphuong@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Tuấn Nam', email: 'ntnam@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Thanh Phương', email: 'ntphuong1@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Trung Dũng', email: 'ttdung@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Thái Sơn', email: 'ttson@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Ngô Đức Thành', email: 'ndthanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Dương Nguyên Vũ', email: 'dnvu@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Lâm Quang Vũ', email: 'lqvu@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Hồ Tuấn Thanh', email: 'htthanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trương Phước Lộc', email: 'tploc@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Hữu Trí Nhật', email: 'nhtnhat@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Duy Hoàng Minh', email: 'ndhminh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Lương Vĩ Minh', email: 'lvminh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Vinh Tiệp', email: 'nvtiep@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Phạm Việt Khôi', email: 'pvkhoi@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Văn Thìn', email: 'nvthin@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Thị Thanh Huyền', email: 'ntthuyen@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Vũ Quốc Hoàng', email: 'vqhoang@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Lê Quốc Hòa', email: 'lqhoa@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Chung Thùy Linh', email: 'ctlinh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Lê Yên Thanh', email: 'lythanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Võ Hoài Việt', email: 'vhviet@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Phạm Thanh Tùng', email: 'pttung@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Đức Huy', email: 'ndhuy@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Nguyễn Khắc Huy', email: 'nkhuy@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Duy Quang', email: 'tdquang@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Ngọc Đạt Thành', email: 'tndthanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Lê Minh Quốc', email: 'lmquoc@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Phạm Đức Thịnh', email: 'pdthinh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Bùi Quốc Minh', email: 'bqminh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Võ Duy Anh', email: 'vdanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Thị Bích Hạnh', email: 'ttbhanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trương Phước Lộc', email: 'tploc@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Duy Quang', email: 'tdquang@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Tuấn Nguyên Đức Hoài', email: 'tndhoai@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },
    { name: 'Trần Hoàng Khanh', email: 'thkhanh@fit.hcmus.edu.vn', phone: '090xxxx', password: '', role_id: 2 },


    { name: 'Huỳnh Hữu Nghĩa', email: '1353019@student.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
    { name: 'Lê Văn Tín', email: '1353020@fit.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
    { name: 'Trần Lê Công Hậu', email: '1353021@fit.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
    { name: 'Lê Minh Thiện', email: '1353022@fit.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
    { name: 'Hoàng Hồ Hải Đăng', email: '1353023@fit.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
    { name: 'Phạm Hoàng Tuấn', email: '1353024@fit.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
    { name: 'Đào Thị Thanh Trang', email: '1353025@fit.hcmus.edu.vn', phone: '01228718705', password: '', role_id: 1 },
];

var insert_teacher_teach_course = [
    { teacher_id: '1', course_id: '1', teacher_role: '0' },
    { teacher_id: '17', course_id: '1', teacher_role: '1' },
    { teacher_id: '18', course_id: '1', teacher_role: '1' },

    { teacher_id: '2', course_id: '2', teacher_role: '0' },
    { teacher_id: '19', course_id: '2', teacher_role: '1' },

    { teacher_id: '3', course_id: '3', teacher_role: '0' },
    { teacher_id: '20', course_id: '3', teacher_role: '1' },

    { teacher_id: '4', course_id: '4', teacher_role: '0' },

    { teacher_id: '5', course_id: '5', teacher_role: '0' },

    { teacher_id: '6', course_id: '6', teacher_role: '0' },
    { teacher_id: '21', course_id: '6', teacher_role: '1' },
    { teacher_id: '22', course_id: '6', teacher_role: '1' },
    { teacher_id: '23', course_id: '6', teacher_role: '1' },

    { teacher_id: '7', course_id: '7', teacher_role: '0' },
    { teacher_id: '24', course_id: '7', teacher_role: '1' },
    { teacher_id: '8', course_id: '8', teacher_role: '0' },

    { teacher_id: '19', course_id: '8', teacher_role: '1' },

    { teacher_id: '9', course_id: '9', teacher_role: '0' },

    { teacher_id: '10', course_id: '10', teacher_role: '0' },
    { teacher_id: '25', course_id: '10', teacher_role: '1' },

    { teacher_id: '11', course_id: '11', teacher_role: '0' },
    { teacher_id: '26', course_id: '11', teacher_role: '1' },

    { teacher_id: '12', course_id: '12', teacher_role: '0' },
    { teacher_id: '27', course_id: '12', teacher_role: '1' },
    { teacher_id: '28', course_id: '12', teacher_role: '1' },

    { teacher_id: '13', course_id: '13', teacher_role: '0' },
    { teacher_id: '22', course_id: '13', teacher_role: '1' },
    { teacher_id: '23', course_id: '13', teacher_role: '1' },
    { teacher_id: '29', course_id: '13', teacher_role: '1' },

    { teacher_id: '14', course_id: '14', teacher_role: '0' },
    { teacher_id: '31', course_id: '14', teacher_role: '1' },
    { teacher_id: '30', course_id: '14', teacher_role: '1' },

    { teacher_id: '15', course_id: '15', teacher_role: '0' },
    { teacher_id: '22', course_id: '15', teacher_role: '1' },

    { teacher_id: '16', course_id: '16', teacher_role: '0' },
    { teacher_id: '23', course_id: '16', teacher_role: '1' },
    { teacher_id: '31', course_id: '16', teacher_role: '1' },
    { teacher_id: '32', course_id: '16', teacher_role: '1' },
    { teacher_id: '33', course_id: '16', teacher_role: '1' },
    { teacher_id: '34', course_id: '16', teacher_role: '1' },

    { teacher_id: '17', course_id: '17', teacher_role: '0' },
    { teacher_id: '38', course_id: '17', teacher_role: '1' },
    { teacher_id: '37', course_id: '17', teacher_role: '1' },
    { teacher_id: '36', course_id: '17', teacher_role: '1' },
    { teacher_id: '35', course_id: '17', teacher_role: '1' },

    { teacher_id: '18', course_id: '18', teacher_role: '0' },
    { teacher_id: '40', course_id: '18', teacher_role: '1' },
    { teacher_id: '39', course_id: '18', teacher_role: '1' },

    { teacher_id: '19', course_id: '19', teacher_role: '0' },
    { teacher_id: '31', course_id: '19', teacher_role: '1' },
    { teacher_id: '43', course_id: '19', teacher_role: '1' },
    { teacher_id: '42', course_id: '19', teacher_role: '1' },
    { teacher_id: '40', course_id: '19', teacher_role: '1' },
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
            for (var i = 0; i < insert_roles.length; i++) {
                connection.query('INSERT INTO roles SET ?', insert_roles[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
            for (var i = 0; i < insert_semesters.length; i++) {
                connection.query('INSERT INTO semesters SET ?', insert_semesters[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
            for (var i = 0; i < insert_programs.length; i++) {
                connection.query('INSERT INTO programs SET ?', insert_programs[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
            for (var i = 0; i < insert_classes.length; i++) {
                connection.query('INSERT INTO classes SET ?', insert_classes[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
            for (var i = 0; i < insert_courses.length; i++) {
                connection.query('INSERT INTO courses SET ?', insert_courses[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
            for (var i = 0; i < insert_class_has_course.length; i++) {
                connection.query('INSERT INTO class_has_course SET ?', insert_class_has_course[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
            for (var i = 0; i < insert_users.length; i++) {
                insert_users[i].password = bcrypt.hashSync(insert_users[i].email.split('@')[0], 10);
                var role_id = insert_users[i].role_id;
                if (role_id == 2) {
                    connection.query('INSERT INTO users SET ?', insert_users[i],
                        function(error, results, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                            var id = { id: results.insertId };
                            //Teacher
                            connection.query('INSERT INTO teachers SET ?', id, function(error, results, fields) {
                                if (error) {
                                    return connection.rollback(function() {
                                        throw error;
                                    });
                                }
                            });
                        });
                } else {
                    connection.query('INSERT INTO users SET ?', insert_users[i],
                        function(error, results, fields) {
                            if (error) {
                                return connection.rollback(function() {
                                    throw error;
                                });
                            }
                        });
                }
            }
            for (var i = 0; i < insert_teacher_teach_course.length; i++) {
                connection.query('INSERT INTO teacher_teach_course SET ?', insert_teacher_teach_course[i],
                    function(error, results, fields) {
                        if (error) {
                            return connection.rollback(function() {
                                throw error;
                            });
                        }
                    });
            }
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
