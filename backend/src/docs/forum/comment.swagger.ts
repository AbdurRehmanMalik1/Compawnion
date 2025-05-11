/**
 * @swagger
 * /api/forum/posts/{postId}/comments:
 *   get:
 *     tags:
 *       - Forum Comments
 *     summary: Get comments for a post
 *     description: Retrieves a paginated list of top-level comments for a specific post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to get comments for
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
 *           maximum: 100
 *           default: 20
 *         description: Number of comments per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, votes]
 *           default: newest
 *         description: Sort order for comments
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
 *                       postId:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       content:
 *                         type: string
 *                         example: "Try using treats as a reward when your puppy sits correctly. Be consistent with your commands."
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c88"
 *                           name:
 *                             type: string
 *                             example: "Jane Smith"
 *                           avatar:
 *                             type: string
 *                             example: "https://example.com/avatar2.jpg"
 *                           role:
 *                             type: string
 *                             example: "VETERINARIAN"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T11:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T11:30:00.000Z"
 *                       upvoteCount:
 *                         type: integer
 *                         example: 3
 *                       downvoteCount:
 *                         type: integer
 *                         example: 0
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: []
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 8
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 *
 *   post:
 *     tags:
 *       - Forum Comments
 *     summary: Create a comment
 *     description: Adds a new comment to a forum post
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: "Try using treats as a reward when your puppy sits correctly. Be consistent with your commands."
 *               parentCommentId:
 *                 type: string
 *                 description: ID of the parent comment if this is a reply
 *                 example: "60d21b4667d0d8992e610c87"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs to attached images or files
 *                 example: ["https://example.com/training-guide.jpg"]
 *     responses:
 *       201:
 *         description: Comment created successfully
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
 *                   example: "Comment created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c89"
 *                     postId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     content:
 *                       type: string
 *                       example: "Try using treats as a reward when your puppy sits correctly. Be consistent with your commands."
 *                     userId:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c86"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T12:00:00.000Z"
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/training-guide.jpg"]
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/comments/{commentId}/replies:
 *   get:
 *     tags:
 *       - Forum Comments
 *     summary: Get replies to a comment
 *     description: Retrieves a paginated list of replies to a specific comment
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to get replies for
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
 *           maximum: 100
 *           default: 20
 *         description: Number of replies per page
 *     responses:
 *       200:
 *         description: Replies retrieved successfully
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
 *                         example: "60d21b4667d0d8992e610c90"
 *                       postId:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       parentCommentId:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c87"
 *                       content:
 *                         type: string
 *                         example: "That's great advice! I'd also add that clicker training can be very effective."
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c91"
 *                           name:
 *                             type: string
 *                             example: "Alex Johnson"
 *                           avatar:
 *                             type: string
 *                             example: "https://example.com/avatar3.jpg"
 *                           role:
 *                             type: string
 *                             example: "ADOPTER"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T13:15:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T13:15:00.000Z"
 *                       upvoteCount:
 *                         type: integer
 *                         example: 1
 *                       downvoteCount:
 *                         type: integer
 *                         example: 0
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/comments/{commentId}:
 *   put:
 *     tags:
 *       - Forum Comments
 *     summary: Update a comment
 *     description: Updates the content of an existing comment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated comment content
 *                 example: "Try using treats as a reward when your puppy sits correctly. Be consistent with your commands and practice daily for best results."
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated URLs to attached images or files
 *                 example: ["https://example.com/training-guide.jpg", "https://example.com/puppy-training.jpg"]
 *     responses:
 *       200:
 *         description: Comment updated successfully
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
 *                   example: "Comment updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c87"
 *                     content:
 *                       type: string
 *                       example: "Try using treats as a reward when your puppy sits correctly. Be consistent with your commands and practice daily for best results."
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/training-guide.jpg", "https://example.com/puppy-training.jpg"]
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T14:00:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not the author of the comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     tags:
 *       - Forum Comments
 *     summary: Delete a comment
 *     description: Soft deletes a comment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: "Comment deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not the author of the comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/forum/comments/{commentId}/vote:
 *   post:
 *     tags:
 *       - Forum Comments
 *     summary: Vote on a comment
 *     description: Upvote or downvote a comment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to vote on
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
 *                   example: "Comment upvoted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     upvoteCount:
 *                       type: integer
 *                       example: 4
 *                     downvoteCount:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Bad request - Invalid vote type
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
