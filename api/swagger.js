/**
* @swagger
* tags:
*   name: Auth
*   description: Authenticate
*/

/**
 * @swagger
 * /api/authenticate/login:
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
 * /api/authenticate/logout:
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
 * /api/authenticate/test:
 *   post:
 *     summary: test
 *     description:
 *     tags: [Auth]
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
*   name: User
*   description: User management
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
* /api/user/update:
*   put:
*     summary: update user profile
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
*       - name: firstname
*         description: user firstname
*         in: formData
*         type: string
*       - name: lastname
*         description: user lastname
*         in: formData
*         type: string
*       - name: email
*         description: user email
*         in: formData
*         type: string
*         format: email
*       - name: phone
*         description: user phone
*         in: formData
*         type: string
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* /api/user/delete:
*   delete:
*     summary: delete a user
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
* /api/user/changePassword:
*   put:
*     summary: change password
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
*       - name: currentPassword
*         description: current password
*         in: formData
*         required: true
*         type: string
*       - name: newPassword
*         description: new password
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
*   name: Teacher
*   description: Teacher management
*/

/**
* @swagger
* /api/teacher/list:
*   post:
*     summary: Get teacher list
*     description: 
*     tags: [Teacher]
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
*         description: acs or dcs
*         in: formData
*         type: string
*     responses:
*       200:
*         description: json
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
* /api/teacher/add:
*   post:
*     summary: Add a teacher
*     description: 
*     tags: [Teacher]
*     produces:
*       - application/json
*     parameters:
*       - name: firstname
*         description: user firstname
*         in: formData
*         required: true
*         type: string
*       - name: lastname
*         description: user lastname
*         in: formData
*         required: true
*         type: string
*       - name: email
*         description: user email
*         in: formData
*         required: true
*         type: string
*         format: email
*       - name: phone
*         description: user phone
*         in: formData
*         type: string
*     responses:
*       200:
*         description: json
*/

/**
* @swagger
* tags:
*   name: Student
*   description: Student management
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
* /api/student/detail:
*   post:
*     summary: Get a student detail
*     description: 
*     tags: [Student]
*     produces:
*       - application/json
*     parameters:
*       - name: id
*         description: student id
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
*   name: Course
*   description: Course management
*/

/**
* @swagger
* /api/course/list:
*   post:
*     summary: Get Course list
*     description: 
*     tags: [Course]
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
