import React, { useMemo, useState } from 'react';
import ChatMessage from './ChatMessage.jsx';
import MessageInput from './MessageInput.jsx';
import FileAttachment from './FileAttachment.jsx';
import SendFormModal from './SendFormModal.jsx';

const ChatWindow = ({ selectedChat, messagesEndRef, getUserName, onSendMessage }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[700px] flex flex-col">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                {selectedChat ? getUserName(selectedChat).charAt(0).toUpperCase() : '?'}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                selectedChat?.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-semibold">{selectedChat ? getUserName(selectedChat) : 'No conversation selected'}</h3>
              <p className="text-green-100 text-sm">{selectedChat?.user?.email || selectedChat?.userEmail || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSendForm(true)}
              disabled={!selectedChat}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border ${selectedChat ? 'bg-white/15 hover:bg-white/25 text-white border-white/20' : 'bg-white/10 text-white/60 border-white/10 cursor-not-allowed'}`}
              title="Send Form"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Form
            </button>
            <div className="text-green-100 text-sm">
              {selectedChat?.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-600 mb-1">Select a conversation</p>
              <p className="text-sm text-gray-400">Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
  <MessageInput onSendMessage={onSendMessage} selectedChat={selectedChat} />

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
