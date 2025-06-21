import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ setPage, details = {}, logging, elements }) {
    // Helper function to determine if a sidebar item is active
    const isActive = (key) => details && details.currentPage === key;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 gradient-bg text shadow-md hidden md:flex flex-col fixed left-0 top-0 z-30 h-screen max-h-screen">
                <div className="flex flex-col h-full max-h-screen">
                    <div className="p-4 border-b border-blue-500">
                        <h1 className="text-xl font-semibold ml-7 family">
                            Dashboard
                        </h1>
                    </div>
                    <div className="flex min-h-0 overflow-y-auto minimalist-scrollbar">
                        <nav className="mt-2">
                            <ul className="space-y-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('home')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setPage(elements.current['home']);
                                        navigate('/');
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-home h-6 w-6"></i>
                                        </span>
                                        <span>Home</span>
                                    </div>
                                </li>
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('analytics')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setPage(elements.current['analytics'])
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-cog h-6 w-6"></i>
                                        </span>
                                        <span>Analytics</span>
                                    </div>
                                </li>
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('profiles')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setPage(elements.current['profiles'])
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-user-circle h-6 w-6"></i>
                                        </span>
                                        <span>User Profiles</span>
                                    </div>
                                </li>
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('enrollment')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setPage(elements.current['enrollment'])
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-user-plus h-6 w-6"></i>
                                        </span>
                                        <span>Seminar Programs</span>
                                    </div>
                                </li>
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('eic')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setPage(elements.current['eic'])
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-id-card h-6 w-6"></i>
                                        </span>
                                        <span>EIC - Item Panel</span>
                                    </div>
                                </li>
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('distribution')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setPage(elements.current['distribution'])
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-id-card h-6 w-6"></i>
                                        </span>
                                        <span>Distribution</span>
                                    </div>
                                </li>
                                <li
                                    className={`p-5 text-lg hover:bg-blue-700 rounded-lg transition cursor-pointer ${
                                        isActive('content')
                                            ? 'bg-blue-700 font-bold'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setPage(elements.current['content'])
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            <i className="fas fa-home h-6 w-6"></i>
                                        </span>
                                        <span>Inventory</span>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    
                    <div className="p-6 border-t logout flex flex-col items-center mt-auto bg-gradient-to-t from-blue-900/80 via-blue-900/60 to-transparent">
                        <button
                            className="flex flex-col items-center w-full mb-4 focus:outline-none group"
                            onClick={() => setPage(elements.current['account'])}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative mb-2">
                                    <img
                                        src={details.picture}
                                        alt="Profile"
                                        className="h-16 w-16 rounded-full border-4 border-blue-500 shadow-lg object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                    <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></span>
                                </div>
                                <span className="font-semibold text-white text-lg text-center">{details.username}</span>
                            </div>
                        </button>
                        {/* Logout button (desktop sidebar, bottom) */}
                        <button
                            className="flex items-center justify-center space-x-2 px-4 py-2 element hover:element rounded-lg transition text w-full border"
                            onClick={logging}
                        >
                            <span className="flex items-center py-2k">
                                <i className="fas fa-sign-out-alt h-5 w-5 translate-y-1"></i>
                            </span>
                            <span className="font-bold">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
