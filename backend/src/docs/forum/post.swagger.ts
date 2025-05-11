/**
 * @swagger
 * /api/forum/posts:
 *   post:
 *     tags:
 *       - Forum
 *     summary: Create a new forum post
 *     description: Creates a new post in the forum
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Post title
 *                 example: "How to train a puppy to sit"
 *               content:
 *                 type: string
 *                 description: Post content
 *                 example: "I've been trying to train my new puppy to sit but having some difficulties. Any advice would be appreciated!"
 *               category:
 *                 type: string
 *                 enum: [NUTRITION, TRAINING, HEALTH, BEHAVIOR, GROOMING, ADOPTION, BREEDS, EMERGENCY, GENERAL]
 *                 description: Post category
 *                 example: "TRAINING"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags related to the post
 *                 example: ["puppy", "training", "commands"]
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs to attached images or files
 *                 example: ["https://example.com/image1.jpg"]
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "How to train a puppy to sit"
 *                     content:
 *                       type: string
 *                       example: "I've been trying to train my new puppy to sit but having some difficulties. Any advice would be appreciated!"
 *                     category:
 *                       type: string
 *                       example: "TRAINING"
 *                     userId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d21b4667d0d8992e610c86"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         avatar:
 *                           type: string
 *                           example: "https://example.com/avatar.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T10:00:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     tags:
 *       - Forum
 *     summary: Get forum posts
 *     description: Retrieves a paginated list of forum posts with optional filtering
 *     parameters:
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
 *         name: category
 *         schema:
 *           type: string
 *           enum: [NUTRITION, TRAINING, HEALTH, BEHAVIOR, GROOMING, ADOPTION, BREEDS, EMERGENCY, GENERAL]
 *         description: Filter posts by category
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for post title or content
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully
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
 *                       downvoteCount:
 *                         type: integer
 *                         example: 1
 *                       commentCount:
 *                         type: integer
 *                         example: 3
 *                       viewCount:
 *                         type: integer
 *                         example: 42
 *                       isPinned:
 *                         type: boolean
 *                         example: false
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
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/posts/{postId}:
 *   get:
 *     tags:
 *       - Forum
 *     summary: Get a forum post by ID
 *     description: Retrieves a specific forum post by its ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully
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
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "How to train a puppy to sit"
 *                     content:
 *                       type: string
 *                       example: "I've been trying to train my new puppy to sit but having some difficulties. Any advice would be appreciated!"
 *                     category:
 *                       type: string
 *                       example: "TRAINING"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["puppy", "training", "commands"]
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg"]
 *                     userId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "60d21b4667d0d8992e610c86"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         avatar:
 *                           type: string
 *                           example: "https://example.com/avatar.jpg"
 *                         role:
 *                           type: string
 *                           example: "ADOPTER"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T11:30:00.000Z"
 *                     lastActivityAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:30:00.000Z"
 *                     upvoteCount:
 *                       type: integer
 *                       example: 5
 *                     downvoteCount:
 *                       type: integer
 *                       example: 1
 *                     commentCount:
 *                       type: integer
 *                       example: 3
 *                     viewCount:
 *                       type: integer
 *                       example: 42
 *                     isPinned:
 *                       type: boolean
 *                       example: false
 *                     userVote:
 *                       type: string
 *                       enum: [upvote, downvote, null]
 *                       example: "upvote"
 *                     isBookmarked:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     tags:
 *       - Forum
 *     summary: Update a forum post
 *     description: Updates an existing forum post
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated post title
 *                 example: "How to effectively train a puppy to sit"
 *               content:
 *                 type: string
 *                 description: Updated post content
 *                 example: "I've been trying to train my new puppy to sit. After some research, I'm looking for specific techniques that work well with energetic breeds."
 *               category:
 *                 type: string
 *                 enum: [NUTRITION, TRAINING, HEALTH, BEHAVIOR, GROOMING, ADOPTION, BREEDS, EMERGENCY, GENERAL]
 *                 description: Updated post category
 *                 example: "TRAINING"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated tags related to the post
 *                 example: ["puppy", "training", "commands", "positive reinforcement"]
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated URLs to attached images or files
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Post updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     title:
 *                       type: string
 *                       example: "How to effectively train a puppy to sit"
 *                     content:
 *                       type: string
 *                       example: "I've been trying to train my new puppy to sit. After some research, I'm looking for specific techniques that work well with energetic breeds."
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not the author of the post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     tags:
 *       - Forum
 *     summary: Delete a forum post
 *     description: Soft deletes a forum post
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not the author of the post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/posts/{postId}/vote:
 *   post:
 *     tags:
 *       - Forum
 *     summary: Vote on a forum post
 *     description: Upvote or downvote a forum post
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voteType
 *             properties:
 *               voteType:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: Type of vote
 *                 example: "upvote"
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Post upvoted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     upvoteCount:
 *                       type: integer
 *                       example: 6
 *                     downvoteCount:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad request - Invalid vote type
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/posts/{postId}/bookmark:
 *   post:
 *     tags:
 *       - Forum
 *     summary: Bookmark or unbookmark a post
 *     description: Toggles bookmark status for a forum post
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to bookmark/unbookmark
 *     responses:
 *       200:
 *         description: Bookmark status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Post bookmarked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isBookmarked:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/bookmarks:
 *   get:
 *     tags:
 *       - Forum
 *     summary: Get bookmarked posts
 *     description: Retrieves a list of posts bookmarked by the user
 *     security:
 *       - cookieAuth: []
 *     parameters:
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
 *         description: Bookmarked posts retrieved successfully
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
 *                       bookmarkedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-16T09:30:00.000Z"
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
