import React from 'react';

const extIcon = (name = '', mime = '') => {
  const n = name.toLowerCase();
  if (mime.startsWith('image/')) return { bg: 'bg-blue-50', fg: 'text-blue-600', label: 'IMG' };
  if (mime === 'application/pdf' || n.endsWith('.pdf')) return { bg: 'bg-red-50', fg: 'text-red-600', label: 'PDF' };
  if (n.endsWith('.doc') || n.endsWith('.docx') || mime.includes('word')) return { bg: 'bg-blue-50', fg: 'text-blue-700', label: 'DOC' };
  if (n.endsWith('.xls') || n.endsWith('.xlsx') || mime.includes('sheet')) return { bg: 'bg-green-50', fg: 'text-green-700', label: 'XLS' };
  if (n.endsWith('.ppt') || n.endsWith('.pptx') || mime.includes('presentation')) return { bg: 'bg-orange-50', fg: 'text-orange-700', label: 'PPT' };
  if (n.endsWith('.txt')) return { bg: 'bg-gray-50', fg: 'text-gray-700', label: 'TXT' };
  return { bg: 'bg-slate-50', fg: 'text-slate-700', label: 'FILE' };
};

const FileAttachment = ({ attachment, isFromUser, createdAt }) => {
  const { filename, mimetype, filesize, streamUrl } = attachment || {};
  const i = extIcon(filename, mimetype || '');
  const sizeKb = Math.max(1, Math.ceil((filesize || 0) / 1024));

  return (
    <div className={`flex ${isFromUser ? 'justify-start' : 'justify-end'} items-end gap-2`}>
      {isFromUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isFromUser ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <a href={streamUrl} target="_blank" rel="noreferrer" className={`group w-64 border rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition ${isFromUser ? 'bg-white border-gray-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`w-10 h-10 rounded-lg ${i.bg} ${i.fg} flex items-center justify-center text-xs font-bold`}>{i.label}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800 truncate" title={filename}>{filename}</div>
            <div className="text-xs text-gray-500">{sizeKb} KB · {mimetype}</div>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"/></svg>
        </a>
        <span className="text-xs text-gray-500 mt-1 px-2">
          {new Date(createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isFromUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm">A</div>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
