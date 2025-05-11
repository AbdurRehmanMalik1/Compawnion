import { Router } from "express";
import { forumActivityController } from "../controllers/forum/activity.controller";
import { forumCategoryController } from "../controllers/forum/category.controller";
import { forumCommentController } from "../controllers/forum/comment.controller";
import { forumPostController } from "../controllers/forum/post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { forumValidator } from "../validators/forum.validator";

const router = Router();

// Post routes
router.post(
  "/posts",
  authMiddleware,
  forumValidator.createPostValidator,
  forumPostController.createPost
);

router.get(
  "/posts",
  forumValidator.getPostsValidator,
  forumPostController.getPosts
);

router.get(
  "/posts/:postId",
  forumValidator.getPostByIdValidator,
  forumPostController.getPostById
);

router.put(
  "/posts/:postId",
  authMiddleware,
  forumValidator.updatePostValidator,
  forumPostController.updatePost
);

router.delete(
  "/posts/:postId",
  authMiddleware,
  forumValidator.deletePostValidator,
  forumPostController.deletePost
);

router.post(
  "/posts/:postId/vote",
  authMiddleware,
  forumValidator.votePostValidator,
  forumPostController.votePost
);

router.post(
  "/posts/:postId/bookmark",
  authMiddleware,
  forumValidator.bookmarkPostValidator,
  forumPostController.bookmarkPost
);

router.get(
  "/bookmarks",
  authMiddleware,
  forumPostController.getBookmarkedPosts
);

// Comment routes
router.get(
  "/posts/:postId/comments",
  forumValidator.getCommentsValidator,
  forumCommentController.getComments
);

router.post(
  "/posts/:postId/comments",
  authMiddleware,
  forumValidator.createCommentValidator,
  forumCommentController.createComment
);

router.get(
  "/comments/:commentId/replies",
  forumValidator.getRepliesValidator,
  forumCommentController.getReplies
);

router.put(
  "/comments/:commentId",
  authMiddleware,
  forumValidator.updateCommentValidator,
  forumCommentController.updateComment
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  forumValidator.deleteCommentValidator,
  forumCommentController.deleteComment
);

router.post(
  "/comments/:commentId/vote",
  authMiddleware,
  forumValidator.voteCommentValidator,
  forumCommentController.voteComment
);

// Category routes
router.get("/categories", forumCategoryController.getCategories);

router.get(
  "/categories/:category",
  forumValidator.getCategoryValidator,
  forumCategoryController.getPostsByCategory
);

router.get("/stats", forumCategoryController.getForumStats);

// User activity routes
router.get(
  "/activity",
  authMiddleware,
  forumActivityController.getUserActivity
);

router.get(
  "/users/:userId/posts",
  forumValidator.getUserPostsValidator,
  forumActivityController.getUserPosts
);

router.get(
  "/users/:userId/comments",
  forumValidator.getUserCommentsValidator,
  forumActivityController.getUserComments
);

router.get(
  "/contributors",
  forumValidator.getTopContributorsValidator,
  forumActivityController.getTopContributors
);

export default router;
