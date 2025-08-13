import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import User_Details from './User_Details';

export default function User({ user, details, refetchRow }) {
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
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70  transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 relative animate-fade-in max-h-[90vh] flex flex-col border border-gray-200">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-600 rounded-xl shadow-sm">
                                <svg
                                    className="w-6 h-6 text-white"
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
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{editBtn ? 'Edit User Details' : 'User Profile Details'}</h2>
                                <p className="text-sm text-gray-600">Manage user information and settings</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    // Tabular cell layout for table (render only <td> elements, larger and more professional)
    return (
        <>
            <td className="px-4 py-3 whitespace-nowrap align-middle bg-white border-b border-green-100">
                <div className="flex items-center gap-3 min-w-0">
                    <img
                        src={account?.picture}
                        alt={`${account?.username}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-green-400 shadow-sm align-middle"
                        style={{ boxShadow: '0 2px 8px 0 #60a5fa22' }}
                    />
                    <span className="font-semibold text-gray-900 truncate max-w-[140px] align-middle text-base" style={{letterSpacing: '0.01em'}}>{account?.username}</span>
                </div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap align-middle bg-white border-b border-green-100">
                <span className="truncate max-w-[180px] block align-middle text-base text-gray-800 font-medium">{account?.firstName} {account?.lastName}</span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap align-middle text-center bg-white border-b border-green-100">
                <span className={`font-bold px-3 py-1 rounded-full text-sm align-middle shadow-sm ${
                    account?.access === 'Super Admin'
                        ? 'bg-red-500 text-white border border-red-400'
                        : account?.access === 'Admin'
                        ? 'bg-blue-500 text-white border border-blue-400'
                        : 'bg-green-500 text-white border border-green-400'
                }`} style={{letterSpacing: '0.03em'}}>
                    {account?.access}
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap align-middle bg-white border-b border-green-100">
                <span className="truncate max-w-[180px] block align-middle text-base text-gray-700">{account?.client_profile || '-'}</span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap align-middle text-center bg-white border-b border-green-100">
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
                        className="bg-gray-100 hover:bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg shadow transition text-sm align-middle border border-green-200"
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
