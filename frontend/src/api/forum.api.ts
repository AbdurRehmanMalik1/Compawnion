import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiServer } from "../apiconfig";
import { ForumCategory } from "../types/forum.types";

// Types
export interface ForumPost {
  _id: string;
  title: string;
  content: string;
  category: ForumCategory;
  author: {
    _id: string;
    name: string;
    roleData?: {
      shelterName?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  viewCount: number;
  tags?: string[];
  attachments?: string[];
}

export interface ForumComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    roleData?: {
      shelterName?: string;
    };
  };
  postId: string;
  parentCommentId?: string;
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  downvoteCount: number;
  attachments?: string[];
}

// API functions
const getPosts = async (params: {
  page?: number;
  limit?: number;
  category?: ForumCategory;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  const { data } = await apiServer.get("/forum/posts", { params });
  return data;
};

const getPostById = async (postId: string) => {
  const { data } = await apiServer.get(`/forum/posts/${postId}`, {
    withCredentials: true,
  });
  return data;
};

const createPost = async (postData: {
  title: string;
  content: string;
  category: ForumCategory;
  tags?: string[];
  attachments?: string[];
}) => {
  const { data } = await apiServer.post("/forum/posts", postData, {
    withCredentials: true,
  });
  return data;
};

const getComments = async (params: {
  postId: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "votes";
}) => {
  const { data } = await apiServer.get(
    `/forum/posts/${params.postId}/comments`,
    {
      params,
      withCredentials: true,
    }
  );
  return data;
};

const createComment = async (commentData: {
  postId: string;
  content: string;
  parentCommentId?: string;
  attachments?: string[];
}) => {
  const { data } = await apiServer.post(
    `/forum/posts/${commentData.postId}/comments`,
    commentData,
    {
      withCredentials: true,
    }
  );
  return data;
};

const votePost = async (params: {
  postId: string;
  voteType: "upvote" | "downvote";
}) => {
  const { data } = await apiServer.post(
    `/forum/posts/${params.postId}/vote`,
    params,
    {
      withCredentials: true,
    }
  );
  return data;
};

const voteComment = async (params: {
  commentId: string;
  voteType: "upvote" | "downvote";
}) => {
  const { data } = await apiServer.post(
    `/forum/comments/${params.commentId}/vote`,
    params,
    {
      withCredentials: true,
    }
  );
  return data;
};

// React Query hooks
export const usePosts = (params: {
  page?: number;
  limit?: number;
  category?: ForumCategory;
  sortBy?: string;
  order?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => getPosts(params),
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useComments = (params: {
  postId: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "votes";
}) => {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: () => getComments(params),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { postId: variables.postId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
    },
  });
};

export const useVotePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: votePost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post", variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voteComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};
