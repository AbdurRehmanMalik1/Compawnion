import { Request, Response } from "express";
import ConversationModel from "../models/chat/conversation.model";
import MessageModel from "../models/chat/message.model";
import UserModel, { UserModelI } from "../models/user/user.model";
import { UserRole } from "../types";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import mongoose from "mongoose";

/**
 * Start a new conversation with an initial message
 */
const startConversation = async (req: Request, res: Response) => {
  const { recipientId, content, attachment } = req.body;
  const currentUser = req.user as UserModelI;

  // Find the recipient user
  const recipientUser = await UserModel.findById(recipientId);
  if (!recipientUser) {
    throw HttpExceptions.NotFound("Recipient user not found");
  }

  // Determine roles for the conversation
  let adopterId, shelterId;

  if (
    currentUser.role === UserRole.ADOPTER &&
    recipientUser.role === UserRole.SHELTER
  ) {
    adopterId = currentUser._id;
    shelterId = recipientUser._id;
  } else if (
    currentUser.role === UserRole.SHELTER &&
    recipientUser.role === UserRole.ADOPTER
  ) {
    adopterId = recipientUser._id;
    shelterId = currentUser._id;
  } else {
    throw HttpExceptions.BadRequest(
      "Conversations can only be started between adopters and shelters"
    );
  }

  // Check if a conversation already exists between these users
  let conversation = await ConversationModel.findOne({
    participants: { $all: [currentUser._id, recipientId] },
  });

  // If no conversation exists, create one
  if (!conversation) {
    conversation = await ConversationModel.create({
      participants: [currentUser._id, recipientId],
      adopterId,
      shelterId,
      lastMessage: content || "Attachment",
      lastMessageDate: new Date(),
      unreadCount: {
        [currentUser._id.toString()]: 0,
        [recipientId.toString()]: 1, // Recipient has 1 unread message
      },
    });
  }

  // Create the initial message
  const newMessage = await MessageModel.create({
    conversationId: conversation._id,
    sender: currentUser._id,
    receiver: recipientId,
    content,
    attachment,
    isRead: false,
  });

  // If conversation already existed, update it with the new message info
  if (conversation.lastMessageDate) {
    conversation.lastMessage = content || "Attachment";
    conversation.lastMessageDate = new Date();

    // Increment unread count for the recipient
    const unreadCount = conversation.unreadCount || {};
    unreadCount[recipientId.toString()] =
      (unreadCount[recipientId.toString()] || 0) + 1;
    conversation.unreadCount = unreadCount;

    await conversation.save();
  }

  res.status(201).json({
    message: "Conversation started with initial message",
    conversation,
    initialMessage: newMessage,
  });
};

/**
 * Send a message in an existing conversation
 */
const sendMessage = async (req: Request, res: Response) => {
  const { conversationId, content, attachment } = req.body;
  const currentUser = req.user as UserModelI;

  // Find the conversation
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw HttpExceptions.NotFound("Conversation not found");
  }

  // Ensure the current user is a participant in the conversation
  if (
    !(conversation.participants as string[]).includes(
      currentUser._id.toString()
    )
  ) {
    throw HttpExceptions.Forbidden(
      "You are not a participant in this conversation"
    );
  }

  // Find the recipient (the other participant)
  const recipientId = conversation.participants.find(
    (id) => id.toString() !== currentUser._id.toString()
  );

  if (!recipientId) {
    throw HttpExceptions.InternalServerError(
      "Could not determine message recipient"
    );
  }

  // Create the new message
  const newMessage = await MessageModel.create({
    conversationId,
    sender: currentUser._id,
    receiver: recipientId,
    content,
    attachment,
    isRead: false,
  });

  // Update the conversation with the last message info
  conversation.lastMessage = content || "Attachment";
  conversation.lastMessageDate = new Date();

  // Increment unread count for the recipient
  const unreadCount = conversation.unreadCount || {};
  unreadCount[recipientId.toString()] =
    (unreadCount[recipientId.toString()] || 0) + 1;
  conversation.unreadCount = unreadCount;

  await conversation.save();

  res.status(201).json({
    message: "Message sent successfully",
    newMessage,
  });
};

/**
 * Get all conversations for the current user
 */
const getConversations = async (req: Request, res: Response) => {
  const currentUser = req.user as UserModelI;

  // Find all conversations where the current user is a participant
  const conversations = await ConversationModel.find({
    participants: currentUser._id,
  })
    .sort({ lastMessageDate: -1 }) // Sort by most recent message
    .populate({
      path: "participants",
      select: "name email avatar role roleData",
      match: { _id: { $ne: currentUser._id } }, // Only populate the other participant
    });

  // Format conversations for frontend
  const formattedConversations = conversations.map((convo) => {
    const convoObj = convo.toObject();
    // Extract the other participant (should be only one since we filtered current user)
    const otherParticipant = convoObj.participants[0] || null;

    return {
      ...convoObj,
      otherParticipant,
      participants: undefined, // Remove the original participants array
      unreadCount: convoObj.unreadCount?.[currentUser._id.toString()] || 0,
    };
  });

  res.status(200).json({
    message: "Conversations retrieved successfully",
    conversations: formattedConversations,
  });
};

/**
 * Get a specific conversation by ID
 */
const getConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const currentUser = req.user as UserModelI;

  // Find the conversation
  const conversation = await ConversationModel.findById(
    conversationId
  ).populate({
    path: "participants",
    select: "name email avatar role roleData",
    match: { _id: { $ne: currentUser._id } }, // Only populate the other participant
  });

  if (!conversation) {
    throw HttpExceptions.NotFound("Conversation not found");
  }

  // Ensure the current user is a participant
  // if (
  //   !(conversation.participants as UserModelI[]).some(
  //     (p) => p._id.toString() === currentUser._id.toString()
  //   )
  // ) {
  //   console.log(conversation.participants);
  //   console.log(currentUser._id.toString());
  //   throw HttpExceptions.Forbidden(
  //     "You are not a participant in this conversation"
  //   );
  // }

  // Get initial messages (most recent 20)
  const initialMessages = await MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(20);

  // Mark messages as read
  await MessageModel.updateMany(
    {
      conversationId,
      receiver: currentUser._id,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  // Reset unread count for current user in the conversation
  const unreadCount = conversation.unreadCount || {};
  unreadCount[currentUser._id.toString()] = 0;
  conversation.unreadCount = unreadCount;
  await conversation.save();

  // Format conversation for frontend
  const convoObj = conversation.toObject();
  const otherParticipant = convoObj.participants[0] || null;

  const formattedConversation = {
    ...convoObj,
    otherParticipant,
    participants: undefined, // Remove the original participants array
  };

  res.status(200).json({
    message: "Conversation retrieved successfully",
    conversation: formattedConversation,
    messages: initialMessages.reverse(),
  });
};

/**
 * Get messages for a specific conversation
 */
const getMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { before } = req.query; // Get messages before this message ID
  const limit = parseInt(req.query.limit as string) || 20;
  const currentUser = req.user as UserModelI;

  // Find the conversation
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw HttpExceptions.NotFound("Conversation not found");
  }

  // Ensure the current user is a participant
  if (
    !(conversation.participants as string[]).includes(
      currentUser._id.toString()
    )
  ) {
    throw HttpExceptions.Forbidden(
      "You are not a participant in this conversation"
    );
  }

  // Build query to get messages before a certain message ID
  let query: any = { conversationId };

  if (before && mongoose.Types.ObjectId.isValid(before as string)) {
    query._id = { $lt: before };
  }

  // Get messages for the conversation
  const messages = await MessageModel.find(query)
    .sort({ createdAt: -1 }) // Most recent first
    .limit(limit);

  // Check if there are more messages to load
  const hasMore = messages.length === limit;

  res.status(200).json({
    message: "Messages retrieved successfully",
    messages: messages.reverse(), // Reverse to show oldest first
    hasMore,
    nextCursor: messages.length > 0 ? messages[0]._id : null,
  });
};

/**
 * Mark messages as read
 */
const markMessagesAsRead = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const currentUser = req.user as UserModelI;

  // Find the conversation
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw HttpExceptions.NotFound("Conversation not found");
  }

  // Ensure the current user is a participant
  if (
    !(conversation.participants as string[]).includes(
      currentUser._id.toString()
    )
  ) {
    throw HttpExceptions.Forbidden(
      "You are not a participant in this conversation"
    );
  }

  // Mark all unread messages sent to the current user as read
  await MessageModel.updateMany(
    {
      conversationId,
      receiver: currentUser._id,
      isRead: false,
    },
    {
      isRead: true,
    }
  );

  // Reset unread count for current user in the conversation
  const unreadCount = conversation.unreadCount || {};
  unreadCount[currentUser._id.toString()] = 0;
  conversation.unreadCount = unreadCount;
  await conversation.save();

  res.status(200).json({
    message: "Messages marked as read",
  });
};

/**
 * Delete a message
 */
const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const currentUser = req.user as UserModelI;

  // Find the message
  const message = await MessageModel.findById(messageId);
  if (!message) {
    throw HttpExceptions.NotFound("Message not found");
  }

  // Ensure the current user is the sender
  if (message.sender.toString() !== currentUser._id.toString()) {
    throw HttpExceptions.Forbidden("You can only delete messages you sent");
  }

  // Delete the message
  await message.deleteOne();

  // Update the conversation's last message if needed
  const conversation = await ConversationModel.findById(message.conversationId);
  if (conversation) {
    // Find the new last message
    const lastMessage = await MessageModel.findOne({
      conversationId: conversation._id,
    }).sort({ createdAt: -1 });

    if (lastMessage) {
      conversation.lastMessage = lastMessage.content || "Attachment";
      conversation.lastMessageDate = lastMessage.createdAt;
    } else {
      // No messages left in the conversation
      conversation.lastMessage = undefined;
      conversation.lastMessageDate = undefined;
    }

    await conversation.save();
  }

  res.status(200).json({
    message: "Message deleted successfully",
  });
};

/**
 * Delete a conversation and all its messages
 */
const deleteConversation = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const currentUser = req.user as UserModelI;

  // Find the conversation
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw HttpExceptions.NotFound("Conversation not found");
  }

  // Ensure the current user is a participant
  if (
    !(conversation.participants as string[]).includes(
      currentUser._id.toString()
    )
  ) {
    throw HttpExceptions.Forbidden(
      "You are not a participant in this conversation"
    );
  }

  // Delete all messages in the conversation
  await MessageModel.deleteMany({ conversationId });

  // Delete the conversation
  await conversation.deleteOne();

  res.status(200).json({
    message: "Conversation and all messages deleted successfully",
  });
};

export const messageController = {
  startConversation,
  sendMessage,
  getConversations,
  getConversation,
  getMessages,
  markMessagesAsRead,
  deleteMessage,
  deleteConversation,
};
