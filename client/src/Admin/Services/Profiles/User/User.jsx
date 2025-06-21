import React, { useEffect } from 'react';
import { useState } from 'react';

// ASSETS
import default_picture from '../../../../Assets/default_picture.png';

// SUB Component
import User_Details from './User_Details';

export default function User({ user, details }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [account, setAccount] = useState(user);
    const [editBtn, setEditBtn] = useState(false);
    const [rowUpdate, setRowUpdate] = useState(user);

    useEffect(() => {
        (async () => {
            const getImage = await fetch(
                `/api/Accounts/getProfile?user_id=${user.id}`
            );

            if (getImage.status == 204) {
                setAccount({ ...account, picture: default_picture });
                return;
            }

            const imageBlob = await getImage.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);

            setAccount({ ...account, picture: imageObjectURL });
        })();
    }, []);

    useEffect(()=>{
        setIsExpanded(false);
    }, [rowUpdate])

    // Modal component
    const Modal = ({ open, onClose, children }) => {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity">
                <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full relative animate-fade-in max-h-[95vh] flex flex-col border border-blue-100">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none transition-colors"
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
                        className="p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
                        style={{ maxHeight: '85vh' }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center w-full px-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-4xl bg-white rounded-xl shadow p-3 sm:p-6 gap-4 transition-all duration-200"
                style={{ minWidth: 0 }}>
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 min-w-0 w-full">
                    <img
                        src={account.picture}
                        alt={`${rowUpdate.username}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 flex-shrink-0"
                    />

                    <div className="flex flex-col min-w-0 w-full">
                        {/* FULLNAME */}
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            {rowUpdate.firstname} {rowUpdate.lastname}
                        </h3>

                        {/* EMAIL */}
                        <p className="truncate text-sm sm:text-base">
                            Email: {rowUpdate.email_address}
                        </p>

                        {/* USERNAME */}
                        <p className="text-gray-500 truncate text-sm sm:text-base">Username: {rowUpdate.username}</p>

                        <p
                            className={`font-semibold text-center py-1 px-2 rounded-full text-xs sm:text-sm w-fit ${
                                rowUpdate.access === 'Super Admin'
                                    ? 'bg-red-500 text-white'
                                    : rowUpdate.access === 'Admin'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-400 text-white'
                            }`}
                        >
                            {rowUpdate.access}
                        </p>
                    </div>
                </div>
                {/* Button container for responsiveness */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end w-full sm:w-auto">
                    {details.access === 'Super Admin' && (
                        <div className="w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    setEditBtn(true);
                                    setIsExpanded(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition w-full sm:w-auto"
                            >
                                Edit
                            </button>
                        </div>
                    )}

                    <div className="w-full sm:w-auto">
                        <button
                            onClick={() => {
                                setIsExpanded(true);
                                setEditBtn(false);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow transition w-full sm:w-auto"
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Details */}
            <Modal open={isExpanded} onClose={() => setIsExpanded(false)}>
                <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
                    <svg
                        className="w-6 h-6 text-blue-500"
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
                    <User_Details user={account} isEdit={editBtn} setRowUpdate={setRowUpdate}/>
                </div>
            </Modal>
        </div>
    );
}
