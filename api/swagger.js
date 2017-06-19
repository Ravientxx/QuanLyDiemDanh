/**
 * @swagger
 * tags:
 *   name: Test
 *   description: ez test ez life
 */

/**
 * @swagger
 * /authenticate/test:
 *   post:
 *     summary: test
 *     description:
 *     tags: [Test]
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: json
 */

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
 *     responses:
 *       200:
 *         description: json
 */

/**
* @swagger
* tags:
*   name: User
*   description: User data
*/

/**
* @swagger
* /api/user/detail:
*   post:
*     summary: Get a user profile
*     description: 
*     tags: [User]
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: user ID
*         in: formData
*         required: true
*         type: integer
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* tags:
*   name: Teacher
*   description: Teacher data
*/

/**
* @swagger
* /api/teacher/detail:
*   get:
*     summary: Get a teacher profile
*     description: 
*     tags: [Teacher]
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: user ID
*         in: formData
*         required: true
*         type: integer
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* tags:
*   name: Student
*   description: Student data
*/

/**
* @swagger
* /api/student/list:
*   post:
*     summary: Get student list
*     description: 
*     tags: [Student]
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


/**
* @swagger
* tags:
*   name: Course
*   description: Course data
*/

/**
* @swagger
* /api/course/teachinglist:
*   post:
*     summary: Get Course list
*     description: 
*     tags: [Course]
*     produces:
*       - application/json
*     parameters:
*       - name: teacher_id
*         description: courses list
*         in: formData
*         required: true
*         type: integer
*       - name: token
*         description: token
*         in: formData
*         required: true
*         type: string
*     responses:
*       200:
*         description: json
*/

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
