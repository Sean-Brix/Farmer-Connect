import React, { useRef, useState, useEffect } from 'react';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

// Lightweight image viewer with zoom, pan, and download
export default function ImageViewer({ open, onClose, src, filename }) {
  const { t } = useCustomTranslation();
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (open) {
      setScale(1);
      setPos({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const onWheel = (e) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * 0.1;
    const next = Math.min(5, Math.max(0.5, scale + delta));
    setScale(next);
  };

  const onMouseDown = (e) => {
    setDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onMouseUp = () => setDragging(false);

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  return (
    <div className="fixed inset-0 z-[10000000] bg-black/80 flex flex-col" onWheel={onWheel}>
      <div className="flex items-center justify-between p-3 text-white bg-black/40">
        <div className="font-medium truncate max-w-[60%]">{filename || 'Image'}</div>
        <div className="flex items-center gap-2">
          <a href={src} download={filename || 'image'} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm">{t('image_viewer.download')}</a>
          <button onClick={reset} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm">{t('common.refresh')}</button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded" aria-label={t('image_viewer.close')}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing" onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <img
          ref={imgRef}
          src={src}
          alt={filename || 'Image'}
          className="select-none pointer-events-none absolute top-1/2 left-1/2"
          style={{ transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) scale(${scale})`, maxWidth: '90%', maxHeight: '90%' }}
        />
      </div>
    </div>
  );
}
