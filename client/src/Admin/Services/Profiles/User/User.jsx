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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity">
                <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full relative animate-fade-in max-h-[95vh] flex flex-col border border-green-100">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
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
                    <div
                        className="p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50"
                        style={{ maxHeight: '85vh' }}
                    >
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
                <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
                    <svg
                        className="w-6 h-6 text-green-500"
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
                    User Details
                </h2>
                <div className="mb-4">
                    <User_Details
                        user={account}
                        isEdit={editBtn}
                        refetchRow={refetchRow}
                    />
                </div>
            </Modal>
        </>
    );
}
