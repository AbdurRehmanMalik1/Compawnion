import { apiServer } from "../apiconfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentType } from "../types/message.types";

// Types
export interface Attachment {
  url: string;
  type: AttachmentType;
  name?: string;
  size?: number;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
  content?: string;
  attachment?: Attachment;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  adopterId: string;
  shelterId: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  otherParticipant: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    roleData: {
      shelterName?: string;
      address?: string;
      phone?: string;
    };
  };
}

export interface StartConversationData {
  recipientId: string;
  content?: string;
  attachment?: Attachment;
}

export interface SendMessageData {
  conversationId: string;
  content?: string;
  attachment?: Attachment;
}

export interface GetMessagesParams {
  before?: string;
  limit?: number;
}

// API Functions
const startConversation = async (data: StartConversationData) => {
  const response = await apiServer.post<{
    message: string;
    conversation: Conversation;
    initialMessage: Message;
  }>("/messages/conversations", data, {
    withCredentials: true,
  });
  return response.data;
};

const getConversations = async () => {
  const response = await apiServer.get<{
    message: string;
    conversations: Conversation[];
  }>("/messages/conversations", {
    withCredentials: true,
  });
  return response.data;
};

const getConversation = async (conversationId: string) => {
  const response = await apiServer.get<{
    message: string;
    conversation: Conversation;
    messages: Message[];
  }>(`/messages/conversations/${conversationId}`, {
    withCredentials: true,
  });
  return response.data;
};

const getMessages = async (
  conversationId: string,
  params: GetMessagesParams = {}
) => {
  const response = await apiServer.get<{
    message: string;
    messages: Message[];
    hasMore: boolean;
    nextCursor: string | null;
  }>(`/messages/conversations/${conversationId}/messages`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

const sendMessage = async (data: SendMessageData) => {
  const response = await apiServer.post<{
    message: string;
    newMessage: Message;
  }>("/messages/messages", data, {
    withCredentials: true,
  });
  return response.data;
};

const markMessagesAsRead = async (conversationId: string) => {
  const response = await apiServer.patch<{
    message: string;
  }>(`/messages/conversations/${conversationId}/read`, {
    withCredentials: true,
  });
  return response.data;
};

const deleteMessage = async (messageId: string) => {
  const response = await apiServer.delete<{
    message: string;
  }>(`/messages/messages/${messageId}`, {
    withCredentials: true,
  });
  return response.data;
};

const deleteConversation = async (conversationId: string) => {
  const response = await apiServer.delete<{
    message: string;
  }>(`/messages/conversations/${conversationId}`, {
    withCredentials: true,
  });
  return response.data;
};

// React Query Hooks
export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startConversation,
    onSuccess: () => {
      // Invalidate conversations list after starting a new conversation
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
  });
};

export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });
};

export const useMessages = (
  conversationId: string,
  params: GetMessagesParams = {}
) => {
  return useQuery({
    queryKey: ["messages", conversationId, params],
    queryFn: () => getMessages(conversationId, params),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, variables) => {
      // Invalidate both the conversation and messages queries
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: (_, conversationId) => {
      // Invalidate both the conversation and conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, messageId) => {
      // Invalidate all message-related queries
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      // Invalidate conversations list after deleting a conversation
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
