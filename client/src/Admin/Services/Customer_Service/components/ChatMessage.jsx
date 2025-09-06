import React, { useMemo, useState } from 'react';
import ImageViewer from '../../../../Components/Common/ImageViewer.jsx';
import FillSurveyModal from '../../../../Components/Survey/FillSurveyModal.jsx';

const ChatMessage = ({ message, getUserName, chat, userName, isInitialMessage = false }) => {
  const isAdmin = message.senderType === 'ADMIN';
  const isUser = message.senderType === 'USER' || isInitialMessage;
  
  // Get the user name from either userName prop or getUserName function
  const displayName = userName || (getUserName && chat ? getUserName(chat) : 'Unknown User');
  const [userImgErr, setUserImgErr] = useState(false);
  const [adminImgErr, setAdminImgErr] = useState(false);
  const userAvatarUrl = useMemo(() => (
    chat?.userId ? `/api/account/picture/${chat.userId}?t=${chat.updatedAt ? new Date(chat.updatedAt).getTime() : ''}` : ''
  ), [chat?.userId, chat?.updatedAt]);
  // If you have admin account id on message (e.g., message.adminId), use it. Otherwise keep initial.
  const adminAvatarUrl = useMemo(() => (
    message?.adminId ? `/api/account/picture/${message.adminId}?t=${chat?.updatedAt ? new Date(chat.updatedAt).getTime() : ''}` : ''
  ), [message?.adminId, chat?.updatedAt]);

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
    // Detect special form message
    if (typeof text === 'string' && text.startsWith('__FC_FORM__')) {
      try {
        const payload = JSON.parse(text.replace('__FC_FORM__', ''));
        return (
          <FormOpenButton title={payload.title} surveyId={payload.id} />
        );
      } catch {}
    }
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
    // Linkify plain URLs for usability
    const splitRegex = /(https?:\/\/[^\s]+)/g;
    const isUrl = (s) => /^https?:\/\/[^\s]+$/i.test(s);
    if (typeof text === 'string' && splitRegex.test(text)) {
      const parts = text.split(splitRegex);
      return (
        <p>
          {parts.map((part, i) => (
            isUrl(part) ? (
              <a key={i} href={part} target="_blank" rel="noreferrer" className="underline text-blue-700">{part}</a>
            ) : (
              <span key={i}>{part}</span>
            )
          ))}
        </p>
      );
    }
    return <p>{text}</p>;
  };

  return (
  <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} items-end gap-3`}>
      {isUser && (
        <div className="flex-shrink-0">
          {userAvatarUrl && !userImgErr ? (
            <img
              src={userAvatarUrl}
              alt={displayName}
              onError={() => setUserImgErr(true)}
              className="w-10 h-10 rounded-full object-cover border shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {displayName && displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      
      <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className={`px-5 py-3 rounded-2xl text-sm shadow-md ${
          isAdmin
            ? 'bg-green-600 text-white rounded-br-md border border-green-700'
            : 'bg-white text-gray-900 border-2 border-gray-200 rounded-bl-md'
        }`}>
          {renderBody()}
        </div>
        <span className="text-xs text-gray-500 mt-1.5 px-2 font-medium">
          {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isAdmin && (
        <div className="flex-shrink-0">
          {adminAvatarUrl && !adminImgErr ? (
            <img
              src={adminAvatarUrl}
              alt="Admin"
              onError={() => setAdminImgErr(true)}
              className="w-10 h-10 rounded-full object-cover border shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-sm font-bold shadow-md">
              A
            </div>
          )}
        </div>
      )}
      {viewer.open && (
        <ImageViewer open={viewer.open} src={viewer.src} filename={viewer.filename} onClose={() => setViewer({ open: false, src: '', filename: '' })} />
      )}
    </div>
  );
};

export default ChatMessage;

// Inline helper component to open the survey modal
const FormOpenButton = ({ title, surveyId }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 border-green-600 text-green-800 bg-green-50 hover:bg-green-100 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        {title || 'Open Form'}
      </button>
      <FillSurveyModal isOpen={open} onClose={() => setOpen(false)} surveyId={surveyId} title={title} />
    </>
  );
};
