import { Request, Response } from "express";
import {
  ForumCommentModel,
  ForumPostModel,
} from "../../models/forum/forum.model";
import ForumUserActivityModel from "../../models/forum/user-activity.model";
import ForumUserInteractionModel from "../../models/forum/user-interaction.model";
import { UserModelI } from "../../models/user/user.model";
import HttpExceptions from "../../utility/exceptions/HttpExceptions";

// Get user's forum activity
const getUserActivity = async (req: Request, res: Response) => {
  const user = req.user as UserModelI;

  // Get or create user activity record
  let userActivity = await ForumUserActivityModel.findOne({ userId: user._id });

  if (!userActivity) {
    userActivity = await ForumUserActivityModel.create({
      userId: user._id,
    });
  }

  // Get recent posts by user
  const recentPosts = await ForumPostModel.find({
    userId: user._id,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title category createdAt upvoteCount commentCount")
    .lean();

  // Get recent comments by user
  const recentComments = await ForumCommentModel.find({
    userId: user._id,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("content postId createdAt upvoteCount")
    .populate({
      path: "postId",
      select: "title",
    })
    .lean();

  // Get bookmarked posts
  const bookmarkedPosts = await ForumUserInteractionModel.find({
    userId: user._id,
    isBookmarked: true,
  })
    .limit(5)
    .populate({
      path: "postId",
      select: "title category createdAt",
      match: { isDeleted: false },
    })
    .lean();

  // Filter out any null postId (in case post was deleted)
  const validBookmarks = bookmarkedPosts.filter(
    (bookmark) => bookmark.postId !== null
  );

  res.status(200).json({
    success: true,
    data: {
      activity: userActivity,
      recentPosts,
      recentComments,
      bookmarkedPosts: validBookmarks.map((bookmark) => bookmark.postId),
    },
  });
};

// Get user's posts
const getUserPosts = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Get posts
  const posts = await ForumPostModel.find({
    userId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .lean();

  // Get total count for pagination
  const total = await ForumPostModel.countDocuments({
    userId,
    isDeleted: false,
  });

  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      pages: Math.ceil(total / limitNumber),
    },
  });
};

// Get user's comments
const getUserComments = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Get comments
  const comments = await ForumCommentModel.find({
    userId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .populate("postId", "title")
    .lean();

  // Get total count for pagination
  const total = await ForumCommentModel.countDocuments({
    userId,
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

// Get top contributors
const getTopContributors = async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;
  const limitNumber = parseInt(limit as string);

  // Get top users by reputation score
  const topUsers = await ForumUserActivityModel.find()
    .sort({ reputationScore: -1 })
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .lean();

  res.status(200).json({
    success: true,
    data: topUsers,
  });
};

export const forumActivityController = {
  getUserActivity,
  getUserPosts,
  getUserComments,
  getTopContributors,
};
