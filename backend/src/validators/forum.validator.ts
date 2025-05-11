import { body, param, query } from "express-validator";
import { ForumCategory } from "../models/forum/forum.model";
import { validateRequest } from "./validateRequest";

// Post validators
const createPostValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(Object.values(ForumCategory))
    .withMessage("Invalid category"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Each tag must be between 2 and 20 characters"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  body("attachments.*")
    .optional()
    .isURL()
    .withMessage("Each attachment must be a valid URL"),
  validateRequest,
];

const updatePostValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
  body("category")
    .optional()
    .trim()
    .isIn(Object.values(ForumCategory))
    .withMessage("Invalid category"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Each tag must be between 2 and 20 characters"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  body("attachments.*")
    .optional()
    .isURL()
    .withMessage("Each attachment must be a valid URL"),
  validateRequest,
];

const getPostsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("category")
    .optional()
    .isIn(Object.values(ForumCategory))
    .withMessage("Invalid category"),
  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "lastActivityAt",
      "upvoteCount",
      "viewCount",
      "commentCount",
    ])
    .withMessage("Invalid sort field"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'"),
  validateRequest,
];

const getPostByIdValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  validateRequest,
];

const deletePostValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  validateRequest,
];

const votePostValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  body("voteType")
    .isIn(["upvote", "downvote"])
    .withMessage("Vote type must be 'upvote' or 'downvote'"),
  validateRequest,
];

const bookmarkPostValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  validateRequest,
];

// Comment validators
const createCommentValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 2 })
    .withMessage("Content must be at least 2 characters"),
  body("parentCommentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent comment ID"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  body("attachments.*")
    .optional()
    .isURL()
    .withMessage("Each attachment must be a valid URL"),
  validateRequest,
];

const getCommentsValidator = [
  param("postId").isMongoId().withMessage("Invalid post ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sort")
    .optional()
    .isIn(["newest", "oldest", "votes"])
    .withMessage("Sort must be 'newest', 'oldest', or 'votes'"),
  validateRequest,
];

const getRepliesValidator = [
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  validateRequest,
];

const updateCommentValidator = [
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 2 })
    .withMessage("Content must be at least 2 characters"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  body("attachments.*")
    .optional()
    .isURL()
    .withMessage("Each attachment must be a valid URL"),
  validateRequest,
];

const deleteCommentValidator = [
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  validateRequest,
];

const voteCommentValidator = [
  param("commentId").isMongoId().withMessage("Invalid comment ID"),
  body("voteType")
    .isIn(["upvote", "downvote"])
    .withMessage("Vote type must be 'upvote' or 'downvote'"),
  validateRequest,
];

// Category validators
const getCategoryValidator = [
  param("category")
    .isIn(Object.values(ForumCategory))
    .withMessage("Invalid category"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "lastActivityAt",
      "upvoteCount",
      "viewCount",
      "commentCount",
    ])
    .withMessage("Invalid sort field"),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'"),
  validateRequest,
];

// User activity validators
const getUserPostsValidator = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  validateRequest,
];

const getUserCommentsValidator = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
  validateRequest,
];

const getTopContributorsValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  validateRequest,
];

export const forumValidator = {
  createPostValidator,
  updatePostValidator,
  getPostsValidator,
  getPostByIdValidator,
  deletePostValidator,
  votePostValidator,
  bookmarkPostValidator,
  createCommentValidator,
  getCommentsValidator,
  getRepliesValidator,
  updateCommentValidator,
  deleteCommentValidator,
  voteCommentValidator,
  getCategoryValidator,
  getUserPostsValidator,
  getUserCommentsValidator,
  getTopContributorsValidator,
};
