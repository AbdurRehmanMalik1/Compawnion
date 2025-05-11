import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';  
type Category = 'Nutrition' | 'Training' | 'Health';

type Reply = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  reported: boolean;
};

type ForumPost = {
  id: number;
  category: Category;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  replies: Reply[];
  upvotes: number;
  downvotes: number;
  reported: boolean;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hour12}:${minuteStr} ${ampm}`;
};

const Forum: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 1,
      category: 'Nutrition',
      title: 'Best food for puppies?',
      author: 'PetLover99',
      content: 'What do you all feed your puppies? Looking for healthy options.',
      timestamp: '9:00 AM',
      upvotes: 0,
      downvotes: 0,
      reported: false,
      replies: [
        {
          id: 1,
          author: 'HealthyPaws',
          content: 'I recommend grain-free dry food with salmon!',
          timestamp: '9:15 AM',
          upvotes: 0,
          downvotes: 0,
          reported: false,
        },
      ],
    },
    {
      id: 2,
      category: 'Training',
      title: 'How to stop leash pulling?',
      author: 'DogTrainer21',
      content: 'My dog constantly pulls on the leash. Any effective tips?',
      timestamp: '10:30 AM',
      upvotes: 0,
      downvotes: 0,
      reported: false,
      replies: [
        {
          id: 2,
          author: 'ObedientPets',
          content: 'Try the “stop and wait” method – worked wonders for me!',
          timestamp: '10:45 AM',
          upvotes: 0,
          downvotes: 0,
          reported: false,
        },
      ],
    },
    {
      id: 3,
      category: 'Health',
      title: 'Vaccination schedule for kittens?',
      author: 'CatMommy',
      content: 'Can someone share a basic vaccination schedule for new kittens?',
      timestamp: '11:00 AM',
      upvotes: 0,
      downvotes: 0,
      reported: false,
      replies: [
        {
          id: 3,
          author: 'VetExpert',
          content: 'Core vaccines start at 6–8 weeks and continue every 3–4 weeks.',
          timestamp: '11:10 AM',
          upvotes: 0,
          downvotes: 0,
          reported: false,
        },
      ],
    },
    {
      id: 4,
      category: 'Health',
      title: 'Dealing with skin allergies in dogs',
      author: 'WoofyWalker',
      content: 'My dog scratches all the time. Could it be food or pollen allergies?',
      timestamp: '11:30 AM',
      upvotes: 0,
      downvotes: 0,
      reported: false,
      replies: [],
    },
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Nutrition' as Category,
  });

  const [replyInputs, setReplyInputs] = useState<{ [postId: number]: string }>({});
  const [showForm, setShowForm] = useState(false);

  const handleAttachFile = () => {
    alert('Attach file clicked (implement logic here)');
  };

  const handlePostSubmit = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const newForumPost: ForumPost = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: 'You',
      timestamp: getCurrentTime(),
      upvotes: 0,
      downvotes: 0,
      reported: false,
      replies: [],
    };

    setPosts([newForumPost, ...posts]);
    setNewPost({ title: '', content: '', category: 'Nutrition' });
    setShowForm(false);
  };

  const handleReplySubmit = (postId: number) => {
    const replyText = replyInputs[postId]?.trim();
    if (!replyText) return;

    const newReply: Reply = {
      id: Date.now(),
      author: 'You',
      content: replyText,
      timestamp: getCurrentTime(),
      upvotes: 0,
      downvotes: 0,
      reported: false,
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, replies: [...post.replies, newReply] } : post
      )
    );

    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Handling Upvote, Downvote, and Report
  const handleUpvotePost = (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  const handleDownvotePost = (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
      )
    );
  };

  const handleReportPost = (postId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, reported: true } : post
      )
    );
  };

  const handleUpvoteReply = (postId: number, replyId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map(reply =>
                reply.id === replyId ? { ...reply, upvotes: reply.upvotes + 1 } : reply
              ),
            }
          : post
      )
    );
  };

  const handleDownvoteReply = (postId: number, replyId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map(reply =>
                reply.id === replyId ? { ...reply, downvotes: reply.downvotes + 1 } : reply
              ),
            }
          : post
      )
    );
  };

  const handleReportReply = (postId: number, replyId: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map(reply =>
                reply.id === replyId ? { ...reply, reported: true } : reply
              ),
            }
          : post
      )
    );
  };

  const filteredPosts =
    categoryFilter === 'All'
      ? posts
      : posts.filter((post) => post.category === categoryFilter);

  const searchedPosts = filteredPosts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[var(--color-light)] p-6 text-black relative">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">
        Pet Care Forum & Discussions
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm"
      >
        {showForm ? 'Hide Post Form' : '➕ New Post'}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
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
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({ ...newPost, category: e.target.value as Category })
                }
              >
                <option value="Nutrition">Nutrition</option>
                <option value="Training">Training</option>
                <option value="Health">Health</option>
              </select>
              <textarea
                rows={3}
                placeholder="Write your post..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
              <div className="flex items-center space-x-2 mb-4">
                <button
                  className="text-xl text-gray-500 hover:text-gray-700"
                  onClick={handleAttachFile}
                  title="Attach file"
                >
                  ➕
                </button>
                <span className="text-sm text-gray-500">Attach file</span>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostSubmit}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className="mb-4 space-x-2">
        {['All', 'Nutrition', 'Training', 'Health'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat as Category | 'All')}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              categoryFilter === cat
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
        {searchedPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-[var(--color-secondary)] text-sm font-semibold">
                {post.category}
              </div>
              <div className="text-xs text-gray-500">{post.timestamp}</div>
            </div>
            <h3 className="text-lg font-bold mt-1 text-[var(--color-primary)]">{post.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{post.content}</p>
            <div className="text-xs text-gray-500 mt-2">{`By ${post.author}`}</div>

            {/* Post Vote and Report */}
            <div className="flex items-center gap-4 text-sm mt-2">
              <button onClick={() => handleUpvotePost(post.id)} className="flex items-center gap-1 hover:opacity-70">
                <FaThumbsUp />
                {post.upvotes}
              </button>
              <button onClick={() => handleDownvotePost(post.id)} className="flex items-center gap-1 hover:opacity-70">
                <FaThumbsDown />
                {post.downvotes}
              </button>
              <button
                onClick={() => handleReportPost(post.id)}
                disabled={post.reported}
                className={`flex items-center gap-1 hover:opacity-70 ${post.reported ? 'text-red-500' : ''}`}
              >
                {post.reported ? 'Reported' : '⚠ Report'}
              </button>
            </div>

            {/* Post Replies */}
            <div className="mt-4">
              {post.replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 p-3 rounded-lg shadow-md mb-4">  {/* Added mb-4 for spacing between replies */}
                  <div className="text-[var(--color-secondary)] text-xs">{reply.timestamp}</div>
                  <div className="font-semibold">{reply.author}</div>
                  <p className="text-sm text-gray-700">{reply.content}</p>
                  <div className="flex items-center gap-2 text-xs mt-1 ml-2">
                    <button onClick={() => handleUpvoteReply(post.id, reply.id)} className="flex items-center gap-1 hover:opacity-70">
                      <FaThumbsUp />
                      {reply.upvotes}
                    </button>
                    <button onClick={() => handleDownvoteReply(post.id, reply.id)} className="flex items-center gap-1 hover:opacity-70">
                      <FaThumbsDown />
                      {reply.downvotes}
                    </button>
                    <button
                      onClick={() => handleReportReply(post.id, reply.id)}
                      disabled={reply.reported}
                      className={`hover:opacity-70 ${reply.reported ? 'text-red-500' : ''}`}
                    >
                      {reply.reported ? 'Reported' : '⚠ Report'}
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex items-center space-x-2">
                <textarea
                  placeholder="Write a reply..."
                   rows={1}
                  value={replyInputs[post.id] || ''}
                  onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  onClick={() => handleReplySubmit(post.id)}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 text-sm"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;