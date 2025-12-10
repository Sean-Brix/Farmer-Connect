import { useState, useEffect } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

export default function EICSearchAndFilters({ 
    search, 
    setSearch, 
    filter, 
    setFilter, 
    showFilter, 
    setShowFilter, 
    categories, 
    typeIcon,
    onMyRequestsClick,
    activeRequestsCount,
    maxActiveRequests
}) {
    const { isDark } = useTheme();
    // Close filter dropdown when clicking outside
    useEffect(() => {
        if (!showFilter) return;
        const handler = (e) => {
            const dropdown = document.getElementById('modernFilterDropdown');
            const button = document.getElementById('modernFilterButton');
            if (
                dropdown &&
                !dropdown.contains(e.target) &&
                button &&
                !button.contains(e.target)
            ) {
                setShowFilter(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showFilter, setShowFilter]);

    const filterOptions = categories.map((c) => ({
        value: c,
        label: c,
    }));

    return (
        <div className="w-full max-w-5xl mb-8 mx-auto">
            {/* My Requests Button & Active Counter - Top Right */}
            <div className="w-full flex justify-end items-center gap-3 mb-3">
                {/* Active Request Counter - Only show if maxActiveRequests exists */}
                {maxActiveRequests && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        activeRequestsCount >= maxActiveRequests 
                            ? 'bg-red-100 border-2 border-red-400' 
                            : activeRequestsCount >= maxActiveRequests * 0.7
                            ? 'bg-yellow-100 border-2 border-yellow-400'
                            : 'bg-green-100 border-2 border-green-400'
                    }`}>
                        <i className={`fa-solid fa-clipboard-list ${
                            activeRequestsCount >= maxActiveRequests 
                                ? 'text-red-600' 
                                : activeRequestsCount >= maxActiveRequests * 0.7
                                ? 'text-yellow-600'
                                : 'text-green-600'
                        }`}></i>
                        <span className={`text-sm font-semibold ${
                            activeRequestsCount >= maxActiveRequests 
                                ? 'text-red-800' 
                                : activeRequestsCount >= maxActiveRequests * 0.7
                                ? 'text-yellow-800'
                                : 'text-green-800'
                        }`}>
                            Active: {activeRequestsCount}/{maxActiveRequests}
                        </span>
                    </div>
                )}
                
                <button
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
                    onClick={onMyRequestsClick}
                >
                    <i className="fa-solid fa-list-check text-base sm:text-lg"></i>
                    <span className="hidden sm:inline">My Requests</span>
                    <span className="sm:hidden">Requests</span>
                </button>
            </div>
            
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
                {/* Search Input */}
                <div className="relative flex-1 sm:max-w-md">
                    <input
                        type="text"
                        className={`w-full px-10 py-2.5 rounded-lg border-2 ${isDark ? 'border-gray-600 bg-gray-800 text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-600 placeholder:text-gray-400' : 'border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 placeholder:text-gray-500'} shadow-sm transition font-medium text-sm sm:text-base`}
                        placeholder="Search by name, category, description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative flex-shrink-0 w-auto sm:w-auto sm:ml-auto">
                    <button
                        id="modernFilterButton"
                        className={`w-auto sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'} font-semibold border-2 shadow-sm hover:shadow-md transition focus:outline-none text-sm sm:text-base`}
                        onClick={() => setShowFilter((f) => !f)}
                        type="button"
                        aria-label="Show filter options"
                    >
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-filter"></i>
                            <span>Filter by: {filter}</span>
                        </div>
                        <i
                            className={`fa-solid fa-chevron-${
                                showFilter ? 'up' : 'down'
                            } ml-1`}
                        ></i>
                    </button>
                    {showFilter && (
                        <div 
                            id="modernFilterDropdown"
                            className={`absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 sm:w-56 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-lg shadow-xl border-2 z-20 animate-fade-in py-2`}
                        >
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium transition text-sm sm:text-base ${
                                        filter === opt.value
                                            ? 'bg-green-600 text-white shadow'
                                            : isDark 
                                            ? 'text-gray-200 hover:bg-gray-700'
                                            : 'text-gray-800 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                        setFilter(opt.value);
                                        setShowFilter(false);
                                    }}
                                >
                                    {typeIcon(opt.value)}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
