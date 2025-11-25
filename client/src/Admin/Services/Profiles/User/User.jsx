import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../../contexts/ThemeContext';

import User_Details from './User_Details';

export default function User({ user, details, refetchRow, tabular = true }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const queryClient = useQueryClient();
    const [isExpanded, setIsExpanded] = useState(false);
    const [editBtn, setEditBtn] = useState(false);
    const userId = user.id;

    const { data: account, refetch } = useQuery({
        queryKey: ['account', userId],
        queryFn: async () => {
            return {
                ...user,
                picture: `/api/account/all/picture/${userId}?refresh=${new Date().getTime()}`,
            };
        },
        initialData: user,
    });
    
    useEffect(() => {
        refetch();
    }, [userId, refetch]);

    const Modal = ({ open, onClose, children }) => {
        if (!open) return null;
        return createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-all duration-300 p-4">
                <div className={`rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full relative animate-fade-in max-h-[90vh] flex flex-col border ${
                    isDark 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-white border-gray-200'
                }`}>
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b rounded-t-xl sm:rounded-t-2xl gap-3 sm:gap-0 ${
                        isDark 
                            ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800' 
                            : 'border-gray-200 bg-gradient-to-r from-gray-50 to-white'
                    }`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-xl shadow-sm flex-shrink-0 ${
                                isDark ? 'bg-green-700' : 'bg-gray-600'
                            }`}>
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.607 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className={`text-lg sm:text-xl md:text-2xl font-bold truncate ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>{editBtn ? 'Edit User Details' : 'User Profile Details'}</h2>
                                <p className={`text-xs sm:text-sm truncate ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>Manage user information and settings</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-xl transition-all duration-200 focus:outline-none flex-shrink-0 self-start sm:self-center ${
                                isDark 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 sm:h-6 sm:w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                        {children}
                    </div>
                </div>
            </div>,
            document.body
        );
    };

    // Card layout for mobile view
    if (!tabular) {
        return (
            <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                            src={account?.picture}
                            alt={`${account?.username}'s profile`}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-green-400 shadow-sm flex-shrink-0"
                            style={{ boxShadow: '0 2px 8px 0 #60a5fa22' }}
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className={`font-bold text-base sm:text-lg truncate ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>{account?.username}</h3>
                            <p className={`text-sm truncate ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>{account?.firstName} {account?.surname}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold uppercase ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>Role:</span>
                            <span className={`font-bold text-sm ${
                                account?.access === 'Super Admin'
                                    ? 'text-red-600'
                                    : account?.access === 'Admin'
                                    ? 'text-blue-600'
                                    : 'text-green-600'
                            }`}>{account?.access}</span>
                        </div>
                        {account?.client_profile && (
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold uppercase ${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>Profile:</span>
                                <span className={`text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>{account?.client_profile}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {details.access === 'Super_Admin' && (
                        <button
                            onClick={() => {
                                setEditBtn(true);
                                setIsExpanded(true);
                            }}
                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition text-sm border border-green-500 whitespace-nowrap"
                        >
                            Edit Details
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsExpanded(true);
                            setEditBtn(false);
                        }}
                        className={`flex-1 sm:flex-none font-semibold py-2 px-4 rounded-lg shadow transition text-sm border whitespace-nowrap ${
                            isDark 
                                ? 'bg-gray-700 hover:bg-gray-600 text-green-400 border-green-600' 
                                : 'bg-gray-100 hover:bg-green-100 text-green-700 border-green-200'
                        }`}
                    >
                        View Details
                    </button>
                </div>
                {/* Modal for Details */}
                <Modal open={isExpanded} onClose={() => setIsExpanded(false)}>
                    <User_Details
                        user={account}
                        isEdit={editBtn}
                        refetchRow={refetchRow}
                    />
                </Modal>
            </>
        );
    }

    // Tabular cell layout for table (render only <td> elements, larger and more professional)
    return (
        <>
            <td className={`px-4 py-3 whitespace-nowrap align-middle border-b ${
                isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-green-100'
            }`}>
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={account?.picture}
                        alt={`${account?.username}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-green-400 shadow-sm align-middle"
                        style={{ boxShadow: '0 2px 8px 0 #60a5fa22' }}
                    />
                    <span className={`font-semibold truncate max-w-[140px] align-middle text-base ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`} style={{letterSpacing: '0.01em'}}>{account?.username}</span>
                </div>
            </td>
            <td className={`px-4 py-3 whitespace-nowrap align-middle border-b ${
                isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-green-100'
            }`}>
                <span className={`truncate max-w-[180px] block align-middle text-base font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>{account?.firstName} {account?.surname}</span>
            </td>
            <td className={`px-4 py-3 whitespace-nowrap align-middle text-center border-b ${
                isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-green-100'
            }`}>
                <span className={`font-semibold text-base align-middle ${
                    account?.access === 'Super Admin'
                        ? 'text-red-600'
                        : account?.access === 'Admin'
                        ? 'text-blue-600'
                        : 'text-green-600'
                }`} style={{letterSpacing: '0.03em'}}>
                    {account?.access}
                </span>
            </td>
            <td className={`px-4 py-3 whitespace-nowrap align-middle border-b ${
                isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-green-100'
            }`}>
                <span className={`truncate max-w-[180px] block align-middle text-base ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>{account?.client_profile || '-'}</span>
            </td>
            <td className={`px-4 py-3 whitespace-nowrap align-middle text-center border-b ${
                isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-green-100'
            }`}>
                <div className="flex gap-2 justify-center items-center">
                    {details.access === 'Super_Admin' && (
                        <button
                            onClick={() => {
                                setEditBtn(true);
                                setIsExpanded(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition text-sm align-middle border border-green-500"
                            style={{letterSpacing: '0.01em'}}
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsExpanded(true);
                            setEditBtn(false);
                        }}
                        className={`font-semibold py-2 px-4 rounded-lg shadow transition text-sm align-middle border ${
                            isDark 
                                ? 'bg-gray-700 hover:bg-gray-600 text-green-400 border-green-600' 
                                : 'bg-gray-100 hover:bg-green-100 text-green-700 border-green-200'
                        }`}
                        style={{letterSpacing: '0.01em'}}
                    >
                        Details
                    </button>
                </div>
            </td>
            {/* Modal for Details */}
            <Modal open={isExpanded} onClose={() => setIsExpanded(false)}>
                <User_Details
                    user={account}
                    isEdit={editBtn}
                    refetchRow={refetchRow}
                />
            </Modal>
        </>
    );
}
