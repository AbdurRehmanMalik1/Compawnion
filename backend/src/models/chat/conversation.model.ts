import mongoose, { Document } from "mongoose";
import { UserModelI } from "../user/user.model";
export interface ConversationModelI extends Document {
  _id: string;
  participants: string[] | UserModelI[]; // Array of user IDs
  adopterId: string | UserModelI;
  shelterId: string | UserModelI;
  lastMessage?: string;
  lastMessageDate?: Date;
  unreadCount: {
    [userId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: [true, "Participants are required"],
      validate: {
        validator: function (this: any, participants: string[]) {
          return participants.length === 2; // Ensure exactly 2 participants
        },
        message: "A conversation must have exactly 2 participants",
      },
    },
    adopterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Adopter ID is required"],
    },
    shelterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shelter ID is required"],
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    lastMessageDate: {
      type: Date,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Ensure a unique conversation between the same two users
conversationSchema.index({ participants: 1 }, { unique: true });

// Create indexes for efficient querying
conversationSchema.index({ adopterId: 1 });
conversationSchema.index({ shelterId: 1 });
conversationSchema.index({ lastMessageDate: -1 });

const ConversationModel = mongoose.model<ConversationModelI>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
