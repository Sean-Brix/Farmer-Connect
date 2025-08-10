import React, { useState, useEffect } from 'react';

function Chat_Module() {
  const [activeTab, setActiveTab] = useState('inquiries');
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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 sm:mt-20 px-2 md:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-comments text-blue-600 mr-3"></i>
                Customer Service Management
              </h1>
              <p className="text-gray-600 mt-2">Manage user inquiries and frequently asked questions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 px-4 py-2 rounded-lg">
                <span className="text-orange-600 font-semibold">{inquiries.filter(i => i.status === 'pending').length}</span>
                <span className="text-gray-600 ml-1">Pending</span>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">{inquiries.filter(i => i.status === 'in-progress').length}</span>
                <span className="text-gray-600 ml-1">In Progress</span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-600 font-semibold">{resolvedInquiries.length}</span>
                <span className="text-gray-600 ml-1">Resolved</span>
              </div>
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <span className="text-purple-600 font-semibold">{faqs.filter(f => f.isActive).length}</span>
                <span className="text-gray-600 ml-1">Active FAQs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'inquiries'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <i className="fas fa-inbox mr-2"></i>
              Active Inquiries ({activeInquiries.length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'resolved'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <i className="fas fa-check-circle mr-2"></i>
              Resolved ({resolvedInquiries.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'faqs'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <i className="fas fa-question-circle mr-2"></i>
              FAQ Management ({faqs.length})
            </button>
          </div>
        </div>

        {/* Active Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inquiry List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Search active inquiries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Inquiry Cards */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredActiveInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedInquiry?.id === inquiry.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 truncate">{inquiry.subject}</h3>
                          <p className="text-gray-600 text-sm">by {inquiry.user}</p>
                          {inquiry.assignedTo && (
                            <p className="text-blue-600 text-xs">Assigned to: {inquiry.assignedTo}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                            {inquiry.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm truncate mb-2">{inquiry.message}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{inquiry.category}</span>
                        <span>{inquiry.date}</span>
                      </div>
                    </div>
                  ))}
                  {filteredActiveInquiries.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <i className="fas fa-inbox text-4xl mb-4"></i>
                      <p>No active inquiries found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inquiry Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {selectedInquiry ? (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-800">{selectedInquiry.subject}</h3>
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
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
                          className="ml-2 px-2 py-1 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Date:</span>
                        <p className="font-medium">{selectedInquiry.date}</p>
                      </div>
                      {selectedInquiry.assignedTo && (
                        <div>
                          <span className="text-gray-600 text-sm">Assigned to:</span>
                          <p className="font-medium text-blue-600">{selectedInquiry.assignedTo}</p>
                        </div>
                      )}
                      {selectedInquiry.resolvedBy && selectedInquiry.resolvedDate && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <span className="text-gray-600 text-sm">Resolved by:</span>
                          <p className="font-medium text-green-600">{selectedInquiry.resolvedBy}</p>
                          <span className="text-gray-600 text-sm">Resolved on:</span>
                          <p className="text-green-600 text-sm">{selectedInquiry.resolvedDate}</p>
                        </div>
                      )}
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

                    {/* Reply Form */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Quick Reply:</h4>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                      <button
                        onClick={() => handleReply(selectedInquiry.id)}
                        disabled={!replyMessage.trim()}
                        className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <i className="fas fa-mouse-pointer text-4xl mb-4"></i>
                    <p>Select an inquiry to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Resolved Inquiries Tab */}
        {activeTab === 'resolved' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resolved Inquiry List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Search resolved inquiries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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

        {/* FAQ Tab */}
        {activeTab === 'faqs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New FAQ */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                <i className="fas fa-plus-circle text-blue-600 mr-2"></i>
                Add New FAQ
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newFaq.category}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Account">Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter the frequently asked question"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                  <textarea
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Enter the answer to this question"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleAddFaq}
                  disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add FAQ
                </button>
              </div>
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">
                  <i className="fas fa-list text-blue-600 mr-2"></i>
                  FAQ List
                </h3>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">
                            {faq.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            faq.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">{faq.question}</h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                      <div className="flex flex-col space-y-1 ml-4">
                        <button
                          onClick={() => toggleFaqStatus(faq.id)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            faq.isActive 
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {faq.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {faq.dateCreated}
                    </div>
                  </div>
                ))}
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
  );
}

export default Chat_Module;
