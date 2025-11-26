/**
 * InquirySidebar - History of past inquiries
 */
import React from 'react';

export default function InquirySidebar({ 
    theme,
    isOpen,
    inquiries,
    searchQuery,
    onSearchChange,
    onSelectInquiry
}) {
    if (!isOpen) return null;

    return (
        <div className={`w-80 border-l ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        } overflow-y-auto`}>
            <div className="p-4">
                <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Past Inquiries
                </h3>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        theme === 'dark' 
                            ? 'border-gray-700 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                    }`}
                />
                <div className="space-y-2">
                    {inquiries.length === 0 ? (
                        <p className={`text-sm text-center py-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            No past inquiries found
                        </p>
                    ) : (
                        inquiries.map(inq => (
                            <div
                                key={inq.id}
                                onClick={() => onSelectInquiry(inq)}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    theme === 'dark' 
                                        ? 'border-gray-700 hover:bg-gray-700' 
                                        : 'border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                <p className={`font-medium text-sm ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {inq.subject || 'No Subject'}
                                </p>
                                <p className={`text-xs mt-1 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {inq.status} • {new Date(inq.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
