// Authenticate

/**
* @swagger
* tags:
*   name: Auth
*   description: Authenticate
*/

/**
 * @swagger
 * /authenticate/login:
 *   post:
 *     summary: login and retrieve token
 *     description:
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: user ID
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: user password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: json
 */

/**
 * @swagger
 * /authenticate/logout:
 *   post:
 *     summary: logout
 *     description:
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: formData
 *         required: true
 *         type: string
 *       - name: user_id
 *         description: user id
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: json
 */

// Student

/**
* @swagger
* tags:
*   name: Student
*   description: Student data
*/

/**
* @swagger
* /api/attendance/check-attendance-list:
*   post:
*     summary: Get students of course
*     description:
*     tags: [Student]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: formData
*         required: true
*         type: string
*       - name: class_id
*         description: class id
*         in: formData
*         required: true
*         type: integer
*       - name: course_id
*         description: course id
*         in: formData
*         required: true
*         type: integer
*       - name: islistOnly
*         description: islistOnly
*         in: formData
*         type: integer
*     responses:
*       200:
*         description: json
*/

// Course

/**
* @swagger
* tags:
*   name: Course
*   description: Course data
*/

/**
* @swagger
* /api/course/teaching:
*   post:
*     summary: Get Course list
*     description:
*     tags: [Course]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*     responses:
*       200:
*         description: json
*/

// Attendance

/**
* @swagger
* tags:
*   name: Attendance
*   description: Attendance management
*/

/**
* @swagger
* /api/attendance/opening-by-teacher:
*   post:
*     summary: Get opening attendance
*     description:
*     tags: [Attendance]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*       - name: teacher_id
*         description: teacher id
*         in: formData
*         required: true
*         type: integer
*       - name: isMobile
*         description: mobile reduce data
*         in: formData
*         type: integer
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* /api/attendance/create:
*   post:
*     summary: request an attendance id from server
*     description:
*     tags: [Attendance]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*       - name: course_id
*         description: courses id
*         in: formData
*         required: true
*         type: integer
*       - name: class_id
*         description: class id
*         in: formData
*         required: true
*         type: integer
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* /api/attendance/delete:
*   post:
*     summary: delete an attendance
*     description:
*     tags: [Attendance]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*       - name: attend_id
*         description: attend id
*         in: formData
*         required: true
*         type: integer
*       - name: teacher_id
*         description: teacher id
*         in: formData
*         required: true
*         type: integer
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* /api/attendance/sync:
*   post:
*     summary: sync attendance data
*     description:
*     tags: [Attendance]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*       - name: attend_id
*         description: attend id
*         in: formData
*         required: true
*         type: integer
*       - name: teacher_id
*         description: teacher id
*         in: formData
*         required: true
*         type: integer
*       - name: data
*         description: data
*         in: formData
*         required: true
*         type: array
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* /api/attendance/updateStatus:
*   post:
*     summary: change status of attendance
*     description:
*     tags: [Attendance]
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*       - name: status
*         description: new status
*         in: formData
*         required: true
*         type: integer
*       - name: teacher_id
*         description: teacher id
*         in: formData
*         required: true
*         type: integer
*     responses:
*       200:
*         description: json
*/

//check-attendance-list attendant_id