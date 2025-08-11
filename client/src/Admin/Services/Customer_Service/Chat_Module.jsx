import React, { useState, useEffect } from 'react';

function Chat_Module() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      user: 'Juan Dela Cruz',
      email: 'juan@email.com',
      subject: 'Seminar Registration Issue',
      message: 'I cannot register for the upcoming seminar about organic farming. The form keeps showing an error.',
      status: 'pending',
      priority: 'medium',
      date: '2025-08-11 09:30',
      category: 'Seminar',
      replies: [],
      assignedTo: null,
      resolvedBy: null,
      resolvedDate: null
    },
    {
      id: 2,
      user: 'Maria Santos',
      email: 'maria@email.com',
      subject: 'Equipment Request Problem',
      message: 'My equipment request for borrowing has been pending for 2 weeks. When will it be processed?',
      status: 'in-progress',
      priority: 'high',
      date: '2025-08-10 14:15',
      category: 'Equipment',
      assignedTo: 'Admin John Smith',
      resolvedBy: null,
      resolvedDate: null,
      replies: [
        {
          id: 1,
          sender: 'admin',
          senderName: 'Admin John Smith',
          message: 'Hello Maria, we are currently reviewing your request. It will be processed within 24 hours.',
          timestamp: '2025-08-11 08:00'
        }
      ]
    },
    {
      id: 3,
      user: 'Pedro Reyes',
      email: 'pedro@email.com',
      subject: 'Account Access Issue',
      message: 'I forgot my password and the reset email is not coming through. Please help.',
      status: 'resolved',
      priority: 'low',
      date: '2025-08-09 16:45',
      category: 'Account',
      assignedTo: 'Admin Sarah Wilson',
      resolvedBy: 'Admin Sarah Wilson',
      resolvedDate: '2025-08-09 17:30',
      replies: [
        {
          id: 1,
          sender: 'admin',
          senderName: 'Admin Sarah Wilson',
          message: 'Hi Pedro, I have reset your password. Please check your email for the new temporary password.',
          timestamp: '2025-08-09 17:00'
        },
        {
          id: 2,
          sender: 'user',
          senderName: 'Pedro Reyes',
          message: 'Thank you! I received the email and was able to log in successfully.',
          timestamp: '2025-08-09 17:15'
        },
        {
          id: 3,
          sender: 'admin',
          senderName: 'Admin Sarah Wilson',
          message: 'Great! Your issue has been resolved. Please don\'t hesitate to contact us if you need further assistance.',
          timestamp: '2025-08-09 17:20'
        }
      ]
    },
    {
      id: 4,
      user: 'Ana Garcia',
      email: 'ana@email.com',
      subject: 'Equipment Return Process',
      message: 'I need to return the borrowed equipment. What is the process and where should I return it?',
      status: 'resolved',
      priority: 'medium',
      date: '2025-08-08 10:20',
      category: 'Equipment',
      assignedTo: 'Admin Mike Torres',
      resolvedBy: 'Admin Mike Torres',
      resolvedDate: '2025-08-08 14:45',
      replies: [
        {
          id: 1,
          sender: 'admin',
          senderName: 'Admin Mike Torres',
          message: 'Hello Ana, please bring the equipment to the FITS office during business hours (8AM-5PM). Make sure to bring your borrowing receipt.',
          timestamp: '2025-08-08 11:00'
        },
        {
          id: 2,
          sender: 'user',
          senderName: 'Ana Garcia',
          message: 'Thank you for the information. I will return it tomorrow morning.',
          timestamp: '2025-08-08 11:30'
        },
        {
          id: 3,
          sender: 'admin',
          senderName: 'Admin Mike Torres',
          message: 'Perfect! Equipment has been successfully returned and checked. Thank you for using our services.',
          timestamp: '2025-08-08 14:40'
        }
      ]
    }
  ]);

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'How do I register for seminars?',
      answer: 'To register for seminars, go to the Seminar section in your dashboard, browse available seminars, and click "Register" on your preferred seminar.',
      category: 'Seminar',
      isActive: true,
      dateCreated: '2025-08-01'
    },
    {
      id: 2,
      question: 'How long does equipment borrowing approval take?',
      answer: 'Equipment borrowing requests are typically processed within 3-5 business days. You will receive an email notification once your request is approved or if additional information is needed.',
      category: 'Equipment',
      isActive: true,
      dateCreated: '2025-08-01'
    },
    {
      id: 3,
      question: 'What documents do I need for equipment requests?',
      answer: 'For equipment requests, you need: 1) Valid ID, 2) Certificate of registration (for farming), 3) Proof of address, 4) Equipment request form (available in the system).',
      category: 'Equipment',
      isActive: true,
      dateCreated: '2025-08-01'
    }
  ]);

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'General'
  });

  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inquiries based on status, category, and search term
  const activeInquiries = inquiries.filter(inquiry => inquiry.status !== 'resolved');
  const resolvedInquiries = inquiries.filter(inquiry => inquiry.status === 'resolved');
  
  const filteredActiveInquiries = activeInquiries.filter(inquiry => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || inquiry.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || inquiry.priority === filterPriority;
    const matchesSearch = inquiry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  const filteredResolvedInquiries = resolvedInquiries.filter(inquiry => {
    const matchesCategory = filterCategory === 'all' || inquiry.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || inquiry.priority === filterPriority;
    const matchesSearch = inquiry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const handleStatusChange = (inquiryId, newStatus) => {
    setInquiries(prev => 
      prev.map(inquiry => {
        if (inquiry.id === inquiryId) {
          const updatedInquiry = { ...inquiry, status: newStatus };
          
          // If marking as resolved, add resolved info
          if (newStatus === 'resolved') {
            updatedInquiry.resolvedBy = inquiry.assignedTo || 'Admin Current User';
            updatedInquiry.resolvedDate = new Date().toLocaleString();
          } else {
            // If changing from resolved to another status, clear resolved info
            updatedInquiry.resolvedBy = null;
            updatedInquiry.resolvedDate = null;
          }
          
          return updatedInquiry;
        }
        return inquiry;
      })
    );
  };

  const handlePriorityChange = (inquiryId, newPriority) => {
    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, priority: newPriority }
          : inquiry
      )
    );
    
    // Update selectedInquiry if it's the one being changed
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(prev => ({ ...prev, priority: newPriority }));
    }
  };

  const handleReply = (inquiryId) => {
    if (!replyMessage.trim()) return;

    const newReply = {
      id: Date.now(),
      sender: 'admin',
      senderName: 'Admin Current User', // In real app, get from user context
      message: replyMessage,
      timestamp: new Date().toLocaleString()
    };

    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { 
              ...inquiry, 
              replies: [...inquiry.replies, newReply],
              assignedTo: inquiry.assignedTo || 'Admin Current User' // Assign if not already assigned
            }
          : inquiry
      )
    );

    setReplyMessage('');
  };

  // New function to handle reply and start working (move to in-progress)
  const handleReplyAndStartWorking = (inquiryId) => {
    if (!replyMessage.trim()) return;

    const newReply = {
      id: Date.now(),
      sender: 'admin',
      senderName: 'Admin Current User', // In real app, get from user context
      message: replyMessage,
      timestamp: new Date().toLocaleString()
    };

    setInquiries(prev => 
      prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { 
              ...inquiry, 
              status: 'in-progress', // Change status to in-progress
              replies: [...inquiry.replies, newReply],
              assignedTo: 'Admin Current User' // Assign to current admin
            }
          : inquiry
      )
    );

    // Update selectedInquiry if it's the one being changed
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(prev => ({ 
        ...prev, 
        status: 'in-progress',
        replies: [...prev.replies, newReply],
        assignedTo: 'Admin Current User'
      }));
    }

    setReplyMessage('');
    
    // Optional: Switch to the In Progress tab to show the updated inquiry
    setActiveTab('inquiries');
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;

    const faq = {
      id: Date.now(),
      ...newFaq,
      isActive: true,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setFaqs(prev => [faq, ...prev]);
    setNewFaq({ question: '', answer: '', category: 'General' });
  };

  const toggleFaqStatus = (faqId) => {
    setFaqs(prev => 
      prev.map(faq => 
        faq.id === faqId ? { ...faq, isActive: !faq.isActive } : faq
      )
    );
  };

  const deleteFaq = (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(faq => faq.id !== faqId));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
    <div className="min-h-screen bg-white py-4 sm:mt-12 px-2 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header Section - reduced padding */}
        <div className="relative mb-4 mt-2 sm:mt-8 p-4 flex flex-col items-center justify-center max-w-5xl mx-auto gap-2 text-center">
          <span className="inline-flex items-center justify-center gap-3 w-full">
            <span className="rounded-full bg-green-50 p-2 border border-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Customer Service Management
            </span>
          </span>
          <span className="block text-sm md:text-base text-gray-600 font-medium mt-1">
            Manage user inquiries, support tickets, and frequently asked questions.
          </span>
        </div>

        {/* Statistics Cards - 60-30-10 color scheme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.filter(i => i.status === 'pending').length}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries.filter(i => i.status === 'in-progress').length}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedInquiries.length}</p>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active FAQs</p>
                <p className="text-2xl font-bold text-gray-900">{faqs.filter(f => f.isActive).length}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation - Separated Pending from Active */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 min-w-0 px-4 sm:px-6 py-4 font-medium transition-all duration-200 relative ${
                activeTab === 'pending'
                  ? 'text-gray-900 bg-gray-50 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">Pending</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {inquiries.filter(i => i.status === 'pending').length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex-1 min-w-0 px-4 sm:px-6 py-4 font-medium transition-all duration-200 relative ${
                activeTab === 'inquiries'
                  ? 'text-gray-900 bg-gray-50 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">In Progress</span>
                <span className="sm:hidden">Active</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {inquiries.filter(i => i.status === 'in-progress').length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 min-w-0 px-4 sm:px-6 py-4 font-medium transition-all duration-200 relative ${
                activeTab === 'resolved'
                  ? 'text-gray-900 bg-gray-50 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">Resolved</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {resolvedInquiries.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex-1 min-w-0 px-4 sm:px-6 py-4 font-medium transition-all duration-200 relative ${
                activeTab === 'faqs'
                  ? 'text-gray-900 bg-gray-50 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">FAQ Management</span>
                <span className="sm:hidden">FAQs</span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {faqs.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Pending Messages Tab */}
        {activeTab === 'pending' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Pending Inquiry List */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search pending messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filters for Pending */}
                <div className="px-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Account">Account</option>
                      <option value="General">General</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Pending Inquiry Cards */}
                <div className="max-h-[600px] overflow-y-auto">
                  {inquiries.filter(inquiry => inquiry.status === 'pending').map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`p-4 sm:p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                        selectedInquiry?.id === inquiry.id ? 'bg-gray-50 border-l-4 border-l-green-600 shadow-sm' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{inquiry.subject}</h3>
                            <div className="flex gap-1 flex-wrap">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                PENDING
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                                {inquiry.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">From: {inquiry.user} ({inquiry.email})</p>
                          <p className="text-gray-700 text-sm line-clamp-2">{inquiry.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-gray-500">{inquiry.date}</span>
                          <span className="text-xs text-gray-500">#{inquiry.id}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {inquiry.category}
                        </span>
                        {inquiry.replies && inquiry.replies.length > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {inquiry.replies.length} replies
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {inquiries.filter(inquiry => inquiry.status === 'pending').length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-600 mb-1">No pending messages</p>
                      <p className="text-sm text-gray-400">All inquiries have been addressed</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Inquiry Details - Same as other tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4">
                {selectedInquiry ? (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{selectedInquiry.subject}</h3>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                            {selectedInquiry.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedInquiry.priority)}`}>
                            {selectedInquiry.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reply Interface for Pending */}
                    <div className="mb-6 space-y-3">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Reply to Customer
                        </h4>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply to start working on this inquiry..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400 min-h-[100px] resize-none"
                        />
                        <button
                          onClick={() => handleReplyAndStartWorking(selectedInquiry.id)}
                          disabled={!replyMessage.trim()}
                          className="w-full mt-3 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Send Reply & Start Working
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <select
                          value={selectedInquiry.priority}
                          onChange={(e) => handlePriorityChange(selectedInquiry.id, e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.user}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Original Message
                      </h4>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200">
                        {selectedInquiry.message}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-1">Select a pending message</p>
                    <p className="text-sm text-gray-400">Click on any pending inquiry to view details and take action</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Active Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Inquiry List */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search in-progress inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="px-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                    
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Account">Account</option>
                      <option value="General">General</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Enhanced Inquiry Cards - In Progress Only */}
                <div className="max-h-[600px] overflow-y-auto">
                  {inquiries.filter(inquiry => inquiry.status === 'in-progress').map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`p-4 sm:p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                        selectedInquiry?.id === inquiry.id ? 'bg-gray-50 border-l-4 border-l-green-600 shadow-sm' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{inquiry.subject}</h3>
                            <div className="flex gap-1 flex-wrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                {inquiry.status.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                                {inquiry.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="font-medium text-gray-800 truncate">{inquiry.user}</span>
                            </div>
                            <span className="hidden sm:inline text-gray-400">•</span>
                            <span className="text-gray-500 truncate">{inquiry.email}</span>
                          </div>
                          {inquiry.assignedTo && (
                            <div className="flex items-center gap-2 text-xs text-green-600 mb-2">
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="truncate">Assigned to: {inquiry.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">{inquiry.message}</p>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {inquiry.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {inquiry.date}
                          </span>
                        </div>
                        {inquiry.replies.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{inquiry.replies.length} replies</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {inquiries.filter(inquiry => inquiry.status === 'in-progress').length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-600 mb-1">No active inquiries</p>
                      <p className="text-sm text-gray-400">Start working on pending messages to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Inquiry Details - 60-30-10 color scheme */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4">
                {selectedInquiry ? (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{selectedInquiry.subject}</h3>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                            {selectedInquiry.status.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedInquiry.priority)}`}>
                            {selectedInquiry.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6 space-y-3">
                      {selectedInquiry.replies.length > 0 && (
                        <button
                          onClick={() => setShowConversationModal(true)}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          View Full Conversation
                        </button>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedInquiry.status}
                          onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        
                        <select
                          value={selectedInquiry.priority}
                          onChange={(e) => handlePriorityChange(selectedInquiry.id, e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all duration-200"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.user}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">{selectedInquiry.date}</span>
                        </div>
                        {selectedInquiry.assignedTo && (
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Assigned to:</span>
                            <span className="font-medium text-green-600">{selectedInquiry.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Original Message */}
                    <div className="border-t border-gray-100 pt-4 mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Original Message
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-gray-700 leading-relaxed">{selectedInquiry.message}</p>
                      </div>
                    </div>

                    {/* Latest Messages Preview */}
                    {selectedInquiry.replies.length > 0 && (
                      <div className="border-t border-gray-100 pt-4 mb-6">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Latest Messages
                        </h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          {selectedInquiry.replies.slice(-2).map((reply) => (
                            <div key={reply.id} className={`p-3 rounded-xl text-sm border ${
                              reply.sender === 'admin' 
                                ? 'bg-gray-50 border-gray-200' 
                                : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`font-medium text-xs ${
                                  reply.sender === 'admin' ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  {reply.senderName || (reply.sender === 'admin' ? 'Admin' : 'User')}
                                </span>
                                <span className="text-xs text-gray-500">{reply.timestamp}</span>
                              </div>
                              <p className="text-gray-700 text-sm line-clamp-2">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                        {selectedInquiry.replies.length > 2 && (
                          <p className="text-xs text-gray-500 mt-3 text-center bg-gray-50 py-2 rounded-lg">
                            +{selectedInquiry.replies.length - 2} more messages (view full conversation)
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quick Reply Form */}
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Quick Reply
                      </h4>
                      <div className="space-y-3">
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-200"
                        />
                        <button
                          onClick={() => handleReply(selectedInquiry.id)}
                          disabled={!replyMessage.trim()}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-1">Select an inquiry</p>
                    <p className="text-sm text-gray-400">Choose an inquiry from the list to view details and manage responses</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resolved Inquiries Tab */}
        {activeTab === 'resolved' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Resolved Inquiry List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search resolved inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="px-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Account">Account</option>
                      <option value="General">General</option>
                    </select>
                    
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-sm text-gray-700"
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Resolved Inquiry Cards */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredResolvedInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedInquiry?.id === inquiry.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 truncate">{inquiry.subject}</h3>
                          <p className="text-gray-600 text-sm">by {inquiry.user}</p>
                          <p className="text-green-600 text-xs">Resolved by: {inquiry.resolvedBy}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                            resolved
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                            {inquiry.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm truncate mb-2">{inquiry.message}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{inquiry.category}</span>
                        <span>Resolved: {inquiry.resolvedDate}</span>
                      </div>
                    </div>
                  ))}
                  {filteredResolvedInquiries.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <i className="fas fa-check-circle text-4xl mb-4"></i>
                      <p>No resolved inquiries found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolved Inquiry Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {selectedInquiry ? (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{selectedInquiry.subject}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                        Resolved
                      </span>
                    </div>

                    {/* View Conversation Button */}
                    {selectedInquiry.replies.length > 0 && (
                      <button
                        onClick={() => setShowConversationModal(true)}
                        className="w-full mb-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <i className="fas fa-comments mr-2"></i>
                        View Full Conversation
                      </button>
                    )}

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-gray-600 text-sm">From:</span>
                        <p className="font-medium">{selectedInquiry.user}</p>
                        <p className="text-gray-600 text-sm">{selectedInquiry.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Category:</span>
                        <p className="font-medium">{selectedInquiry.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Priority:</span>
                        <select
                          value={selectedInquiry.priority}
                          onChange={(e) => handlePriorityChange(selectedInquiry.id, e.target.value)}
                          className="ml-2 px-2 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Created:</span>
                        <p className="font-medium">{selectedInquiry.date}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="text-gray-600 text-sm">Resolved by:</span>
                        <p className="font-medium text-green-600">{selectedInquiry.resolvedBy}</p>
                        <span className="text-gray-600 text-sm">Resolved on:</span>
                        <p className="text-green-600 text-sm">{selectedInquiry.resolvedDate}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold mb-2">Original Message:</h4>
                      <p className="text-gray-700">{selectedInquiry.message}</p>
                    </div>

                    {/* Last Messages Preview */}
                    {selectedInquiry.replies.length > 0 && (
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-semibold mb-2">Latest Messages:</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {selectedInquiry.replies.slice(-2).map((reply) => (
                            <div key={reply.id} className={`p-2 rounded text-sm ${
                              reply.sender === 'admin' ? 'bg-blue-50 border-l-2 border-blue-500' : 'bg-gray-50 border-l-2 border-gray-400'
                            }`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className={`font-medium text-xs ${
                                  reply.sender === 'admin' ? 'text-blue-600' : 'text-gray-600'
                                }`}>
                                  {reply.senderName || (reply.sender === 'admin' ? 'Admin' : 'User')}
                                </span>
                                <span className="text-xs text-gray-500">{reply.timestamp}</span>
                              </div>
                              <p className="text-gray-700 text-xs truncate">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                        {selectedInquiry.replies.length > 2 && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            +{selectedInquiry.replies.length - 2} more messages
                          </p>
                        )}
                      </div>
                    )}

                    {/* Reopen Option */}
                    <div className="border-t pt-4">
                      <button
                        onClick={() => handleStatusChange(selectedInquiry.id, 'in-progress')}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
                      >
                        <i className="fas fa-redo mr-2"></i>
                        Reopen Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <i className="fas fa-mouse-pointer text-4xl mb-4"></i>
                    <p>Select a resolved inquiry to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced FAQ Tab - 60-30-10 Color Scheme */}
        {activeTab === 'faqs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Add New FAQ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-fit">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Add New FAQ
                </h3>
                <p className="text-gray-600 text-sm mt-1">Create frequently asked questions to help users</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newFaq.category}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700"
                  >
                    <option value="General">General</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Account">Account</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter the frequently asked question"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter the answer to this question"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all duration-200 bg-white text-gray-700"
                  />
                </div>
                
                <button
                  onClick={handleAddFaq}
                  disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Add FAQ
                </button>
              </div>
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  FAQ Management
                </h3>
                <p className="text-gray-600 text-sm mt-1">Manage your frequently asked questions</p>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-5 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                            {faq.category}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            faq.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{faq.question}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          Created: {faq.dateCreated}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleFaqStatus(faq.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            faq.isActive 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {faq.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {faqs.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-1">No FAQs found</p>
                    <p className="text-sm text-gray-400">Start by adding your first frequently asked question</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Modal */}
      {showConversationModal && selectedInquiry && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999999] transition-all"
          onClick={() => setShowConversationModal(false)}
        >
          <div
            className="relative w-full h-full max-w-none max-h-none bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-none shadow-none flex flex-col
            sm:rounded-2xl sm:shadow-2xl sm:w-[98vw] sm:h-[96vh] md:w-[700px] md:h-[800px] md:max-w-[98vw] md:max-h-[98vh] transition-all border border-blue-200"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Inquiry Conversation"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white/30">
                      <i className="fas fa-user text-white text-lg"></i>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                      selectedInquiry.status === 'resolved' ? 'bg-green-400' : selectedInquiry.status === 'in-progress' ? 'bg-blue-400' : 'bg-orange-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedInquiry.subject}</h3>
                    <div className="flex items-center gap-2 text-blue-100">
                      <span className="text-sm">{selectedInquiry.user}</span>
                      <span className="text-xs">•</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                        {selectedInquiry.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowConversationModal(false)}
                  className="p-2 hover:bg-blue-700 rounded-full transition-colors duration-200"
                  aria-label="Close conversation"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #3b82f6;
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #2563eb;
                }
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #3b82f6 #f1f5f9;
                }
              `}</style>
              <div className="flex flex-col gap-4">
                {/* Original Message */}
                <div className="flex justify-start items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <div className="flex flex-col max-w-[75%]">
                    <div className="bg-white text-gray-800 rounded-lg rounded-bl-none border border-gray-200 px-4 py-2">
                      <div className="text-xs text-gray-500 mb-1">Original inquiry</div>
                      <p className="text-sm">{selectedInquiry.message}</p>
                    </div>
                    <span className="text-xs mt-1 text-gray-400">{selectedInquiry.date}</span>
                  </div>
                </div>

                {/* Conversation Messages */}
                {selectedInquiry.replies.map((reply, idx) => (
                  <div
                    key={reply.id}
                    className={`flex ${reply.sender === 'admin' ? 'justify-end' : 'justify-start'} items-start`}
                  >
                    {reply.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                        <i className="fas fa-user text-white text-sm"></i>
                      </div>
                    )}
                    <div className="flex flex-col max-w-[75%]">
                      <div
                        className={`px-4 py-2 rounded-lg text-sm ${
                          reply.sender === 'admin'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}
                        style={{ wordBreak: 'break-word' }}
                      >
                        <div className={`text-xs mb-1 ${reply.sender === 'admin' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {reply.senderName || (reply.sender === 'admin' ? 'Admin' : 'User')}
                        </div>
                        <p>{reply.message}</p>
                      </div>
                      <span className={`text-xs mt-1 ${reply.sender === 'admin' ? 'text-gray-500 text-right' : 'text-gray-400'}`}>
                        {reply.timestamp}
                      </span>
                    </div>
                    {reply.sender === 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-3">
                        <i className="fas fa-user-tie text-white text-sm"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reply Section (only for active inquiries) */}
            {selectedInquiry.status !== 'resolved' && (
              <form
                className="flex items-center gap-2 px-4 py-4 border-t border-gray-200 bg-white rounded-b-2xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (replyMessage.trim()) {
                    handleReply(selectedInquiry.id);
                  }
                }}
                autoComplete="off"
              >
                <input
                  type="text"
                  placeholder="Type your reply..."
                  className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  maxLength={500}
                  aria-label="Type your reply"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-full px-5 py-2 hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!replyMessage.trim()}
                  aria-label="Send reply"
                >
                  Send
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="flex items-center justify-center px-4 py-2 text-xs text-gray-400 bg-white rounded-b-2xl">
              <span>FITS-Tanza Customer Service</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Chat_Module;
