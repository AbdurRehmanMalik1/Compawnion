import mongoose, { Document, Schema } from "mongoose";

export interface ForumUserActivity extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  postsCreated: number;
  commentsCreated: number;
  upvotesGiven: number;
  downvotesGiven: number;
  upvotesReceived: number;
  downvotesReceived: number;
  lastPostAt?: Date;
  lastCommentAt?: Date;
  lastVoteAt?: Date;
  reputationScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserActivitySchema = new Schema<ForumUserActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    postsCreated: {
      type: Number,
      default: 0,
    },
    commentsCreated: {
      type: Number,
      default: 0,
    },
    upvotesGiven: {
      type: Number,
      default: 0,
    },
    downvotesGiven: {
      type: Number,
      default: 0,
    },
    upvotesReceived: {
      type: Number,
      default: 0,
    },
    downvotesReceived: {
      type: Number,
      default: 0,
    },
    lastPostAt: {
      type: Date,
    },
    lastCommentAt: {
      type: Date,
    },
    lastVoteAt: {
      type: Date,
    },
    reputationScore: {
      type: Number,
      default: 0,
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

// Create model
const ForumUserActivityModel = mongoose.model<ForumUserActivity>(
  "ForumUserActivity",
  UserActivitySchema
);

export default ForumUserActivityModel;
