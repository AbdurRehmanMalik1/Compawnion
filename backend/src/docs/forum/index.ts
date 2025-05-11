// Import all forum swagger documentation files
import "./post.swagger";
import "./comment.swagger";
import "./category.swagger";
import "./activity.swagger";

/**
 * @swagger
 * tags:
 *   - name: Forum
 *     description: Forum post management
 *   - name: Forum Comments
 *     description: Forum comment operations
 *   - name: Forum Categories
 *     description: Forum category operations
 *   - name: Forum Activity
 *     description: User activity in the forum
 *
 * components:
 *   schemas:
 *     ForumPost:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the post
 *         title:
 *           type: string
 *           description: Post title
 *         content:
 *           type: string
 *           description: Post content
 *         category:
 *           type: string
 *           enum: [NUTRITION, TRAINING, HEALTH, BEHAVIOR, GROOMING, ADOPTION, BREEDS, EMERGENCY, GENERAL]
 *           description: Post category
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags related to the post
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             avatar:
 *               type: string
 *             role:
 *               type: string
 *           description: User who created the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the post was last updated
 *         lastActivityAt:
 *           type: string
 *           format: date-time
 *           description: Date and time of the last activity on the post
 *         upvoteCount:
 *           type: integer
 *           description: Number of upvotes
 *         downvoteCount:
 *           type: integer
 *           description: Number of downvotes
 *         commentCount:
 *           type: integer
 *           description: Number of comments
 *         viewCount:
 *           type: integer
 *           description: Number of views
 *         isPinned:
 *           type: boolean
 *           description: Whether the post is pinned
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to attached images or files
 *         isDeleted:
 *           type: boolean
 *           description: Whether the post has been deleted
 *       required:
 *         - title
 *         - content
 *         - category
 *         - userId
 *
 *     ForumComment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the comment
 *         postId:
 *           type: string
 *           description: ID of the post this comment belongs to
 *         parentCommentId:
 *           type: string
 *           description: ID of the parent comment if this is a reply
 *         content:
 *           type: string
 *           description: Comment content
 *         userId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             avatar:
 *               type: string
 *             role:
 *               type: string
 *           description: User who created the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the comment was last updated
 *         upvoteCount:
 *           type: integer
 *           description: Number of upvotes
 *         downvoteCount:
 *           type: integer
 *           description: Number of downvotes
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to attached images or files
 *         isDeleted:
 *           type: boolean
 *           description: Whether the comment has been deleted
 *       required:
 *         - postId
 *         - content
 *         - userId
 *
 *     ForumCategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           enum: [NUTRITION, TRAINING, HEALTH, BEHAVIOR, GROOMING, ADOPTION, BREEDS, EMERGENCY, GENERAL]
 *           description: Category name
 *         displayName:
 *           type: string
 *           description: Human-readable category name
 *         description:
 *           type: string
 *           description: Category description
 *         count:
 *           type: integer
 *           description: Number of posts in this category
 *       required:
 *         - name
 *         - displayName
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of items
 *         page:
 *           type: integer
 *           description: Current page number
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *         pages:
 *           type: integer
 *           description: Total number of pages
 *
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 */
