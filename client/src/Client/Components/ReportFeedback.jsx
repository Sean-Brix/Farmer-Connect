import React, { useState } from 'react';

/**
 * ReportFeedback Component
 * Displays feedback/comments on a farmer's report
 * Allows farmers and admins to have threaded conversations
 */
export default function ReportFeedback({ 
  feedback = [], 
  reportId,
  currentUserId,
  currentUserAccess,
  onSubmitFeedback,
  theme = 'light'
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (parentId = null) => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback({
        reportId,
        authorId: currentUserId,
        message: newMessage.trim(),
        parentId
      });
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMessage = (msg, isReply = false) => {
    const isAdmin = msg.author?.access === 'Admin' || msg.author?.access === 'Super_Admin';
    const isCurrentUser = msg.author?.id === currentUserId;

    return (
      <div 
        key={msg.id}
        className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        } rounded-lg p-4 border-l-4 ${
          isAdmin 
            ? 'border-blue-500' 
            : 'border-green-500'
        }`}
      >
        {/* Author Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isAdmin 
                ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
            }`}>
              {isAdmin ? '👨‍💼' : '👨‍🌾'}
            </div>
            <div>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {msg.author?.firstName} {msg.author?.surname}
                {isAdmin && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-500 text-white">Admin</span>}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <p className={`text-sm mb-2 whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          {msg.message}
        </p>

        {/* Reply Button */}
        {!isReply && (
          <button
            onClick={() => setReplyingTo(msg.id)}
            className={`text-xs font-semibold ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Reply
          </button>
        )}

        {/* Reply Form */}
        {replyingTo === msg.id && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your reply..."
              rows="2"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSubmit(msg.id)}
                disabled={isSubmitting || !newMessage.trim()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Reply'}
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setNewMessage('');
                }}
                className={`px-3 py-1 text-sm rounded ${
                  theme === 'dark' ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Render Replies */}
        {msg.replies && msg.replies.length > 0 && (
          <div className="mt-2">
            {msg.replies.map(reply => renderMessage(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-xl border ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } p-6`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
          <span className="text-white text-lg">💬</span>
        </div>
        <div>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Feedback & Discussion
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {feedback.length} {feedback.length === 1 ? 'comment' : 'comments'}
          </p>
        </div>
      </div>

      {/* New Comment Form (only shown if not replying) */}
      {!replyingTo && (
        <div className="mb-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={currentUserAccess === 'Admin' || currentUserAccess === 'Super_Admin' 
              ? "Add feedback for the farmer..." 
              : "Ask a question or add a note..."}
            rows="3"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleSubmit(null)}
              disabled={isSubmitting || !newMessage.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      )}

      {/* Feedback List */}
      {feedback.length === 0 ? (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-4xl mb-2">💭</div>
          <p className="text-sm">No feedback yet. Be the first to comment!</p>
        </div>
      ) : (
        <div>
          {feedback.map(msg => renderMessage(msg, false))}
        </div>
      )}
    </div>
  );
}
