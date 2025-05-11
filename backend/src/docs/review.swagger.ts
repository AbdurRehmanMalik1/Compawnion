/**
 * @swagger
 * /api/appointments/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Submit a review
 *     description: Submit a review for a veterinarian after a completed appointment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - rating
 *               - comment
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 description: ID of the completed appointment
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5 stars
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       200:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review submitted successfully
 *                 review:
 *                   type: object
 *                   properties:
 *                     appointmentId:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid input or appointment not completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not your appointment
 *       404:
 *         description: Appointment or veterinarian not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/veterinarians/{vetId}/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get veterinarian reviews
 *     description: Retrieve all reviews for a specific veterinarian with pagination
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the veterinarian
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
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Veterinarian reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Veterinarian reviews retrieved successfully
 *                 veterinarian:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     averageRating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *                     totalReviews:
 *                       type: integer
 *                       example: 27
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Veterinarian not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/veterinarians/{vetId}/reviews/{reviewId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get review details
 *     description: Retrieve details of a specific review
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the veterinarian
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review retrieved successfully
 *                 review:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     appointment:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         date:
 *                           type: string
 *                           format: date-time
 *                         reason:
 *                           type: string
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Veterinarian or review not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/veterinarians/{vetId}/reviews/{reviewId}:
 *   delete:
 *     tags:
 *       - Reviews
 *     summary: Delete a review
 *     description: Delete a review (only for the user who created it)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the veterinarian
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Veterinarian or review not found
 *       403:
 *         description: Forbidden - You can only delete your own reviews
 *       500:
 *         description: Server error
 */
