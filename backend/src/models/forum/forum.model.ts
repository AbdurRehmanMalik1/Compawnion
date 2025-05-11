import mongoose, { Document, Schema } from "mongoose";
import { UserModelI } from "../user/user.model";

// Forum Categories
export enum ForumCategory {
  NUTRITION = "NUTRITION",
  TRAINING = "TRAINING",
  HEALTH = "HEALTH",
  BEHAVIOR = "BEHAVIOR",
  GROOMING = "GROOMING",
  ADOPTION = "ADOPTION",
  BREEDS = "BREEDS",
  EMERGENCY = "EMERGENCY",
  GENERAL = "GENERAL",
}

// Vote interface for both posts and comments
interface Vote {
  userId: mongoose.Types.ObjectId;
  type: "upvote" | "downvote";
  createdAt: Date;
}

// Comment interface (similar to Reply in the example)
export interface ForumComment extends Document {
  _id: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | UserModelI;
  content: string;
  attachments?: string[]; // URLs to images or other files
  votes: Vote[];
  upvoteCount: number;
  downvoteCount: number;
  isDeleted: boolean;
  parentCommentId?: mongoose.Types.ObjectId; // For nested comments/replies
  createdAt: Date;
  updatedAt: Date;
}

// Post interface
export interface ForumPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  userId: mongoose.Types.ObjectId | UserModelI;
  attachments?: string[]; // URLs to images or other files
  votes: Vote[];
  upvoteCount: number;
  downvoteCount: number;
  viewCount: number;
  commentCount: number;
  isPinned: boolean; // For important posts
  isDeleted: boolean;
  lastActivityAt: Date; // For sorting by activity
  createdAt: Date;
  updatedAt: Date;
}

// Vote Schema
const VoteSchema = new Schema<Vote>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["upvote", "downvote"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Comment Schema
const CommentSchema = new Schema<ForumComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "ForumPost",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    votes: [VoteSchema],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "ForumComment",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Post Schema
const PostSchema = new Schema<ForumPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(ForumCategory),
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        type: String,
        trim: true,
      },
    ],
    votes: [VoteSchema],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
PostSchema.index({ category: 1, createdAt: -1 });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ lastActivityAt: -1 });
PostSchema.index({ isPinned: -1, lastActivityAt: -1 });
PostSchema.index({ title: "text", content: "text" });

CommentSchema.index({ postId: 1, createdAt: 1 });
CommentSchema.index({ userId: 1 });
CommentSchema.index({ parentCommentId: 1 });

// Create models
const ForumPostModel = mongoose.model<ForumPost>("ForumPost", PostSchema);
const ForumCommentModel = mongoose.model<ForumComment>(
  "ForumComment",
  CommentSchema
);

export { ForumPostModel, ForumCommentModel };
