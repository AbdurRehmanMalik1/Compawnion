/**
 * @swagger
 * /api/forum/categories:
 *   get:
 *     tags:
 *       - Forum Categories
 *     summary: Get all forum categories
 *     description: Retrieves a list of all forum categories with post counts
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                       name:
 *                         type: string
 *                         example: "TRAINING"
 *                       count:
 *                         type: integer
 *                         example: 42
 *                       displayName:
 *                         type: string
 *                         example: "Training & Behavior"
 *                       description:
 *                         type: string
 *                         example: "Share training tips, techniques, and success stories."
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/categories/{category}:
 *   get:
 *     tags:
 *       - Forum Categories
 *     summary: Get posts by category
 *     description: Retrieves a paginated list of posts in a specific category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [NUTRITION, TRAINING, HEALTH, BEHAVIOR, GROOMING, ADOPTION, BREEDS, EMERGENCY, GENERAL]
 *         description: Category name
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, lastActivityAt, upvoteCount, viewCount, commentCount]
 *           default: lastActivityAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
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
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c86"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           avatar:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *                           role:
 *                             type: string
 *                             example: "ADOPTER"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T10:00:00.000Z"
 *                       lastActivityAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T14:30:00.000Z"
 *                       upvoteCount:
 *                         type: integer
 *                         example: 5
 *                       commentCount:
 *                         type: integer
 *                         example: 3
 *                       viewCount:
 *                         type: integer
 *                         example: 42
 *                       isPinned:
 *                         type: boolean
 *                         example: false
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "TRAINING"
 *                     displayName:
 *                       type: string
 *                       example: "Training & Behavior"
 *                     description:
 *                       type: string
 *                       example: "Share training tips, techniques, and success stories."
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
 *       400:
 *         description: Bad request - Invalid category
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/stats:
 *   get:
 *     tags:
 *       - Forum Categories
 *     summary: Get forum statistics
 *     description: Retrieves overall statistics for the forum
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                     totalPosts:
 *                       type: integer
 *                       example: 256
 *                     totalComments:
 *                       type: integer
 *                       example: 1024
 *                     totalUsers:
 *                       type: integer
 *                       example: 150
 *                     postsToday:
 *                       type: integer
 *                       example: 12
 *                     commentsToday:
 *                       type: integer
 *                       example: 48
 *                     mostActiveCategory:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "TRAINING"
 *                         count:
 *                           type: integer
 *                           example: 78
 *                     categoryBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "TRAINING"
 *                           count:
 *                             type: integer
 *                             example: 78
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 30.5
 *       500:
 *         description: Server error
 */
