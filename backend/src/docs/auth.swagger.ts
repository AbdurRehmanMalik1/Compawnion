/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account and sends verification OTP via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               avatar:
 *                 type: string
 *                 description: URL to user's profile picture
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signup successful. Please check your email for verification code.
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 */

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify user email with OTP
 *     description: Verifies user's email using the OTP sent during signup
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received via email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 */

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resend verification code
 *     description: Resends a new verification OTP to the user's email
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Verification code resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code has been resent to your email
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticates a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     role:
 *                       type: string
 *                       enum: [ADOPTER, SHELTER, VETERINARIAN, null]
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Clears the authentication cookie and logs out the user
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */

/**
 * @swagger
 * /api/auth/register-role:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register user role
 *     description: Assign a specific role to a verified user
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - roleData
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [SHELTER, ADOPTER, VETERINARIAN]
 *                 description: The role to assign to the user
 *               roleData:
 *                 type: object
 *                 description: Data specific to the role
 *                 properties:
 *                   shelterName:
 *                     type: string
 *                     description: Name of the shelter (required for SHELTER role)
 *                   address:
 *                     type: string
 *                     description: Address of the shelter (required for SHELTER role)
 *                   location:
 *                     type: object
 *                     description: Location coordinates (required for SHELTER role)
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [Point]
 *                         description: Type of the location (always Point)
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         minItems: 2
 *                         maxItems: 2
 *                         description: Array of [longitude, latitude] coordinates
 *                         example: [-73.935242, 40.730610]
 *                   phone:
 *                     type: string
 *                     description: Contact phone number (optional)
 *                   description:
 *                     type: string
 *                     description: Description of the shelter (optional)
 *     responses:
 *       200:
 *         description: Role registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     role:
 *                       type: string
 *                       enum: [ADOPTER, SHELTER, VETERINARIAN, null]
 *                     roleData:
 *                       type: object
 *                       nullable: true
 */
