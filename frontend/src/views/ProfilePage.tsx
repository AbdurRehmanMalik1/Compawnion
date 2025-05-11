import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { apiServer } from "../apiconfig";
import { ForumPost, ForumComment } from "../types/forum.types";

const ProfilePage: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "activity">(
    "posts"
  );

  // Fetch user's posts
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", auth._id],
    queryFn: async () => {
      const { data } = await apiServer.get(`/forum/users/${auth._id}/posts`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!auth._id && activeTab === "posts",
  });

  // Fetch user's comments
  const { data: userComments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["userComments", auth._id],
    queryFn: async () => {
      const { data } = await apiServer.get(
        `/forum/users/${auth._id}/comments`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    enabled: !!auth._id && activeTab === "comments",
  });

  // Fetch user's activity
  const { data: userActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["userActivity", auth._id],
    queryFn: async () => {
      const { data } = await apiServer.get("/forum/activity", {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!auth._id && activeTab === "activity",
  });

  if (!auth._id) {
    return (
      <div className="min-h-screen bg-[var(--color-light)] p-6 text-black flex items-center justify-center">
        <div className="text-2xl text-gray-600">
          Please log in to view your profile
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)] p-6 text-black">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-3xl">
            {auth.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">
              {auth.name}
            </h1>
            <p className="text-gray-600">{auth.email}</p>
            <p className="text-[var(--color-secondary)] font-medium capitalize">
              {auth.role}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "posts"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "comments"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            My Comments
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "activity"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Activity
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === "posts" && (
            <>
              {isLoadingPosts ? (
                <div className="text-gray-500">Loading posts...</div>
              ) : (
                userPosts?.data?.map((post: ForumPost) => (
                  <div
                    key={post._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="font-semibold text-[var(--color-primary)]">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Posted on {new Date(post.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-2">
                      <span>👍 {post.upvoteCount}</span>
                      <span>👎 {post.downvoteCount}</span>
                      <span>💬 {post.commentCount}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "comments" && (
            <>
              {isLoadingComments ? (
                <div className="text-gray-500">Loading comments...</div>
              ) : (
                userComments?.data?.map((comment: ForumComment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <p className="text-sm text-gray-600">{comment.content}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Commented on{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-2">
                      <span>👍 {comment.upvoteCount}</span>
                      <span>👎 {comment.downvoteCount}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === "activity" && (
            <>
              {isLoadingActivity ? (
                <div className="text-gray-500">Loading activity...</div>
              ) : (
                userActivity?.data?.map((activity: any) => (
                  <div
                    key={activity._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="text-sm text-gray-600">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
