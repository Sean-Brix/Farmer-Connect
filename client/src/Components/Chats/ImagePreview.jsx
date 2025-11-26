/**
 * ImagePreview - Modal for previewing images with download option
 */
import React from 'react';

export default function ImagePreview({ src, filename, onClose }) {
    if (!src) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30 p-2 sm:p-4"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            {/* Control Buttons - Always visible at top */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 flex gap-2">
                {/* Download Button */}
                <a
                    href={src}
                    download={filename}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 sm:p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    title="Download image"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </a>
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="p-2 sm:p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Scrollable Image Container */}
            <div className="w-full h-full overflow-auto flex items-center justify-center p-12 sm:p-16">
                <img
                    src={src}
                    alt={filename}
                    className="max-w-full mt-30 h-[90vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Filename */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm max-w-[90%] truncate">
                {filename}
            </div>
        </div>
    );
}
