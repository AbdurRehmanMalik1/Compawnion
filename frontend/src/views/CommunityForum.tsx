import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import {
  usePosts,
  useCreatePost,
  useComments,
  useCreateComment,
  useVotePost,
  useVoteComment,
} from "../api/forum.api";
import { ForumCategory, ForumPost, ForumComment } from "../types/forum.types";
import { useAppSelector } from "../redux/hooks";

const Forum: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<ForumCategory | "All">(
    "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: ForumCategory.GENERAL,
  });
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: string }>(
    {}
  );
  const { _id: userId } = useAppSelector((state) => state.auth);

  // API Hooks
  const { data: postsData, isLoading: isLoadingPosts } = usePosts({
    category: categoryFilter !== "All" ? categoryFilter : undefined,
    sortBy: "createdAt",
    order: "desc",
  });

  const createPostMutation = useCreatePost();
  const votePostMutation = useVotePost();
  const voteCommentMutation = useVoteComment();

  const handlePostSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await createPostMutation.mutateAsync({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
      });
      setNewPost({ title: "", content: "", category: ForumCategory.GENERAL });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleVotePost = async (
    postId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      await votePostMutation.mutateAsync({ postId, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  const handleVoteComment = async (
    commentId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      await voteCommentMutation.mutateAsync({ commentId, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  // Get posts from the API response
  const posts = postsData?.data || [];
  const searchedPosts = posts.filter((post: ForumPost) => {
    const query = searchQuery.toLowerCase();
    return post.title.toLowerCase().includes(query);
  });

  if (isLoadingPosts) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] p-6 text-black flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)] p-6 text-black relative">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Pet Care Forum & Discussions
      </h1>

      {userId && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm"
        >
          {showForm ? "Hide Post Form" : "➕ New Post"}
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold mb-2 text-[var(--color-secondary)]">
                Create New Post
              </h2>
              <input
                type="text"
                placeholder="Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    category: e.target.value as ForumCategory,
                  })
                }
              >
                {Object.values(ForumCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <textarea
                rows={3}
                placeholder="Write your post..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-full hover:opacity-90 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostSubmit}
                  disabled={createPostMutation.isPending}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm disabled:opacity-50"
                >
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className="mb-4 space-x-2">
        {["All", ...Object.values(ForumCategory)].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as ForumCategory | "All")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              categoryFilter === cat
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* Forum Posts */}
      <div className="space-y-6 pb-20">
        {searchedPosts.map((post: ForumPost) => (
          <div
            key={post._id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <div className="text-[var(--color-secondary)] text-sm font-semibold">
                {post.category}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
            <h3 className="text-lg font-bold mt-1 text-[var(--color-primary)]">
              {post.title}
            </h3>
            <p className="text-sm text-gray-700 mt-1">{post.content}</p>
            <div className="text-xs text-gray-500 mt-2">
              By {post.author?.roleData?.shelterName || post.author?.name}
            </div>

            {/* Post Vote and Report */}
            <div className="flex items-center gap-4 text-sm mt-2">
              <button
                onClick={() => handleVotePost(post._id, "upvote")}
                className="flex items-center gap-1 hover:opacity-70"
                disabled={votePostMutation.isPending}
              >
                <FaThumbsUp />
                {post.upvoteCount}
              </button>
              <button
                onClick={() => handleVotePost(post._id, "downvote")}
                className="flex items-center gap-1 hover:opacity-70"
                disabled={votePostMutation.isPending}
              >
                <FaThumbsDown />
                {post.downvoteCount}
              </button>
            </div>

            {/* Post Comments */}
            <PostComments postId={post._id} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Separate component for comments to handle comment-specific logic
const PostComments: React.FC<{ postId: string }> = ({ postId }) => {
  const [replyInput, setReplyInput] = useState("");
  const { data: commentsData, isLoading: isLoadingComments } = useComments({
    postId,
  });
  const createCommentMutation = useCreateComment();
  const voteCommentMutation = useVoteComment();

  const handleVoteComment = async (
    commentId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      await voteCommentMutation.mutateAsync({ commentId, voteType });
    } catch (error) {
      console.error("Failed to vote:", error);
      alert("Failed to vote. Please try again.");
    }
  };

  const handleReplySubmit = async () => {
    if (!replyInput.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: replyInput.trim(),
      });
      setReplyInput("");
    } catch (error) {
      console.error("Failed to create comment:", error);
      alert("Failed to create comment. Please try again.");
    }
  };

  if (isLoadingComments) {
    return <div className="mt-4 text-gray-500">Loading comments...</div>;
  }

  // Get comments from the API response
  const comments = commentsData?.data || [];

  return (
    <div className="mt-4">
      {comments.map((comment: ForumComment) => (
        <div
          key={comment._id}
          className="bg-gray-50 p-3 rounded-lg shadow-md mb-4"
        >
          <div className="text-[var(--color-secondary)] text-xs">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
          <div className="font-semibold">
            {comment.author?.roleData?.shelterName || comment.author?.name}
          </div>
          <p className="text-sm text-gray-700">{comment.content}</p>
          <div className="flex items-center gap-2 text-xs mt-1 ml-2">
            <button
              onClick={() => handleVoteComment(comment._id, "upvote")}
              className="flex items-center gap-1 hover:opacity-70"
              disabled={voteCommentMutation.isPending}
            >
              <FaThumbsUp />
              {comment.upvoteCount}
            </button>
            <button
              onClick={() => handleVoteComment(comment._id, "downvote")}
              className="flex items-center gap-1 hover:opacity-70"
              disabled={voteCommentMutation.isPending}
            >
              <FaThumbsDown />
              {comment.downvoteCount}
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4 flex items-center space-x-2">
        <textarea
          placeholder="Write a reply..."
          rows={1}
          value={replyInput}
          onChange={(e) => setReplyInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <button
          onClick={handleReplySubmit}
          disabled={createCommentMutation.isPending}
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm disabled:opacity-50"
        >
          {createCommentMutation.isPending ? "Posting..." : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default Forum;
