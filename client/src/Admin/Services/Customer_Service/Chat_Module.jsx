import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../../contexts/SocketContext.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import InquiryListItem from './components/InquiryListItem.jsx';
import DashboardStats from './components/DashboardStats.jsx';

function Chat_Module() {
  // Three-tab lists
  const [pending, setPending] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING | IN_PROGRESS | RESOLVED
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const selectedChatRef = useRef(null);
  const activeTabRef = useRef(activeTab);

  const { socket, isConnected, connectSocket } = useSocket();
  const [toast, setToast] = useState(null); // {type,title,message,action}

  // Connect socket as admin when component mounts
  useEffect(() => {
    if (!isConnected) connectSocket('Admin');
  }, [isConnected, connectSocket]);

  // Keep refs in sync
  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  // Auto-hide toast after 4s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Load inquiries for tabs
  useEffect(() => {
    if (isConnected && socket) loadTabs();
  }, [isConnected, socket]);

  const fetchByStatus = async (status) => {
    const res = await fetch(`/api/inquiries/by-status?status=${status}`, { credentials: 'include' });
    if (!res.ok) return { items: [] };
    return res.json();
  };

  const loadTabs = async () => {
    try {
      setLoading(true);
      const [p, ip, r] = await Promise.all([
        fetchByStatus('PENDING'),
        fetchByStatus('IN_PROGRESS'),
        fetchByStatus('RESOLVED'),
      ]);
      setPending(p.items || []);
      setInProgress(ip.items || []);
      setResolved(r.items || []);
    } catch (e) {
      console.error('Failed to load inquiry tabs', e);
      setPending([]); setInProgress([]); setResolved([]);
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const upsert = (list, item) => {
    const idx = list.findIndex(c => c.id === item.id);
    if (idx >= 0) {
      const copy = [...list];
      copy[idx] = { ...copy[idx], ...item };
      return copy;
    }
    return [item, ...list];
  };
  const removeFrom = (list, id) => list.filter(c => c.id !== id);

  const moveInquiry = (inquiryId, toStatus, patch = {}) => {
    const findIn = (list) => list.find(c => c.id === inquiryId || c.inquiryId === inquiryId);
    const found = findIn(pending) || findIn(inProgress) || findIn(resolved);
    if (!found) return;
    const id = found.id || found.inquiryId || inquiryId;
    const updated = { ...found, id, status: toStatus, ...patch };

    // Remove from all tabs first
    const newPending = removeFrom(pending, id);
    const newInProgress = removeFrom(inProgress, id);
    const newResolved = removeFrom(resolved, id);
    setPending(newPending);
    setInProgress(newInProgress);
    setResolved(newResolved);

    // Insert into the target tab
    if (toStatus === 'PENDING') setPending(prev => upsert(prev, updated));
    else if (toStatus === 'IN_PROGRESS') setInProgress(prev => upsert(prev, updated));
    else setResolved(prev => upsert(prev, updated));

    // Keep selected chat's message thread/details
    setSelectedChat(prev => {
      if (!prev) return prev;
      const matches = prev.id === id || prev.inquiryId === id;
      if (!matches) return prev;
      return {
        ...updated,
        replies: prev.replies || updated.replies || [],
        message: prev.message || updated.message,
        createdAt: prev.createdAt || updated.createdAt,
      };
    });
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // New user message
    socket.on('chat_message_received', (data) => {
      // Prevent echoes from the same socket if server broadcasts to all
      if (data?.socketId && socket?.id && data.socketId === socket.id) {
        return; // skip self-emitted broadcast
      }
      const inquiryId = data.inquiryId;
      const status = data.status || 'PENDING';
      const item = {
        id: inquiryId,
        inquiryId,
        userId: data.userId,
        user: { firstName: (data.userName || 'User').split(' ')[0], surname: (data.userName || '').split(' ').slice(1).join(' ') },
        userEmail: data.userEmail,
        subject: data.subject,
        message: data.message,
        createdAt: data.timestamp || new Date().toISOString(),
        lastMessage: data.message,
        lastMessageTime: data.timestamp,
        updatedAt: data.timestamp,
        status,
        isOnline: true,
      };
      if (status === 'IN_PROGRESS') setInProgress(prev => upsert(prev, item));
      else setPending(prev => upsert(prev, item));

      // If viewing the same inquiry, append incoming user message to the thread
      setSelectedChat(prev => {
        if (!prev) return prev;
        const matches = prev.id === inquiryId || prev.inquiryId === inquiryId;
        if (!matches) return prev;
        // Deduplicate by approximate time + same sender + same message
        const exists = (prev.replies || []).some(r => r.senderType === 'USER' && r.message === data.message && Math.abs(new Date(r.createdAt) - new Date(data.timestamp || Date.now())) < 5000);
        if (exists) return prev;
        const reply = {
          id: `${data.userId}-${data.timestamp || Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: data.message,
          createdAt: data.timestamp || new Date().toISOString(),
          senderType: 'USER'
        };
        return {
          ...prev,
          lastMessage: data.message,
          lastMessageTime: data.timestamp || new Date().toISOString(),
          updatedAt: data.timestamp || new Date().toISOString(),
          replies: [...(prev.replies || []), reply]
        };
      });
    });

    // New support request (ensure it's visible in PENDING)
    socket.on('admin_support_requested', (data) => {
      const inquiryId = data.inquiryId;
      const item = {
        id: inquiryId,
        inquiryId,
        userId: data.userId,
        user: { firstName: (data.userName || 'User').split(' ')[0], surname: (data.userName || '').split(' ').slice(1).join(' ') },
        userEmail: data.userEmail,
        subject: data.subject || `Support Request`,
        message: data.message,
        createdAt: data.timestamp || new Date().toISOString(),
        lastMessage: data.message,
        lastMessageTime: data.timestamp,
        updatedAt: data.timestamp,
        status: 'PENDING',
        isOnline: true,
      };
      setPending(prev => upsert(prev, item));
    });

    // Status change (e.g., admin first reply -> IN_PROGRESS, user resolve -> RESOLVED)
    socket.on('admin_inquiry:status_update', (payload) => {
      const { inquiryId, status, updatedAt } = payload || {};
      if (!inquiryId || !status) return;
      moveInquiry(inquiryId, status, { updatedAt, status });
      // If we're following this conversation, switch to its new status tab for continuity
      const current = selectedChatRef.current;
      if (current && (current.id === inquiryId || current.inquiryId === inquiryId)) {
        if (activeTabRef.current !== status) setActiveTab(status);
  // also update selectedChat status immediately
  setSelectedChat(prev => prev ? { ...prev, status, updatedAt } : prev);
      }
    });

    // Message preview update
    socket.on('admin_inquiry:message_update', (payload) => {
      const { inquiryId, lastMessage, timestamp } = payload || {};
      if (!inquiryId) return;
      // Only update existing items in-place to avoid moving items back to wrong tabs
      setPending(prev => prev.map(c => (c.id === inquiryId || c.inquiryId === inquiryId) ? { ...c, lastMessage, lastMessageTime: timestamp, updatedAt: timestamp } : c));
      setInProgress(prev => prev.map(c => (c.id === inquiryId || c.inquiryId === inquiryId) ? { ...c, lastMessage, lastMessageTime: timestamp, updatedAt: timestamp } : c));
      setResolved(prev => prev.map(c => (c.id === inquiryId || c.inquiryId === inquiryId) ? { ...c, lastMessage, lastMessageTime: timestamp, updatedAt: timestamp } : c));
      setSelectedChat(prev => (prev && (prev.id === inquiryId || prev.inquiryId === inquiryId) ? { ...prev, lastMessage, lastMessageTime: timestamp } : prev));
    });

    // Attachment uploaded by user
    socket.on('admin_inquiry:attachment', (payload) => {
      const { inquiryId, filename, filepath, streamUrl, filesize, mimetype } = payload || {};
      if (!inquiryId) return;
      const ts = new Date().toISOString();
      const preview = `📎 ${filename}`;
      setPending(prev => prev.map(c => (c.id === inquiryId || c.inquiryId === inquiryId) ? { ...c, lastMessage: preview, lastMessageTime: ts, updatedAt: ts } : c));
      setInProgress(prev => prev.map(c => (c.id === inquiryId || c.inquiryId === inquiryId) ? { ...c, lastMessage: preview, lastMessageTime: ts, updatedAt: ts } : c));
      setResolved(prev => prev.map(c => (c.id === inquiryId || c.inquiryId === inquiryId) ? { ...c, lastMessage: preview, lastMessageTime: ts, updatedAt: ts } : c));

      // If the chat is open, append a reply-like item that contains a direct link
      setSelectedChat(prev => {
        if (!prev) return prev;
        const matches = prev.id === inquiryId || prev.inquiryId === inquiryId;
        if (!matches) return prev;
        const att = {
          id: `temp-${Date.now()}`,
          filename,
          mimetype,
          streamUrl: streamUrl || filepath,
          filesize,
          uploadedById: prev.userId,
          createdAt: ts,
        };
        const prevAtts = Array.isArray(prev.attachments) ? prev.attachments : [];
        // Dedupe by streamUrl+filename
        const exists = prevAtts.some(a => (a.streamUrl || a.filepath) === att.streamUrl && (a.filename || '') === (filename || ''));
        const nextAtts = exists ? prevAtts : [...prevAtts, att];
        return { ...prev, attachments: nextAtts, lastMessage: preview, lastMessageTime: ts, updatedAt: ts };
      });
    });

    // User requested to resolve
    socket.on('admin_inquiry:resolve_request', (payload) => {
      const { inquiryId, userName } = payload || {};
      if (!inquiryId) return;
      const chat = [
        ...pending,
        ...inProgress,
        ...resolved
      ].find(c => c.id === inquiryId || c.inquiryId === inquiryId);
      const label = chat ? (chat.subject || 'Inquiry') : `Inquiry ${inquiryId}`;
      setToast({
        type: 'info',
        title: 'User marked conversation as resolved',
        message: `${userName || 'User'} wants to resolve: ${label}`,
      });
    });

    // Listen for user connection status
    socket.on('user_connected', (data) => {
      console.log('User connected:', data);
      setPending(prev => prev.map(chat => chat.userId === data.userId ? { ...chat, isOnline: true } : chat));
      setInProgress(prev => prev.map(chat => chat.userId === data.userId ? { ...chat, isOnline: true } : chat));
    });

    socket.on('user_disconnected', (data) => {
      console.log('User disconnected:', data);
      setPending(prev => prev.map(chat => chat.userId === data.userId ? { ...chat, isOnline: false } : chat));
      setInProgress(prev => prev.map(chat => chat.userId === data.userId ? { ...chat, isOnline: false } : chat));
    });

    return () => {
      socket.off('chat_message_received');
      socket.off('admin_support_requested');
      socket.off('admin_inquiry:status_update');
      socket.off('admin_inquiry:message_update');
  socket.off('admin_inquiry:attachment');
  socket.off('admin_inquiry:resolve_request');
      socket.off('user_connected');
      socket.off('user_disconnected');
    };
  }, [socket]);

  // Auto-scroll to top when a new conversation is selected
  useEffect(() => {
    if (selectedChat) {
      // Scroll the entire page/screen to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Also scroll the messages container to top
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = 0;
      }
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when replies change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.replies]);

  // Sync selectedChat with any list to prevent state inconsistencies
  useEffect(() => {
    if (!selectedChat) return;
    const lists = [...pending, ...inProgress, ...resolved];
    const match = lists.find(chat => chat.id === selectedChat.id || (chat.inquiryId && selectedChat.inquiryId && chat.inquiryId === selectedChat.inquiryId));
    if (match) {
      setSelectedChat(prev => {
        if (!prev) return match;
        // Prefer list with more replies
        const prevRepliesLen = Array.isArray(prev.replies) ? prev.replies.length : 0;
        const matchRepliesLen = Array.isArray(match.replies) ? match.replies.length : 0;
        const replies = matchRepliesLen >= prevRepliesLen ? (match.replies || prev.replies) : prev.replies;
        return {
          ...prev,
          ...match,
          replies,
          message: prev.message || match.message,
          createdAt: prev.createdAt || match.createdAt,
        };
      });
    }
  }, [pending, inProgress, resolved]);

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

    // Optimistic preview + move to IN_PROGRESS and append replies locally
    const id = selectedChat.id || selectedChat.inquiryId;
    const nowIso = new Date().toISOString();
    const reply = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: messageText,
      createdAt: nowIso,
      senderType: 'ADMIN'
    };

    setSelectedChat(prev => ({
      ...prev,
      replies: [...(prev?.replies || []), reply],
      lastMessage: messageText,
      lastMessageTime: nowIso,
      status: 'IN_PROGRESS'
    }));

    moveInquiry(id, 'IN_PROGRESS', { lastMessage: messageText, lastMessageTime: nowIso, updatedAt: nowIso });

    // Follow the conversation into In Progress
    if (activeTabRef.current !== 'IN_PROGRESS') setActiveTab('IN_PROGRESS');
  };

  // Helper function to get user name from chat data
  const getUserName = (chat) => {
    return chat.user ? `${chat.user.firstName} ${chat.user.surname}` : (chat.guestName || 'Unknown User');
  };

  // Helper function to get last message from chat data
  const getLastMessage = (chat) => {
    if (chat && Array.isArray(chat.replies) && chat.replies.length > 0) {
      return chat.replies[chat.replies.length - 1].message || '';
    }
    return chat.lastMessage || chat.message || '';
  };

  // Derived lists
  const currentList = activeTab === 'PENDING' ? pending : activeTab === 'IN_PROGRESS' ? inProgress : resolved;
  const filteredChats = currentList.filter(chat => {
    const userName = getUserName(chat);
    const lastMessage = getLastMessage(chat);
    const subject = (chat.subject || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return userName.toLowerCase().includes(term) || lastMessage.toLowerCase().includes(term) || subject.includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:mt-12 px-2 md:px-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100000] px-4 py-3 rounded-xl shadow-xl border ${toast.type==='info' ? 'bg-green-50 border-green-200 text-green-900' : 'bg-white border-gray-200 text-gray-800'}`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
            </div>
            <div>
              <div className="font-semibold text-sm">{toast.title}</div>
              {toast.message && <div className="text-xs mt-0.5 opacity-90 max-w-xs">{toast.message}</div>}
            </div>
            <button className="ml-2 text-xs opacity-70 hover:opacity-100 transition-opacity" onClick={() => setToast(null)}>Dismiss</button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-6 mt-2 sm:mt-8 flex flex-col items-center justify-center max-w-5xl mx-auto gap-3 text-center">
          <span className="inline-flex items-center justify-center gap-4 w-full">
            <span className="rounded-full bg-green-100 p-3 border border-green-200 shadow-sm">
              <svg className="w-10 h-10 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">Customer Support Chat</span>
          </span>
          <span className="block text-sm md:text-lg text-gray-600 font-medium">
            Real-time messaging with customers • 
            <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </span>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats activeChats={[...pending, ...inProgress]} />

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[700px] flex flex-col">
              {/* Tabs */}
              <div className="bg-gray-50 px-6 pt-6 pb-2 border-b border-gray-200 flex-shrink-0">
                <div className="grid grid-cols-3 gap-3">
                  {['PENDING','IN_PROGRESS','RESOLVED'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative text-sm px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                        activeTab===tab 
                          ? 'bg-green-600 text-white shadow-lg' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <span className="block">{tab.replace('_',' ')}</span>
                      <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-bold ${
                        activeTab===tab ? 'bg-white text-green-600' : 'bg-gray-900 text-white'
                      }`}>
                        {tab==='PENDING'? pending.length : tab==='IN_PROGRESS'? inProgress.length : resolved.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-6 bg-white border-b border-gray-200 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 font-medium"
                  />
                </div>
              </div>

              {/* Active Chats */}
              <div className="flex-1 overflow-y-auto bg-white">
                {loading ? (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">Loading inquiries...</p>
                    <p className="text-sm text-gray-500">Please wait while we fetch your chat history</p>
                  </div>
                ) : (
                  filteredChats.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-xl font-semibold text-gray-800 mb-2">No active chats</p>
                      <p className="text-sm text-gray-500">Waiting for customer messages...</p>
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
                  )
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-1">
            <ChatWindow
              selectedChat={selectedChat}
              getUserName={getUserName}
              messagesEndRef={messagesEndRef}
              messagesContainerRef={messagesContainerRef}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat_Module;
