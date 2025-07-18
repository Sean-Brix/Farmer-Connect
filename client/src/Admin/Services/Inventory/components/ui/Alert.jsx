import React from 'react';

const Alert = ({ alert }) => {
    if (!alert.show) return null;

    return (
        <div
            className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3
                ${
                    alert.type === 'success'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                }`}
        >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                {alert.type === 'success' ? (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                ) : (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                )}
            </svg>
            <span className="font-medium">{alert.message}</span>
        </div>
    );
};

export default Alert;
