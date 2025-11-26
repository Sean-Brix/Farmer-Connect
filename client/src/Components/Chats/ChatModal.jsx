/**
 * ChatModal - Modal wrapper with frosted glass backdrop
 */
import React from 'react';

export default function ChatModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleBackdropClick}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
        >
            <div 
                className="relative w-full max-w-4xl h-[90vh] mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
