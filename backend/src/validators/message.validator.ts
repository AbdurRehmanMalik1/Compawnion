import { body, param, query } from "express-validator";
import { validateRequest } from "./validateRequest";
import { AttachmentType } from "../types";
import mongoose from "mongoose";

const startConversationValidator = [
  body("recipientId")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid recipient ID format");
      }
      return true;
    }),
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .trim(),
  body("attachment")
    .optional()
    .isObject()
    .withMessage("Attachment must be an object"),
  body("attachment.url")
    .if(body("attachment").exists())
    .notEmpty()
    .withMessage("Attachment URL is required")
    .isURL()
    .withMessage("Attachment URL must be a valid URL"),
  body("attachment.type")
    .if(body("attachment").exists())
    .notEmpty()
    .withMessage("Attachment type is required")
    .isIn(Object.values(AttachmentType))
    .withMessage("Invalid attachment type"),
  body().custom((body) => {
    // Ensure either content or attachment is provided
    if (!body.content && !body.attachment) {
      throw new Error("Either content or attachment must be provided");
    }
    return true;
  }),
  validateRequest,
];

const sendMessageValidator = [
  body("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid conversation ID format");
      }
      return true;
    }),
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .trim(),
  body("attachment")
    .optional()
    .isObject()
    .withMessage("Attachment must be an object"),
  body("attachment.url")
    .if(body("attachment").exists())
    .notEmpty()
    .withMessage("Attachment URL is required")
    .isURL()
    .withMessage("Attachment URL must be a valid URL"),
  body("attachment.type")
    .if(body("attachment").exists())
    .notEmpty()
    .withMessage("Attachment type is required")
    .isIn(Object.values(AttachmentType))
    .withMessage("Invalid attachment type"),
  body().custom((body) => {
    // Ensure either content or attachment is provided
    if (!body.content && !body.attachment) {
      throw new Error("Either content or attachment must be provided");
    }
    return true;
  }),
  validateRequest,
];

const getMessagesValidator = [
  param("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid conversation ID format");
      }
      return true;
    }),
  query("before")
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid message ID format");
      }
      return true;
    }),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  validateRequest,
];

const conversationIdValidator = [
  param("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid conversation ID format");
      }
      return true;
    }),
  validateRequest,
];

const messageIdValidator = [
  param("messageId")
    .notEmpty()
    .withMessage("Message ID is required")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid message ID format");
      }
      return true;
    }),
  validateRequest,
];

export const messageValidator = {
  startConversation: startConversationValidator,
  sendMessage: sendMessageValidator,
  getMessages: getMessagesValidator,
  conversationId: conversationIdValidator,
  messageId: messageIdValidator,
};
