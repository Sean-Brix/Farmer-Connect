import React, { useMemo, useState } from 'react';
import ChatMessage from './ChatMessage.jsx';
import MessageInput from './MessageInput.jsx';
import FileAttachment from './FileAttachment.jsx';
import SendFormModal from './SendFormModal.jsx';

const ChatWindow = ({ selectedChat, messagesEndRef, messagesContainerRef, getUserName, onSendMessage, onSendAttachment, onError }) => {
  const [showSendForm, setShowSendForm] = useState(false);

  // Build a combined timeline: initial message, replies, and attachments
  const timeline = useMemo(() => {
    if (!selectedChat) return [];
    const items = [];
    const attachmentUrls = new Set(
      (selectedChat.attachments || [])
        .map(a => a?.streamUrl || a?.filepath)
        .filter(Boolean)
    );
    if (selectedChat.message) {
      items.push({
        key: `inquiry:${selectedChat.id}`,
        type: 'text',
        data: {
          id: `initial-${selectedChat.id}`,
          message: selectedChat.message,
          createdAt: selectedChat.createdAt,
          senderType: 'USER'
        }
      });
    }
    (selectedChat.replies || []).forEach(r => {
      const msg = typeof r.message === 'string' ? r.message : '';
      // If this reply is just an attachment URL that we also have in attachments, skip it to avoid duplicates
      if (attachmentUrls.has(msg)) return;
      items.push({ key: `reply:${r.id}` , type: 'text', data: r });
    });
    (selectedChat.attachments || []).forEach(a => {
      const isImg = (a.mimetype || '').startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(a.filename || '');
  if (isImg) {
        items.push({
          key: `att:${a.id}`,
          type: 'image',
          data: {
            id: `att-${a.id}`,
            message: a.streamUrl,
    mime: a.mimetype,
    filename: a.filename,
            createdAt: a.createdAt,
            senderType: a.uploadedById === selectedChat.userId ? 'USER' : 'ADMIN'
          }
        });
      } else {
        items.push({ key: `att:${a.id}`, type: 'file', data: a });
      }
    });
    // Deduplicate potential duplicates if a reply text equals the attachment URL
    const seen = new Set();
    const deduped = [];
    for (const it of items) {
      const sig = it.type === 'image' || it.type === 'file'
        ? `${it.type}:${it.data.message || it.data.streamUrl || it.data.filename}`
        : `${it.type}:${it.data.id || it.data.message}`;
      if (seen.has(sig)) continue;
      seen.add(sig);
      deduped.push(it);
    }
    deduped.sort((a,b) => new Date((a.data.createdAt)) - new Date((b.data.createdAt)));
    return deduped;
  }, [selectedChat]);

  const [headerImgError, setHeaderImgError] = useState(false);
  const headerAvatarUrl = useMemo(() => (
    selectedChat?.userId ? `/api/account/picture/${selectedChat.userId}?t=${selectedChat.updatedAt ? new Date(selectedChat.updatedAt).getTime() : ''}` : ''
  ), [selectedChat?.userId, selectedChat?.updatedAt]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[700px] flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-5 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {headerAvatarUrl && !headerImgError ? (
                <img
                  src={headerAvatarUrl}
                  alt={selectedChat ? getUserName(selectedChat) : 'User'}
                  onError={() => setHeaderImgError(true)}
                  className="w-12 h-12 rounded-full object-cover border shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {selectedChat ? getUserName(selectedChat).charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                selectedChat?.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate max-w-xs">{selectedChat ? getUserName(selectedChat) : 'No conversation selected'}</h3>
              <p className="text-green-100 text-xs font-normal truncate max-w-xs">{selectedChat?.user?.email || selectedChat?.userEmail || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowSendForm(true)}
              disabled={!selectedChat}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg border transition-all duration-200 ${selectedChat ? 'bg-white/15 hover:bg-white/25 text-white border-white/20 transform hover:scale-105' : 'bg-white/10 text-white/60 border-white/10 cursor-not-allowed'}`}
              title="Send Form"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Send Form
            </button>
            <div className="text-sm">
              <div className={`px-3 py-1.5 rounded-full font-medium ${selectedChat?.isOnline ? 'bg-green-400 text-green-900' : 'bg-white/20 text-green-100'}`}>
                {selectedChat?.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        {selectedChat ? (
          <div className="space-y-4">
            {timeline.map(item => (item.type === 'text' || item.type === 'image') ? (
              <ChatMessage
                key={item.key}
                message={item.data}
                getUserName={getUserName}
                chat={selectedChat}
              />
            ) : (
              <FileAttachment
                key={item.key}
                attachment={item.data}
                isFromUser={item.data.uploadedById === selectedChat.userId}
                createdAt={item.data.createdAt}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-2">Select a conversation</p>
              <p className="text-lg text-gray-500">Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input or Resolved State */}
      {selectedChat?.status === 'RESOLVED' ? (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center gap-3 text-emerald-600">
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold text-lg">This inquiry has been resolved</span>
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">No further messages can be sent for this conversation</p>
        </div>
      ) : (
        <MessageInput onSendMessage={onSendMessage} onSendAttachment={onSendAttachment} selectedChat={selectedChat} onError={onError} />
      )}

      {/* Send Form Modal */}
      {showSendForm && (
        <SendFormModal
          isOpen={showSendForm}
          onClose={() => setShowSendForm(false)}
          onSend={(form) => {
            const payload = { id: form.id, title: form.title };
            const msg = `__FC_FORM__${JSON.stringify(payload)}`;
            onSendMessage?.(msg);
            setShowSendForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatWindow;
