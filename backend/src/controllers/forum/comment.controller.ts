import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import {
  ForumCommentModel,
  ForumPostModel,
} from "../../models/forum/forum.model";
import ForumUserActivityModel from "../../models/forum/user-activity.model";
import { UserModelI } from "../../models/user/user.model";
import HttpExceptions from "../../utility/exceptions/HttpExceptions";
import withTransaction from "../../middlewares/transactionWrapper";

// Get comments for a post
const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { page = 1, limit = 20, sort = "newest" } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Check if post exists
  const postExists = await ForumPostModel.exists({
    _id: postId,
    isDeleted: false,
  });

  if (!postExists) {
    throw HttpExceptions.NotFound("Post not found");
  }

  // Determine sort order
  let sortOptions: any = {};
  switch (sort) {
    case "oldest":
      sortOptions = { createdAt: 1 };
      break;
    case "votes":
      sortOptions = { upvoteCount: -1, createdAt: -1 };
      break;
    case "newest":
    default:
      sortOptions = { createdAt: -1 };
  }

  // Get top-level comments (no parentCommentId)
  const comments = await ForumCommentModel.find({
    postId,
    parentCommentId: { $exists: false },
    isDeleted: false,
  })
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .lean();

  // Get total count for pagination
  const total = await ForumCommentModel.countDocuments({
    postId,
    parentCommentId: { $exists: false },
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    data: comments,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  });
};

// Get replies for a comment
const getReplies = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Check if parent comment exists
  const commentExists = await ForumCommentModel.exists({
    _id: commentId,
    isDeleted: false,
  });

  if (!commentExists) {
    throw HttpExceptions.NotFound("Comment not found");
  }

  // Get replies
  const replies = await ForumCommentModel.find({
    parentCommentId: commentId,
    isDeleted: false,
  })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .lean();

  // Get total count for pagination
  const total = await ForumCommentModel.countDocuments({
    parentCommentId: commentId,
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    data: replies,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  });
};

// Create a comment
const createComment = withTransaction(
  async (req: Request, res: Response, session: ClientSession) => {
    const { postId } = req.params;
    const { content, attachments, parentCommentId } = req.body;
    const user = req.user as UserModelI;

    // Check if post exists
    const post = await ForumPostModel.findOne({
      _id: postId,
      isDeleted: false,
    }).session(session);

    if (!post) {
      throw HttpExceptions.NotFound("Post not found");
    }

    // If this is a reply, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await ForumCommentModel.findOne({
        _id: parentCommentId,
        isDeleted: false,
      }).session(session);

      if (!parentComment) {
        throw HttpExceptions.NotFound("Parent comment not found");
      }
    }

    // Create comment
    const comment = await ForumCommentModel.create(
      [
        {
          postId,
          userId: user._id,
          content,
          attachments: attachments || [],
          parentCommentId: parentCommentId || undefined,
        },
      ],
      { session }
    );

    // Update post with comment count and last activity
    await ForumPostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { commentCount: 1 },
        $set: { lastActivityAt: new Date() },
      },
      { session }
    );

    // Update user activity
    await ForumUserActivityModel.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: { commentsCreated: 1 },
        $set: { lastCommentAt: new Date() },
      },
      { upsert: true, session }
    );

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment[0],
    });
  }
);

// Update a comment
const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content, attachments } = req.body;
  const user = req.user as UserModelI;

  const comment = await ForumCommentModel.findOne({
    _id: commentId,
    isDeleted: false,
  });

  if (!comment) {
    throw HttpExceptions.NotFound("Comment not found");
  }

  // Check if user is the author of the comment
  if (comment.userId.toString() !== user._id.toString()) {
    throw HttpExceptions.Forbidden(
      "You are not authorized to update this comment"
    );
  }

  // Update comment
  comment.content = content || comment.content;
  comment.attachments = attachments || comment.attachments;
  comment.updatedAt = new Date();

  await comment.save();

  // Update post's last activity time
  await ForumPostModel.findByIdAndUpdate(comment.postId, {
    lastActivityAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: comment,
  });
};

// Delete a comment (soft delete)
const deleteComment = withTransaction(
  async (req: Request, res: Response, session: ClientSession) => {
    const { commentId } = req.params;
    const user = req.user as UserModelI;

    const comment = await ForumCommentModel.findOne({
      _id: commentId,
      isDeleted: false,
    }).session(session);

    if (!comment) {
      throw HttpExceptions.NotFound("Comment not found");
    }

    // Check if user is the author of the comment
    if (comment.userId.toString() !== user._id.toString()) {
      throw HttpExceptions.Forbidden(
        "You are not authorized to delete this comment"
      );
    }

    // Soft delete
    comment.isDeleted = true;
    await comment.save({ session });

    // If this is a top-level comment, decrement post's comment count
    if (!comment.parentCommentId) {
      await ForumPostModel.findByIdAndUpdate(
        comment.postId,
        {
          $inc: { commentCount: -1 },
        },
        { session }
      );
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }
);

// Vote on a comment
const voteComment = withTransaction(
  async (req: Request, res: Response, session: ClientSession) => {
    const { commentId } = req.params;
    const { voteType } = req.body; // "upvote" or "downvote"
    const user = req.user as UserModelI;

    if (!["upvote", "downvote"].includes(voteType)) {
      throw HttpExceptions.BadRequest("Invalid vote type");
    }

    const comment = await ForumCommentModel.findOne({
      _id: commentId,
      isDeleted: false,
    }).session(session);

    if (!comment) {
      throw HttpExceptions.NotFound("Comment not found");
    }

    // Check if user has already voted
    const existingVoteIndex = comment.votes.findIndex(
      (vote) => vote.userId.toString() === user._id.toString()
    );

    // Update vote counts and user activity based on vote action
    const commentAuthorActivity = await ForumUserActivityModel.findOne({
      userId: comment.userId,
    }).session(session);

    if (existingVoteIndex !== -1) {
      const existingVote = comment.votes[existingVoteIndex];

      // If same vote type, remove the vote (toggle)
      if (existingVote.type === voteType) {
        // Remove vote
        comment.votes.splice(existingVoteIndex, 1);

        // Update vote counts
        if (voteType === "upvote") {
          comment.upvoteCount -= 1;
          if (commentAuthorActivity) {
            commentAuthorActivity.upvotesReceived -= 1;
            commentAuthorActivity.reputationScore -= 1;
          }
        } else {
          comment.downvoteCount -= 1;
          if (commentAuthorActivity) {
            commentAuthorActivity.downvotesReceived -= 1;
            commentAuthorActivity.reputationScore += 1;
          }
        }

        // Update user activity for voter
        await ForumUserActivityModel.findOneAndUpdate(
          { userId: user._id },
          {
            $inc: {
              [`${voteType}sGiven`]: -1,
            },
          },
          { session, upsert: true }
        );
      } else {
        // Change vote type
        existingVote.type = voteType;
        existingVote.createdAt = new Date();

        // Update vote counts
        if (voteType === "upvote") {
          comment.upvoteCount += 1;
          comment.downvoteCount -= 1;
          if (commentAuthorActivity) {
            commentAuthorActivity.upvotesReceived += 1;
            commentAuthorActivity.downvotesReceived -= 1;
            commentAuthorActivity.reputationScore += 2;
          }
        } else {
          comment.upvoteCount -= 1;
          comment.downvoteCount += 1;
          if (commentAuthorActivity) {
            commentAuthorActivity.upvotesReceived -= 1;
            commentAuthorActivity.downvotesReceived += 1;
            commentAuthorActivity.reputationScore -= 2;
          }
        }

        // Update user activity for voter
        await ForumUserActivityModel.findOneAndUpdate(
          { userId: user._id },
          {
            $inc: {
              [`${voteType}sGiven`]: 1,
              [`${voteType === "upvote" ? "downvote" : "upvote"}sGiven`]: -1,
            },
            $set: { lastVoteAt: new Date() },
          },
          { session, upsert: true }
        );
      }
    } else {
      // Add new vote
      comment.votes.push({
        userId: user._id as any,
        type: voteType,
        createdAt: new Date(),
      });

      // Update vote counts
      if (voteType === "upvote") {
        comment.upvoteCount += 1;
        if (commentAuthorActivity) {
          commentAuthorActivity.upvotesReceived += 1;
          commentAuthorActivity.reputationScore += 1;
        }
      } else {
        comment.downvoteCount += 1;
        if (commentAuthorActivity) {
          commentAuthorActivity.downvotesReceived += 1;
          commentAuthorActivity.reputationScore -= 1;
        }
      }

      // Update user activity for voter
      await ForumUserActivityModel.findOneAndUpdate(
        { userId: user._id },
        {
          $inc: { [`${voteType}sGiven`]: 1 },
          $set: { lastVoteAt: new Date() },
        },
        { session, upsert: true }
      );
    }

    // Save changes
    if (commentAuthorActivity) {
      await commentAuthorActivity.save({ session });
    }

    await comment.save({ session });

    res.status(200).json({
      success: true,
      message: `Comment ${voteType}d successfully`,
      data: {
        upvoteCount: comment.upvoteCount,
        downvoteCount: comment.downvoteCount,
      },
    });
  }
);

export const forumCommentController = {
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
  voteComment,
};
