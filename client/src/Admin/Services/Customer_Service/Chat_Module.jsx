import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../contexts/SocketContext.jsx';
import ChatMessage from './components/ChatMessage.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import InquiryListItem from './components/InquiryListItem.jsx';
import MessageInput from './components/MessageInput.jsx';
import DashboardStats from './components/DashboardStats.jsx';

function Chat_Module() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { socket, isConnected, connectSocket } = useSocket();

  // Connect socket as admin when component mounts
  useEffect(() => {
    if (!isConnected) {
      connectSocket('Admin');
    }
  }, [isConnected, connectSocket]);

  // Load existing inquiries from database
  useEffect(() => {
    if (isConnected && socket) {
      // Database is now ready - re-enabling database loading
      loadExistingInquiries();
    }
  }, [isConnected, socket]);

  const loadExistingInquiries = async () => {
    try {
      setLoading(true);
      // Database is now ready - using cookie-based authentication
      const response = await fetch('/api/inquiries/active', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const inquiries = await response.json();
        console.log('Loaded inquiries:', inquiries);
        setActiveChats(inquiries);
      } else {
        console.error('Failed to load inquiries:', response.statusText);
        setActiveChats([]);
      }
    } catch (error) {
      console.error('Error loading inquiries:', error);
      setActiveChats([]);
    } finally {
      setLoading(false);
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new chat messages
    socket.on('chat_message_received', (data) => {
      console.log('New message received:', data);
      console.log('Current socket ID:', socket.id);
      console.log('Message socket ID:', data.socketId);
      
      // Don't process messages from the same socket (prevents self-messages)
      if (data.socketId === socket.id) {
        console.log('Skipping message from same socket');
        return;
      }
      
      // Find or create chat room using inquiry ID if available
      setActiveChats(prev => {
        const existingChatIndex = prev.findIndex(chat => 
          chat.userId === data.userId || (data.inquiryId && chat.inquiryId === data.inquiryId)
        );
        
        if (existingChatIndex >= 0) {
          // Update existing chat
          const updatedChats = [...prev];
          const existingChat = updatedChats[existingChatIndex];
          
          // Check if this message already exists (prevent duplicates)
          const messageExists = existingChat.replies && existingChat.replies.some(msg => 
            (msg.message === data.message && 
             msg.senderType === (data.mode === 'admin' ? 'ADMIN' : 'USER') &&
             Math.abs(new Date(msg.createdAt) - new Date(data.timestamp)) < 10000) // Within 10 seconds
          );
          
          console.log('Message exists check:', messageExists, 'for message:', data.message);
          
          if (!messageExists) {
            const updatedChat = {
              ...existingChat,
              inquiryId: data.inquiryId || existingChat.inquiryId,
              lastMessage: data.message,
              lastMessageTime: data.timestamp,
              replies: [
                ...(existingChat.replies || []), 
                {
                  id: `${data.userId}-${data.timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                  message: data.message,
                  createdAt: data.timestamp,
                  senderType: data.mode === 'admin' ? 'ADMIN' : 'USER'
                }
              ],
              isOnline: true
            };
            updatedChats[existingChatIndex] = updatedChat;
            
            // Update selectedChat if it's the same chat - but don't duplicate the message
            setSelectedChat(currentSelected => {
              if (currentSelected && (
                currentSelected.userId === data.userId || 
                (data.inquiryId && currentSelected.inquiryId === data.inquiryId)
              )) {
                console.log('Updating selectedChat with new message - avoiding duplication');
                // Return the updated chat from updatedChats to avoid duplication
                return updatedChat;
              }
              return currentSelected;
            });
          }
          
          // Move to top of list
          const reorderedChats = [...updatedChats];
          const chatToMove = reorderedChats.splice(existingChatIndex, 1)[0];
          return [chatToMove, ...reorderedChats];
        } else {
          // Create new chat
          const newChat = {
            id: `chat-${data.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            inquiryId: data.inquiryId,
            userId: data.userId,
            userName: data.userName || `User ${data.userId}`,
            userEmail: data.userEmail || 'user@email.com',
            status: 'active',
            lastMessage: data.message,
            lastMessageTime: data.timestamp,
            isOnline: true,
            message: data.message, // Initial message
            replies: [] // Start with empty replies
          };
          return [newChat, ...prev];
        }
      });
    });

    // Listen for user connection status
    socket.on('user_connected', (data) => {
      console.log('User connected:', data);
      setActiveChats(prev => 
        prev.map(chat => 
          chat.userId === data.userId 
            ? { ...chat, isOnline: true }
            : chat
        )
      );
    });

    socket.on('user_disconnected', (data) => {
      console.log('User disconnected:', data);
      setActiveChats(prev => 
        prev.map(chat => 
          chat.userId === data.userId 
            ? { ...chat, isOnline: false }
            : chat
        )
      );
    });

    return () => {
      socket.off('chat_message_received');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, [socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.replies]);

  // Sync selectedChat with activeChats to prevent state inconsistencies
  useEffect(() => {
    if (selectedChat && activeChats.length > 0) {
      const syncedChat = syncSelectedChatWithActiveChats(activeChats, selectedChat);
      if (syncedChat !== selectedChat) {
        console.log('Syncing selectedChat with activeChats to prevent duplication');
        setSelectedChat(syncedChat);
      }
    }
  }, [activeChats]);

  // Handle sending message
  const handleSendMessage = (messageText) => {
    if (!messageText.trim() || !selectedChat) return;

    // Emit to server
    socket.emit('admin_reply', {
      userId: selectedChat.userId,
      inquiryId: selectedChat.inquiryId,
      message: messageText,
      timestamp: new Date()
    });

    // Update local state
    setActiveChats(prev => 
      prev.map(chat => 
        chat.id === selectedChat.id
          ? {
              ...chat,
              lastMessage: messageText,
              lastMessageTime: new Date(),
              replies: [
                ...(chat.replies || []), 
                {
                  id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  message: messageText,
                  createdAt: new Date().toISOString(),
                  senderType: 'ADMIN'
                }
              ]
            }
          : chat
      )
    );

    // Update selectedChat to match the activeChats update - avoid duplication
    setSelectedChat(prev => {
      const updatedChat = {
        ...prev,
        lastMessage: messageText,
        lastMessageTime: new Date(),
        replies: [
          ...(prev.replies || []), 
          {
            id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message: messageText,
            createdAt: new Date().toISOString(),
            senderType: 'ADMIN'
          }
        ]
      };
      return updatedChat;
    });
  };

  // Helper function to get user name from chat data
  const getUserName = (chat) => {
    return chat.user ? `${chat.user.firstName} ${chat.user.surname}` : (chat.guestName || 'Unknown User');
  };

  // Helper function to sync selectedChat with activeChats to prevent duplication
  const syncSelectedChatWithActiveChats = (activeChats, currentSelectedChat) => {
    if (!currentSelectedChat) return null;
    
    // Find the matching chat in activeChats
    const matchingChat = activeChats.find(chat => 
      chat.id === currentSelectedChat.id || 
      chat.userId === currentSelectedChat.userId ||
      (chat.inquiryId && currentSelectedChat.inquiryId && chat.inquiryId === currentSelectedChat.inquiryId)
    );
    
    return matchingChat || currentSelectedChat;
  };

  // Helper function to get last message from chat data
  const getLastMessage = (chat) => {
    return chat.replies && chat.replies.length > 0 
      ? chat.replies[chat.replies.length - 1].message 
      : chat.message || '';
  };

  // Filter chats based on search
  const filteredChats = activeChats.filter(chat => {
    const userName = getUserName(chat);
    const lastMessage = getLastMessage(chat);
    
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (chat.subject && chat.subject.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:mt-12 px-2 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-4 mt-2 sm:mt-8 p-4 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
          <span className="inline-flex items-center justify-center gap-3 w-full">
            <span className="rounded-full bg-green-50 p-2 border border-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Customer Support Chat
            </span>
          </span>
          <span className="block text-sm md:text-base text-gray-600 font-medium mt-1">
            Real-time messaging with customers • {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats activeChats={activeChats} />

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Active Chats */}
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-1">Loading inquiries...</p>
                    <p className="text-sm text-gray-400">Please wait while we fetch your chat history</p>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-1">No active chats</p>
                    <p className="text-sm text-gray-400">Waiting for customer messages...</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <InquiryListItem 
                      key={chat.id}
                      chat={chat}
                      isSelected={selectedChat?.id === chat.id}
                      onClick={() => setSelectedChat(chat)}
                      getUserName={getUserName}
                      getLastMessage={getLastMessage}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <ChatWindow 
              selectedChat={selectedChat}
              getUserName={getUserName}
              messagesEndRef={messagesEndRef}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat_Module;
