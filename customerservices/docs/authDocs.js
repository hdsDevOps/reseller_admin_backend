/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         email: user@example.com
 *         password: password123
 */

/**
 * @swagger
 * /customer/register:
 *   post:
 *     summary: Register a new admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Error creating user
 */

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Log in an admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: User login token generated
 *       400:
 *         description: Error during login
 */
