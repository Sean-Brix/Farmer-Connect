/**
 * Toast - Notification component
 */
import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    if (!toast) return null;

    return (
        <div 
            className={`fixed bottom-24 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-up ${
                toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            } text-white`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="font-semibold">{toast.title}</p>
                    <p className="text-sm mt-1">{toast.message}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
