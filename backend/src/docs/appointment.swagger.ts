/**
 * @swagger
 * /api/appointments/veterinarians:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get all veterinarians
 *     description: Retrieve a list of all veterinarians with optional filtering and pagination
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
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for veterinarian name, clinic name, or bio
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter by veterinarian specialization
 *     responses:
 *       200:
 *         description: List of veterinarians retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Veterinarians retrieved successfully
 *                 veterinarians:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [VETERINARIAN]
 *                       roleData:
 *                         type: object
 *                         properties:
 *                           clinicName:
 *                             type: string
 *                           specialization:
 *                             type: array
 *                             items:
 *                               type: string
 *                           qualifications:
 *                             type: array
 *                             items:
 *                               type: string
 *                           experience:
 *                             type: number
 *                           averageRating:
 *                             type: number
 *                           totalReviews:
 *                             type: number
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     pages:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/veterinarians/{vetId}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get veterinarian details
 *     description: Retrieve detailed information about a specific veterinarian
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the veterinarian
 *     responses:
 *       200:
 *         description: Veterinarian details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Veterinarian details retrieved successfully
 *                 veterinarian:
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
 *                     role:
 *                       type: string
 *                       enum: [VETERINARIAN]
 *                     roleData:
 *                       type: object
 *                       properties:
 *                         clinicName:
 *                           type: string
 *                         specialization:
 *                           type: array
 *                           items:
 *                             type: string
 *                         qualifications:
 *                           type: array
 *                           items:
 *                             type: string
 *                         experience:
 *                           type: number
 *                         address:
 *                           type: string
 *                         location:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                               enum: [Point]
 *                             coordinates:
 *                               type: array
 *                               items:
 *                                 type: number
 *                         phone:
 *                           type: string
 *                         bio:
 *                           type: string
 *                         consultationFee:
 *                           type: number
 *                         availability:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               day:
 *                                 type: string
 *                                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *                               startTime:
 *                                 type: string
 *                                 example: "09:00"
 *                               endTime:
 *                                 type: string
 *                                 example: "17:00"
 *                               isAvailable:
 *                                 type: boolean
 *                         averageRating:
 *                           type: number
 *                         totalReviews:
 *                           type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Veterinarian not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/veterinarians/{vetId}/availability:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get veterinarian availability
 *     description: Retrieve available time slots for a veterinarian on a specific date
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
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Available slots retrieved successfully
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2023-07-15"
 *                 dayOfWeek:
 *                   type: string
 *                   enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *                 availableSlots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       startTime:
 *                         type: string
 *                         example: "09:00"
 *                       endTime:
 *                         type: string
 *                         example: "09:30"
 *       400:
 *         description: Bad request - Invalid date format or missing date
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Veterinarian not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/appointments:
 *   post:
 *     tags:
 *       - Appointments
 *     summary: Book an appointment
 *     description: Book an appointment with a veterinarian
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vetId
 *               - date
 *               - startTime
 *               - endTime
 *               - reason
 *             properties:
 *               vetId:
 *                 type: string
 *                 description: ID of the veterinarian
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the appointment (YYYY-MM-DD)
 *               startTime:
 *                 type: string
 *                 description: Start time of the appointment (HH:MM)
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 description: End time of the appointment (HH:MM)
 *                 example: "09:30"
 *               reason:
 *                 type: string
 *                 description: Reason for the appointment
 *               petId:
 *                 type: string
 *                 description: ID of the pet (optional)
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment booked successfully
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     veterinarianId:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, scheduled, completed, cancelled]
 *                     reason:
 *                       type: string
 *                     petId:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid input or time slot already booked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Veterinarian not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/user/appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get user appointments
 *     description: Retrieve all appointments for the current user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, scheduled, completed, cancelled]
 *         description: Filter by appointment status
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         description: Filter for upcoming appointments only
 *     responses:
 *       200:
 *         description: User appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User appointments retrieved successfully
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       veterinarianId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           roleData:
 *                             type: object
 *                             properties:
 *                               clinicName:
 *                                 type: string
 *                               specialization:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                       petId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           species:
 *                             type: string
 *                           breed:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, scheduled, completed, cancelled]
 *                       reason:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/vet/appointments:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get veterinarian appointments
 *     description: Retrieve all appointments for the current veterinarian
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, scheduled, completed, cancelled]
 *         description: Filter by appointment status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Veterinarian appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Veterinarian appointments retrieved successfully
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       veterinarianId:
 *                         type: string
 *                       petId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           species:
 *                             type: string
 *                           breed:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       startTime:
 *                         type: string
 *                       endTime:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, scheduled, completed, cancelled]
 *                       reason:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a veterinarian
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/appointments/{appointmentId}:
 *   get:
 *     tags:
 *       - Appointments
 *     summary: Get appointment details
 *     description: Retrieve details of a specific appointment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment retrieved successfully
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     veterinarianId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                         roleData:
 *                           type: object
 *                           properties:
 *                             clinicName:
 *                               type: string
 *                             specialization:
 *                               type: array
 *                               items:
 *                                 type: string
 *                     petId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         species:
 *                           type: string
 *                         breed:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, scheduled, completed, cancelled]
 *                     reason:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User doesn't have permission to view this appointment
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/appointments/{appointmentId}/status:
 *   patch:
 *     tags:
 *       - Appointments
 *     summary: Update appointment status
 *     description: Update the status of an appointment (for veterinarians)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, scheduled, completed, cancelled]
 *                 description: New status for the appointment
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment status updated successfully
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     veterinarianId:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, scheduled, completed, cancelled]
 *                     reason:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User can only update their own appointments
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/appointments/{appointmentId}/cancel:
 *   patch:
 *     tags:
 *       - Appointments
 *     summary: Cancel appointment
 *     description: Cancel an appointment (for users)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment cancelled successfully
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     veterinarianId:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [cancelled]
 *                     reason:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Cannot cancel a completed appointment
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User can only cancel their own appointments
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
