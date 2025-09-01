import React, { useState } from 'react';
import ImageViewer from '../../../../Components/Common/ImageViewer.jsx';

const ChatMessage = ({ message, getUserName, chat, userName, isInitialMessage = false }) => {
  const isAdmin = message.senderType === 'ADMIN';
  const isUser = message.senderType === 'USER' || isInitialMessage;
  
  // Get the user name from either userName prop or getUserName function
  const displayName = userName || (getUserName && chat ? getUserName(chat) : 'Unknown User');

  // Detect attachment-like content if backend enriches messages later
  const isMediaUrl = (url) => typeof url === 'string' && (/\.(png|jpe?g|webp|gif|mp4|webm)$/i.test(url) || url.startsWith('/api/inquiries/attachments/'));
  const isImage = (url, mime) => (mime?.startsWith?.('image/')) || (typeof url === 'string' && /\.(png|jpe?g|webp|gif)$/i.test(url));
  const isVideo = (url, mime) => (mime?.startsWith?.('video/')) || (typeof url === 'string' && /\.(mp4|webm)$/i.test(url));

  const [viewer, setViewer] = useState({ open: false, src: '', filename: '' });

  const renderBody = () => {
    // When using InquiryReply, we only have message text. If we enhance it to carry attachments, support arrays.
    const text = message.message;
    const mime = message.attachmentMime || message.mime;
    const name = message.filename || message.attachmentName;
    // Preview for /public or streamed /api attachments
    if (typeof text === 'string' && (text.startsWith('/public/') || text.startsWith('/api/inquiries/attachments/'))) {
      const url = text;
      if (isImage(url, mime)) return <>
        <img src={url} alt="attachment" className="max-w-xs rounded-lg border cursor-zoom-in" onClick={() => setViewer({ open: true, src: url, filename: name || 'image' })} />
      </>;
      if (isVideo(url, mime)) return (
        <video className="max-w-xs rounded-lg border" controls>
          <source src={url} />
        </video>
      );
      return (
        <a href={url} target="_blank" rel="noreferrer" className="underline">
          {name || 'Download file'}
        </a>
      );
    }
    return <p>{text}</p>;
  };

  return (
  <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            {displayName && displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
          isAdmin
            ? 'bg-green-600 text-white rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
        }`}>
          {renderBody()}
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isAdmin && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm">
            A
          </div>
        </div>
      )}
      {viewer.open && (
        <ImageViewer open={viewer.open} src={viewer.src} filename={viewer.filename} onClose={() => setViewer({ open: false, src: '', filename: '' })} />
      )}
    </div>
  );
};

export default ChatMessage;
