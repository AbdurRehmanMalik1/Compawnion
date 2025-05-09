import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';

type Sender = 'me' | 'other';

type Message = {
  id: number;
  sender: Sender;
  text: string;
  timestamp: string;
};

type Chat = {
  id: string;
  name: string;
  messages: Message[];
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

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setChats([
          {
            id: '1',
            name: 'Luna’s Owner',
            messages: [
              { id: 1, sender: 'other', text: 'Hi! Are you interested in Luna?', timestamp: '10:00 AM' },
              { id: 2, sender: 'me', text: 'Yes! She looks adorable. Is she still available?', timestamp: '10:05 AM' },
            ],
          },
          {
            id: '2',
            name: 'Shelter XYZ',
            messages: [
              { id: 1, sender: 'other', text: 'Please send the documents.', timestamp: '9:30 AM' },
              { id: 2, sender: 'me', text: 'Sure, I’ll send them tonight.', timestamp: '9:45 AM' },
            ],
          },
        ]);
        setActiveChatId('1');
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };
    fetchChats();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const message: Message = {
      id: activeChat.messages.length + 1,
      sender: 'me',
      text: newMessage.trim(),
      timestamp: getCurrentTime(),
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat.id ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    );
    setNewMessage('');
  };

  const handleAttachFile = () => alert('Attach file clicked!');
  const handleVoiceCall = () => alert('Voice call clicked!');
  const handleVideoCall = () => alert('Video call clicked!');

  return (
    <div className="h-screen flex bg-[var(--color-light)]">
      {/* Sidebar */}
      {(!isMobile || !activeChat) && (
        <div className="w-full md:w-1/3 bg-[var(--color-light)] text-black flex flex-col overflow-y-auto border-r border-gray-200">
          <div className="p-4 text-xl font-bold border-b border-gray-300 text-[var(--color-primary)]">
            💬 Chats
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer transition-colors duration-200 border-b border-gray-200 ${
                  chat.id === activeChatId ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <div className="w-10 h-10 bg-[var(--color-primary)] text-white flex items-center justify-center rounded-full mr-3 font-bold">
                  {chat.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--color-secondary)]">{chat.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.messages[chat.messages.length - 1]?.text}
                  </div>
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
                  onClick={() => setActiveChatId('')}
                  title="Back"
                >
                  ←
                </button>
              )}
              <h2 className="text-lg font-bold text-[var(--color-primary)]">
                {activeChat ? activeChat.name : 'Select a chat'}
              </h2>
            </div>

            {activeChat && (
            <div className="flex space-x-4 text-xl text-gray-500">
                <button onClick={handleVoiceCall} className="hover:text-gray-700" title="Voice Call">
                📞
                </button>
                <button onClick={handleVideoCall} className="hover:text-gray-700" title="Video Call">
                🎥
                </button>
            </div>
            )}

          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-light)]">
            {activeChat ? (
              <AnimatePresence initial={false}>
                {activeChat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-xs">
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm shadow ${
                          msg.sender === 'me'
                            ? 'bg-[var(--color-primary)] text-white rounded-br-none'
                            : 'bg-[var(--color-secondary)] text-white rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`text-xs text-gray-500 mt-1 ${
                          msg.sender === 'me' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {msg.timestamp}
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
              <button
                className="text-xl text-gray-500 hover:text-gray-700"
                onClick={handleAttachFile}
                title="Attach file"
              >
                ➕
              </button>
              <input
                type="text"
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button
                className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 transition"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
