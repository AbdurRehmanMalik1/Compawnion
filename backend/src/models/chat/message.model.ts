import mongoose, { Document } from "mongoose";
import { AttachmentType } from "../../types";
import { ConversationModelI } from "./conversation.model";
import { UserModelI } from "../user/user.model";

export interface Attachment {
  url: string;
  type: AttachmentType;
  name?: string;
  size?: number;
}

export interface MessageModelI extends Document {
  _id: string;
  conversationId: string | ConversationModelI;
  sender: string | UserModelI;
  receiver: string | UserModelI;
  content?: string;
  attachment?: Attachment;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(AttachmentType),
    required: true,
  },
  name: String,
  size: Number,
});

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation ID is required"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
    },
    content: {
      type: String,
      trim: true,
    },
    attachment: attachmentSchema,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Validate that either content or attachment is provided
messageSchema.pre("validate", function (next) {
  if (!this.content && !this.attachment) {
    this.invalidate("content", "Either content or attachment must be provided");
  }
  next();
});

// Create indexes for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ isRead: 1 });

const MessageModel = mongoose.model<MessageModelI>("Message", messageSchema);

export default MessageModel;
