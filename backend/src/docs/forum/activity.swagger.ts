/**
 * @swagger
 * /api/forum/activity:
 *   get:
 *     tags:
 *       - Forum Activity
 *     summary: Get current user's forum activity
 *     description: Retrieves the current user's forum activity summary
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     postCount:
 *                       type: integer
 *                       example: 15
 *                     commentCount:
 *                       type: integer
 *                       example: 42
 *                     upvotesReceived:
 *                       type: integer
 *                       example: 87
 *                     recentPosts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c85"
 *                           title:
 *                             type: string
 *                             example: "How to train a puppy to sit"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-06-15T10:00:00.000Z"
 *                     recentComments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c87"
 *                           content:
 *                             type: string
 *                             example: "Try using treats as a reward when your puppy sits correctly."
 *                           postId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "60d21b4667d0d8992e610c85"
 *                               title:
 *                                 type: string
 *                                 example: "How to train a puppy to sit"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-06-15T11:30:00.000Z"
 *                     bookmarkedPosts:
 *                       type: integer
 *                       example: 8
 *                     reputation:
 *                       type: integer
 *                       example: 120
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/users/{userId}/posts:
 *   get:
 *     tags:
 *       - Forum Activity
 *     summary: Get a user's posts
 *     description: Retrieves a paginated list of posts created by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       title:
 *                         type: string
 *                         example: "How to train a puppy to sit"
 *                       content:
 *                         type: string
 *                         example: "I've been trying to train my new puppy to sit but having some difficulties. Any advice would be appreciated!"
 *                       category:
 *                         type: string
 *                         example: "TRAINING"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T10:00:00.000Z"
 *                       upvoteCount:
 *                         type: integer
 *                         example: 5
 *                       commentCount:
 *                         type: integer
 *                         example: 3
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c86"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     role:
 *                       type: string
 *                       example: "ADOPTER"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/users/{userId}/comments:
 *   get:
 *     tags:
 *       - Forum Activity
 *     summary: Get a user's comments
 *     description: Retrieves a paginated list of comments created by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c87"
 *                       content:
 *                         type: string
 *                         example: "Try using treats as a reward when your puppy sits correctly."
 *                       postId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c85"
 *                           title:
 *                             type: string
 *                             example: "How to train a puppy to sit"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T11:30:00.000Z"
 *                       upvoteCount:
 *                         type: integer
 *                         example: 3
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c86"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     role:
 *                       type: string
 *                       example: "ADOPTER"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 5
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/contributors:
 *   get:
 *     tags:
 *       - Forum Activity
 *     summary: Get top forum contributors
 *     description: Retrieves a list of the most active users on the forum
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of contributors to return
 *     responses:
 *       200:
 *         description: Contributors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c86"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       avatar:
 *                         type: string
 *                         example: "https://example.com/avatar.jpg"
 *                       role:
 *                         type: string
 *                         example: "VETERINARIAN"
 *                       postCount:
 *                         type: integer
 *                         example: 25
 *                       commentCount:
 *                         type: integer
 *                         example: 87
 *                       upvotesReceived:
 *                         type: integer
 *                         example: 156
 *                       reputation:
 *                         type: integer
 *                         example: 243
 *                       joinedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-15T10:00:00.000Z"
 *       500:
 *         description: Server error
 */
