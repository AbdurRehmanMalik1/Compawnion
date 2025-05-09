import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'Nutrition' | 'Training' | 'Health';

type Reply = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

type ForumPost = {
  id: number;
  category: Category;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  replies: Reply[];
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
      replies: [
        {
          id: 1,
          author: 'HealthyPaws',
          content: 'I recommend grain-free dry food with salmon!',
          timestamp: '9:15 AM',
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
      replies: [
        {
          id: 2,
          author: 'ObedientPets',
          content: 'Try the “stop and wait” method – worked wonders for me!',
          timestamp: '10:45 AM',
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
      replies: [
        {
          id: 3,
          author: 'VetExpert',
          content: 'Core vaccines start at 6–8 weeks and continue every 3–4 weeks.',
          timestamp: '11:10 AM',
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
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, replies: [...post.replies, newReply] } : post
      )
    );

    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
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
            <div className="text-xs text-gray-500 mt-1">By {post.author}</div>

            {/* Replies */}
            {post.replies.length > 0 && (
              <div className="mt-3 space-y-2">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="ml-4 p-2 border border-gray-100 rounded-xl bg-gray-50"
                  >
                    <div className="text-sm text-gray-700">
                      <strong>{reply.author}:</strong> {reply.content}
                    </div>
                    <div className="text-xs text-gray-400">{reply.timestamp}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="mt-3 flex items-center gap-2 ml-4">
              <input
                type="text"
                placeholder="Write a reply..."
                className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                value={replyInputs[post.id] || ''}
                onChange={(e) =>
                  setReplyInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleReplySubmit(post.id);
                }}
              />
              <button
                className="text-xl text-gray-500 hover:text-gray-700"
                onClick={handleAttachFile}
                title="Attach file"
              >
                ➕
              </button>
              <button
                className="text-sm bg-[var(--color-secondary)] text-white px-3 py-1 rounded-full hover:opacity-90 transition"
                onClick={() => handleReplySubmit(post.id)}
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
