import { Router } from "express";
import { messageController } from "../controllers/message.controller";
import { messageValidator } from "../validators/message.validator";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../types";

const router = Router();

// All message routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware([UserRole.ADOPTER, UserRole.SHELTER]));

// Conversations
router.post(
  "/conversations",
  messageValidator.startConversation,
  messageController.startConversation
);

router.get("/conversations", messageController.getConversations);

router.get(
  "/conversations/:conversationId",
  messageValidator.conversationId,
  messageController.getConversation
);

router.delete(
  "/conversations/:conversationId",
  messageValidator.conversationId,
  messageController.deleteConversation
);

// Messages
router.post(
  "/messages",
  messageValidator.sendMessage,
  messageController.sendMessage
);

router.get(
  "/conversations/:conversationId/messages",
  messageValidator.getMessages,
  messageController.getMessages
);

router.patch(
  "/conversations/:conversationId/read",
  messageValidator.conversationId,
  messageController.markMessagesAsRead
);

router.delete(
  "/messages/:messageId",
  messageValidator.messageId,
  messageController.deleteMessage
);

export default router;
