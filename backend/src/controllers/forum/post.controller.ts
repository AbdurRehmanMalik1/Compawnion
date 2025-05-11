import { Request, Response } from "express";
import { ClientSession } from "mongoose";
import { ForumPostModel } from "../../models/forum/forum.model";
import ForumUserActivityModel from "../../models/forum/user-activity.model";
import ForumUserInteractionModel from "../../models/forum/user-interaction.model";
import { UserModelI } from "../../models/user/user.model";
import HttpExceptions from "../../utility/exceptions/HttpExceptions";
import withTransaction from "../../middlewares/transactionWrapper";

// Create a new forum post
const createPost = async (req: Request, res: Response) => {
  const user = req.user as UserModelI;
  const { title, content, category, tags, attachments } = req.body;

  const post = await ForumPostModel.create({
    title,
    content,
    category,
    tags: tags || [],
    userId: user._id,
    attachments: attachments || [],
    lastActivityAt: new Date(),
  });

  // Update user activity
  await ForumUserActivityModel.findOneAndUpdate(
    { userId: user._id },
    {
      $inc: { postsCreated: 1 },
      $set: { lastPostAt: new Date() },
    },
    { upsert: true }
  );

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post,
  });
};

// Get all posts with pagination and filtering
const getPosts = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    category,
    tag,
    sortBy = "lastActivityAt",
    order = "desc",
    search,
  } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Build query
  const query: any = { isDeleted: false };

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$text = { $search: search as string };
  }

  // Determine sort order
  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions: any = {};

  // Special case for sorting by activity
  if (sortBy === "lastActivityAt") {
    sortOptions.isPinned = -1; // Pinned posts first
    sortOptions.lastActivityAt = sortOrder;
  } else {
    sortOptions[sortBy as string] = sortOrder;
  }

  // Execute query
  const posts = await ForumPostModel.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .populate("userId", "name avatar role")
    .lean();

  const total = await ForumPostModel.countDocuments(query);

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

// Get a single post by ID with its comments
const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const user = req.user as UserModelI;

  // Increment view count if it's not the post author viewing
  const post = await ForumPostModel.findOneAndUpdate(
    { _id: postId, isDeleted: false, userId: { $ne: user._id } },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate("userId", "name avatar role")
    .lean();

  if (!post) {
    // Check if post exists but was created by the current user (no view increment)
    const authorPost = await ForumPostModel.findOne({
      _id: postId,
      isDeleted: false,
    })
      .populate("userId", "name avatar role")
      .lean();

    if (!authorPost) {
      throw HttpExceptions.NotFound("Post not found");
    }

    // Return the post without incrementing view count
    res.status(200).json({
      success: true,
      data: authorPost,
    });
    return;
  }

  // Mark post as read for this user
  await ForumUserInteractionModel.findOneAndUpdate(
    { userId: user._id, postId },
    { isRead: true, lastReadAt: new Date() },
    { upsert: true }
  );

  res.status(200).json({
    success: true,
    data: post,
  });
};

// Update a post
const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const user = req.user as UserModelI;
  const { title, content, category, tags, attachments } = req.body;

  const post = await ForumPostModel.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw HttpExceptions.NotFound("Post not found");
  }

  // Check if user is the author of the post
  if (post.userId.toString() !== user._id.toString()) {
    throw HttpExceptions.Forbidden(
      "You are not authorized to update this post"
    );
  }

  // Update post
  post.title = title || post.title;
  post.content = content || post.content;
  post.category = category || post.category;
  post.tags = tags || post.tags;
  post.attachments = attachments || post.attachments;
  post.lastActivityAt = new Date();
  post.updatedAt = new Date();

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
};

// Delete a post (soft delete)
const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const user = req.user as UserModelI;

  const post = await ForumPostModel.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw HttpExceptions.NotFound("Post not found");
  }

  // Check if user is the author of the post
  if (post.userId.toString() !== user._id.toString()) {
    throw HttpExceptions.Forbidden(
      "You are not authorized to delete this post"
    );
  }

  // Soft delete
  post.isDeleted = true;
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
};

// Vote on a post (upvote or downvote)
const votePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { voteType } = req.body; // "upvote" or "downvote"
  const user = req.user as UserModelI;

  if (!["upvote", "downvote"].includes(voteType)) {
    throw HttpExceptions.BadRequest("Invalid vote type");
  }

  const post = await ForumPostModel.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw HttpExceptions.NotFound("Post not found");
  }

  // Check if user has already voted
  const existingVoteIndex = post.votes.findIndex(
    (vote) => vote.userId.toString() === user._id.toString()
  );

  // Update vote counts and user activity based on vote action
  const postAuthorActivity = await ForumUserActivityModel.findOne({
    userId: post.userId,
  });

  if (existingVoteIndex !== -1) {
    const existingVote = post.votes[existingVoteIndex];

    // If same vote type, remove the vote (toggle)
    if (existingVote.type === voteType) {
      // Remove vote
      post.votes.splice(existingVoteIndex, 1);

      // Update vote counts
      if (voteType === "upvote") {
        post.upvoteCount -= 1;
        if (postAuthorActivity) {
          postAuthorActivity.upvotesReceived -= 1;
          postAuthorActivity.reputationScore -= 1;
        }
      } else {
        post.downvoteCount -= 1;
        if (postAuthorActivity) {
          postAuthorActivity.downvotesReceived -= 1;
          postAuthorActivity.reputationScore += 1;
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
        { upsert: true }
      );
    } else {
      // Change vote type
      existingVote.type = voteType;
      existingVote.createdAt = new Date();

      // Update vote counts
      if (voteType === "upvote") {
        post.upvoteCount += 1;
        post.downvoteCount -= 1;
        if (postAuthorActivity) {
          postAuthorActivity.upvotesReceived += 1;
          postAuthorActivity.downvotesReceived -= 1;
          postAuthorActivity.reputationScore += 2; // +1 for upvote, +1 for removing downvote
        }
      } else {
        post.upvoteCount -= 1;
        post.downvoteCount += 1;
        if (postAuthorActivity) {
          postAuthorActivity.upvotesReceived -= 1;
          postAuthorActivity.downvotesReceived += 1;
          postAuthorActivity.reputationScore -= 2; // -1 for downvote, -1 for removing upvote
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
        { upsert: true }
      );
    }
  } else {
    // Add new vote
    post.votes.push({
      userId: user._id as any,
      type: voteType,
      createdAt: new Date(),
    });

    // Update vote counts
    if (voteType === "upvote") {
      post.upvoteCount += 1;
      if (postAuthorActivity) {
        postAuthorActivity.upvotesReceived += 1;
        postAuthorActivity.reputationScore += 1;
      }
    } else {
      post.downvoteCount += 1;
      if (postAuthorActivity) {
        postAuthorActivity.downvotesReceived += 1;
        postAuthorActivity.reputationScore -= 1;
      }
    }

    // Update user activity for voter
    await ForumUserActivityModel.findOneAndUpdate(
      { userId: user._id },
      {
        $inc: { [`${voteType}sGiven`]: 1 },
        $set: { lastVoteAt: new Date() },
      },
      { upsert: true }
    );
  }

  // Save changes
  if (postAuthorActivity) {
    await postAuthorActivity.save();
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: `Post ${voteType}d successfully`,
    data: {
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
    },
  });
};

// Bookmark a post
const bookmarkPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const user = req.user as UserModelI;

  // Check if post exists
  const post = await ForumPostModel.findOne({
    _id: postId,
    isDeleted: false,
  });

  if (!post) {
    throw HttpExceptions.NotFound("Post not found");
  }

  // Toggle bookmark status
  const interaction = await ForumUserInteractionModel.findOne({
    userId: user._id,
    postId,
  });

  if (interaction) {
    interaction.isBookmarked = !interaction.isBookmarked;
    await interaction.save();
  } else {
    await ForumUserInteractionModel.create({
      userId: user._id,
      postId,
      isBookmarked: true,
    });
  }

  res.status(200).json({
    success: true,
    message: `Post ${
      interaction?.isBookmarked ? "bookmarked" : "unbookmarked"
    } successfully`,
    isBookmarked: interaction?.isBookmarked || true,
  });
};

// Get bookmarked posts for a user
const getBookmarkedPosts = async (req: Request, res: Response) => {
  const user = req.user as UserModelI;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page as string);
  const limitNumber = parseInt(limit as string);
  const skip = (pageNumber - 1) * limitNumber;

  // Get bookmarked post IDs
  const bookmarkedInteractions = await ForumUserInteractionModel.find({
    userId: user._id,
    isBookmarked: true,
  })
    .skip(skip)
    .limit(limitNumber);

  const postIds = bookmarkedInteractions.map(
    (interaction) => interaction.postId
  );

  // Get the actual posts
  const posts = await ForumPostModel.find({
    _id: { $in: postIds },
    isDeleted: false,
  }).populate("userId", "name avatar role");

  const total = await ForumUserInteractionModel.countDocuments({
    userId: user._id,
    isBookmarked: true,
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

export const forumPostController = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  votePost,
  bookmarkPost,
  getBookmarkedPosts,
};
