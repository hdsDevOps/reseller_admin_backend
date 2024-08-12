/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Admin's email address
 *           example: admin@example.com
 *         password:
 *           type: string
 *           description: Admin's password
 *           example: securepassword123
 */

/**
 * @swagger
 * /adminservices/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 */

/**
 * @swagger
 * /adminservices/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /adminservices/forgetpassword:
 *   post:
 *     summary: Generate forget password link
 *     tags: [Admin Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin's email address
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Forget password link generated successfully
 */

/**
 * @swagger
 * /adminservices:
 *   get:
 *     summary: Get admin services message
 *     tags: [Admin Services]
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /adminservices/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Admin Services]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */

/**
 * @swagger
 * /adminservices/send-email:
 *   post:
 *     summary: Send an email
 *     tags: [Admin Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient's email address
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               text:
 *                 type: string
 *                 description: Email body text
 *     responses:
 *       200:
 *         description: Email queued for sending
 */
