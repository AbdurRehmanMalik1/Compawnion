import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useStartConversation,
  Conversation,
  Message,
  Attachment,
} from "../api/message.api";
import { useAppSelector } from "../redux/hooks";
import CloudinaryUploader from "../CloudinaryUploader";
import { AttachmentType } from "../types/message.types";

const ChatList: React.FC = () => {
  const location = useLocation();
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { _id: userId, role } = useAppSelector((state) => state.auth);

  // API Hooks
  const { data: conversationsData, isLoading: isLoadingConversations } =
    useConversations();
  const { data: activeConversationData } = useConversation(activeChatId);
  const { data: messagesData } = useMessages(activeChatId);
  const sendMessageMutation = useSendMessage();
  const startConversationMutation = useStartConversation();

  const activeChat = conversationsData?.conversations.find(
    (chat) => chat._id === activeChatId
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Handle navigation from pet detail page
    if (location.state) {
      const { shelterId, shelterName, petId, petName } = location.state as any;

      // Check if conversation with this shelter already exists
      const existingChat = conversationsData?.conversations.find(
        (chat) => chat.shelterId === shelterId
      );

      if (!existingChat && userId) {
        // Create new conversation with initial message
        startConversationMutation.mutate({
          recipientId: shelterId,
          content: `Hi! I'm interested in ${petName}. Can you tell me more about them?`,
        });
      } else if (existingChat) {
        // Just set the active chat without sending a message
        setActiveChatId(existingChat._id);
      }
    }
  }, [location.state, conversationsData, userId]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !isUploading) || !activeChatId) return;

    sendMessageMutation.mutate({
      conversationId: activeChatId,
      content: newMessage.trim(),
    });
    setNewMessage("");
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !activeChatId) return;

    try {
      setIsUploading(true);
      const imageUrl = await CloudinaryUploader.upload(file);

      const attachment: Attachment = {
        url: imageUrl,
        type: AttachmentType.IMAGE,
        name: file.name,
        size: file.size,
      };

      sendMessageMutation.mutate({
        conversationId: activeChatId,
        attachment,
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleVoiceCall = () => alert("Voice call clicked!");
  const handleVideoCall = () => alert("Video call clicked!");

  if (isLoadingConversations) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[var(--color-light)]">
      {/* Sidebar */}
      {(!isMobile || !activeChat) && (
        <div className="w-full md:w-1/3 bg-[var(--color-light)] text-black flex flex-col overflow-y-auto border-r border-gray-200">
          <div className="p-4 text-xl font-bold border-b border-gray-300 text-[var(--color-primary)]">
            💬 Chats
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversationsData?.conversations.map((chat) => (
              <div
                key={chat._id}
                className={`flex items-center p-4 cursor-pointer transition-colors duration-200 border-b border-gray-200 ${
                  chat._id === activeChatId
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveChatId(chat._id)}
              >
                <div className="w-10 h-10 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-full mr-3 font-bold">
                  {chat.otherParticipant.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--color-secondary)]">
                    {chat.otherParticipant?.roleData?.shelterName ||
                      chat.otherParticipant.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="mt-1 text-xs text-[var(--color-primary)]">
                      {chat.unreadCount} unread message
                      {chat.unreadCount !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {!isMobile && <div className="w-1 bg-gray-200"></div>}

      {/* Chat Window */}
      {(!isMobile || activeChat) && (
        <div className="flex-1 md:w-2/3 flex flex-col bg-[var(--color-light)]">
          <div className="p-4 border-b border-gray-300 bg-[var(--color-light)] sticky top-0 z-0 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {isMobile && (
                <button
                  className="text-2xl font-bold text-black hover:opacity-70 cursor-pointer"
                  onClick={() => setActiveChatId("")}
                  title="Back"
                >
                  ←
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-[var(--color-primary)]">
                  {activeChat
                    ? activeChat.otherParticipant?.roleData?.shelterName ||
                      activeChat.otherParticipant.name
                    : "Select a chat"}
                </h2>
              </div>
            </div>

            {activeChat && (
              <div className="flex space-x-4 text-xl text-gray-500">
                <button
                  onClick={handleVoiceCall}
                  className="hover:text-gray-700"
                  title="Voice Call"
                >
                  📞
                </button>
                <button
                  onClick={handleVideoCall}
                  className="hover:text-gray-700"
                  title="Video Call"
                >
                  🎥
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-light)]">
            {activeChat ? (
              <AnimatePresence initial={false}>
                {messagesData?.messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.sender === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-xs">
                      {msg.attachment &&
                        msg.attachment.type === AttachmentType.IMAGE && (
                          <div className="mb-1">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name || "Shared image"}
                              className="rounded-lg max-w-full h-auto"
                            />
                          </div>
                        )}
                      {msg.content && (
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm shadow ${
                            msg.sender === userId
                              ? "bg-[var(--color-primary)] text-white rounded-br-none"
                              : "bg-[var(--color-secondary)] text-white rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      )}
                      <div
                        className={`text-xs text-gray-500 mt-1 ${
                          msg.sender === userId ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                Select a chat to start messaging
              </div>
            )}
          </div>

          {/* Message Input */}
          {activeChat && (
            <div className="p-4 flex items-center space-x-2 border-t border-gray-300 bg-[var(--color-light)] sticky bottom-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                className="text-xl text-gray-500 hover:text-gray-700 disabled:opacity-50"
                onClick={handleAttachFile}
                title="Attach image"
                disabled={isUploading}
              >
                {isUploading ? "📤" : "📷"}
              </button>
              <input
                type="text"
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={
                  isUploading ? "Uploading image..." : "Type your message..."
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={sendMessageMutation.isPending || isUploading}
              />
              <button
                className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || isUploading}
              >
                {sendMessageMutation.isPending ? "Sending..." : "Send"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
