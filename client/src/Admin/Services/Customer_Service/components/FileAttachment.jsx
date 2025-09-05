import React from 'react';

const extIcon = (name = '', mime = '') => {
  const n = name.toLowerCase();
  if (mime.startsWith('image/')) return { bg: 'bg-green-50', fg: 'text-green-700', label: 'IMG' };
  if (mime === 'application/pdf' || n.endsWith('.pdf')) return { bg: 'bg-red-50', fg: 'text-red-700', label: 'PDF' };
  if (n.endsWith('.doc') || n.endsWith('.docx') || mime.includes('word')) return { bg: 'bg-blue-50', fg: 'text-blue-700', label: 'DOC' };
  if (n.endsWith('.xls') || n.endsWith('.xlsx') || mime.includes('sheet')) return { bg: 'bg-green-50', fg: 'text-green-700', label: 'XLS' };
  if (n.endsWith('.ppt') || n.endsWith('.pptx') || mime.includes('presentation')) return { bg: 'bg-orange-50', fg: 'text-orange-700', label: 'PPT' };
  if (n.endsWith('.txt')) return { bg: 'bg-gray-50', fg: 'text-gray-700', label: 'TXT' };
  return { bg: 'bg-gray-800', fg: 'text-white', label: 'FILE' };
};

const FileAttachment = ({ attachment, isFromUser, createdAt }) => {
  const { filename, mimetype, filesize, streamUrl } = attachment || {};
  const i = extIcon(filename, mimetype || '');
  const sizeKb = Math.max(1, Math.ceil((filesize || 0) / 1024));

  return (
    <div className={`flex ${isFromUser ? 'justify-start' : 'justify-end'} items-end gap-3`}>
      {isFromUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
            U
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isFromUser ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <a href={streamUrl} target="_blank" rel="noreferrer" className={`group w-72 border-2 rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${isFromUser ? 'bg-white border-gray-300 hover:border-green-500' : 'bg-green-50 border-green-300 hover:border-green-500'}`}>
          <div className={`w-12 h-12 rounded-lg ${i.bg} ${i.fg} flex items-center justify-center text-xs font-bold shadow-sm`}>{i.label}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate" title={filename}>{filename}</div>
            <div className="text-xs text-gray-600 font-medium">{sizeKb} KB • {mimetype}</div>
          </div>
          <svg className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"/></svg>
        </a>
        <span className="text-xs text-gray-500 mt-1.5 px-2 font-medium">
          {new Date(createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isFromUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-sm font-bold shadow-md">A</div>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
