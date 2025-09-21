import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage, onSendAttachment, selectedChat, onError }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!message.trim() && attachments.length === 0) || !selectedChat) return;

    setUploading(true);

    try {
      // Send text message first if present
      if (message.trim()) {
        onSendMessage(message);
        setMessage('');
      }

      // Send attachments if present
      if (attachments.length > 0 && onSendAttachment) {
        await onSendAttachment(attachments);
        setAttachments([]);
      }
    } catch (error) {
      console.error('Failed to send:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Same validation as client-side
    const allowed = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
    const maxBytes = 3 * 1024 * 1024; // 3MB limit like client
    const validFiles = [];
    
    for (const file of files) {
      if (!allowed.includes(file.type)) {
        // Show error toast for invalid file type
        if (onError) {
          onError({
            type: 'error',
            title: 'Unsupported file type',
            message: `${file.name}: Please upload JPG, PNG, WEBP, GIF, or PDF.`
          });
        }
        continue;
      }
      if (file.size > maxBytes) {
        const mb = (file.size / (1024*1024)).toFixed(2);
        if (onError) {
          onError({
            type: 'error',
            title: 'Attachment too large',
            message: `${file.name} is ${mb} MB. Maximum allowed is 3 MB.`
          });
        }
        continue;
      }
      validFiles.push(file);
    }

    // Merge with existing; cap at 10 files like client
    setAttachments(prev => {
      const merged = [...prev, ...validFiles];
      return merged.slice(0, 10);
    });
    
    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };



  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white border-t-2 border-gray-200 px-6 py-5 rounded-b-2xl">
      {/* Attachment Preview - Client-side style */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => {
            const isImg = file.type.startsWith('image/');
            const url = isImg ? URL.createObjectURL(file) : null;
            return (
              <div key={index} className="relative group border border-slate-200 rounded-xl p-1 bg-slate-50">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                  {isImg ? (
                    <img 
                      src={url} 
                      alt={file.name} 
                      className="object-cover w-full h-full" 
                      onLoad={() => url && URL.revokeObjectURL(url)} 
                    />
                  ) : (
                    <div className="text-xs text-slate-600 p-2 text-center">
                      <div className="font-medium truncate w-14" title={file.name}>{file.name}</div>
                      <div className="text-[10px] mt-1">{Math.ceil(file.size/1024)} KB</div>
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => removeAttachment(index)} 
                  className="absolute -top-2 -right-2 bg-white border border-red-300 text-red-600 rounded-full w-6 h-6 shadow-sm hidden group-hover:flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex items-center gap-4 flex-nowrap">
        <div className="flex-1 min-w-0 relative">
          <input
            type="text"
            placeholder="Type your reply..."
            className="w-full rounded-2xl px-6 py-4 pr-16 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-gray-50 focus:bg-white text-sm font-medium transition-all duration-200 placeholder-gray-500 text-gray-900"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            disabled={!selectedChat}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full">
            {(message || '').length}/500
          </div>
        </div>
        
        {/* File Upload Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedChat}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl px-4 py-4 transition-all duration-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow hover:shadow-md flex items-center gap-2 flex-shrink-0"
            title="Attach file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9"/>
            </svg>
            {attachments.length > 0 ? `${attachments.length} file${attachments.length>1?'s':''}` : 'Attach'}
          </button>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-2xl px-8 py-4 transition-all duration-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3 flex-shrink-0"
          disabled={(!message?.trim() && attachments.length === 0) || !selectedChat || uploading}
        >
          <span>{uploading ? 'Sending…' : 'Send'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </form>
    </div>
  );
};

export default MessageInput;
