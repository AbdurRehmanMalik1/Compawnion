import mongoose, { Document, Schema } from "mongoose";

export interface ForumUserInteraction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  isBookmarked: boolean;
  isRead: boolean;
  lastReadAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserInteractionSchema = new Schema<ForumUserInteraction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "ForumPost",
      required: true,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    lastReadAt: {
      type: Date,
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

// Compound index to ensure a user can only have one interaction record per post
UserInteractionSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Create model
const ForumUserInteractionModel = mongoose.model<ForumUserInteraction>(
  "ForumUserInteraction",
  UserInteractionSchema
);

export default ForumUserInteractionModel;
