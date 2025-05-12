/**
 * @swagger
 * /api/messages/conversations:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Start a new conversation with initial message
 *     description: Create a new conversation between an adopter and a shelter with an initial message
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID of the recipient user
 *                 example: "507f1f77bcf86cd799439011"
 *               content:
 *                 type: string
 *                 description: Text content of the message
 *                 example: "Hello, I'm interested in adopting one of your pets"
 *               attachment:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     format: uri
 *                     description: URL of the attachment
 *                     example: "https://example.com/image.jpg"
 *                   type:
 *                     type: string
 *                     enum: [image, document, video]
 *                     description: Type of the attachment
 *                     example: "image"
 *                   name:
 *                     type: string
 *                     description: Name of the attachment file
 *                     example: "pet_photo.jpg"
 *                   size:
 *                     type: number
 *                     description: Size of the attachment in bytes
 *                     example: 1024000
 *     responses:
 *       201:
 *         description: Conversation started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conversation started with initial message"
 *                 conversation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                     adopterId:
 *                       type: string
 *                     shelterId:
 *                       type: string
 *                     lastMessage:
 *                       type: string
 *                     lastMessageDate:
 *                       type: string
 *                       format: date-time
 *                     unreadCount:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                 initialMessage:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     conversationId:
 *                       type: string
 *                     sender:
 *                       type: string
 *                     receiver:
 *                       type: string
 *                     content:
 *                       type: string
 *                     attachment:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                         type:
 *                           type: string
 *                         name:
 *                           type: string
 *                         size:
 *                           type: number
 *                     isRead:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get all conversations for the current user
 *     description: Retrieve all conversations where the current user is a participant
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of items per page (max 50)
 *         example: 20
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conversations retrieved successfully"
 *                 conversations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       adopterId:
 *                         type: string
 *                       shelterId:
 *                         type: string
 *                       lastMessage:
 *                         type: string
 *                       lastMessageDate:
 *                         type: string
 *                         format: date-time
 *                       unreadCount:
 *                         type: number
 *                       otherParticipant:
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
 *                           role:
 *                             type: string
 *                           roleData:
 *                             type: object
 */

/**
 * @swagger
 * /api/messages/conversations/{conversationId}:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get a specific conversation by ID
 *     description: Retrieve a specific conversation and its initial messages
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to retrieve
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conversation retrieved successfully"
 *                 conversation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     adopterId:
 *                       type: string
 *                     shelterId:
 *                       type: string
 *                     lastMessage:
 *                       type: string
 *                     lastMessageDate:
 *                       type: string
 *                       format: date-time
 *                     otherParticipant:
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
 *                         role:
 *                           type: string
 *                         roleData:
 *                           type: object
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       conversationId:
 *                         type: string
 *                       sender:
 *                         type: string
 *                       receiver:
 *                         type: string
 *                       content:
 *                         type: string
 *                       attachment:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           type:
 *                             type: string
 *                           name:
 *                             type: string
 *                           size:
 *                             type: number
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/messages/conversations/{conversationId}/messages:
 *   get:
 *     tags:
 *       - Messages
 *     summary: Get messages for a specific conversation
 *     description: Retrieve messages for a conversation with pagination
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Message ID to get messages before (for pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of messages to retrieve
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Messages retrieved successfully"
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       conversationId:
 *                         type: string
 *                       sender:
 *                         type: string
 *                       receiver:
 *                         type: string
 *                       content:
 *                         type: string
 *                       attachment:
 *                         type: object
 *                         properties:
 *                           url:
 *                             type: string
 *                           type:
 *                             type: string
 *                           name:
 *                             type: string
 *                           size:
 *                             type: number
 *                       isRead:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 hasMore:
 *                   type: boolean
 *                   description: Indicates if there are more messages to load
 *                 nextCursor:
 *                   type: string
 *                   description: ID of the oldest message in the current batch
 */

/**
 * @swagger
 * /api/messages/conversations/{conversationId}/read:
 *   patch:
 *     tags:
 *       - Messages
 *     summary: Mark messages as read
 *     description: Mark all unread messages in a conversation as read
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation
 *     responses:
 *       200:
 *         description: Messages marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Messages marked as read"
 */

/**
 * @swagger
 * /api/messages/messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send a message in an existing conversation
 *     description: Send a new message in an existing conversation between an adopter and a shelter
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: ID of the conversation
 *                 example: "507f1f77bcf86cd799439011"
 *               content:
 *                 type: string
 *                 description: Text content of the message
 *                 example: "Could you tell me more about the pet's personality?"
 *               attachment:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     format: uri
 *                     description: URL of the attachment
 *                     example: "https://example.com/image.jpg"
 *                   type:
 *                     type: string
 *                     enum: [image, document, video]
 *                     description: Type of the attachment
 *                     example: "image"
 *                   name:
 *                     type: string
 *                     description: Name of the attachment file
 *                     example: "pet_photo.jpg"
 *                   size:
 *                     type: number
 *                     description: Size of the attachment in bytes
 *                     example: 1024000
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *                 newMessage:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     conversationId:
 *                       type: string
 *                     sender:
 *                       type: string
 *                     receiver:
 *                       type: string
 *                     content:
 *                       type: string
 *                     attachment:
 *                       type: object
 *                       properties:
 *                         url:
 *                           type: string
 *                         type:
 *                           type: string
 *                         name:
 *                           type: string
 *                         size:
 *                           type: number
 *                     isRead:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */

/**
 * @swagger
 * /api/messages/messages/{messageId}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Delete a message
 *     description: Delete a specific message (only if you are the sender)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message deleted successfully"
 */

/**
 * @swagger
 * /api/messages/conversations/{conversationId}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Delete a conversation
 *     description: Delete a conversation and all its messages
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to delete
 *     responses:
 *       200:
 *         description: Conversation and all messages deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conversation and all messages deleted successfully"
 */
