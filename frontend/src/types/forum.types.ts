export enum ForumCategory {
  NUTRITION = "NUTRITION",
  TRAINING = "TRAINING",
  HEALTH = "HEALTH",
  BEHAVIOR = "BEHAVIOR",
  ADOPTION = "ADOPTION",
  GENERAL = "GENERAL",
}

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
