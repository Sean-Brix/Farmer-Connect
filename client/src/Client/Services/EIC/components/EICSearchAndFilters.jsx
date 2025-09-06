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
    onMyRequestsClick 
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
        <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center max-w-5xl mb-8 gap-4 flex-wrap mx-auto">
            <div className="w-full sm:w-auto flex justify-center order-2 sm:order-1">
                <button
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={onMyRequestsClick}
                >
                    <i className="fa-solid fa-list-check text-lg"></i>
                    My Requests
                </button>
            </div>
            <div className="flex gap-3 flex-wrap items-center justify-center w-full sm:w-auto order-1 sm:order-2">
                <div className="relative w-full sm:w-auto flex justify-center">
                    <input
                        type="text"
                        className={`w-full sm:w-72 md:w-80 lg:w-96 px-10 py-2 rounded-lg border-2 ${isDark ? 'border-gray-600 bg-gray-800 text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-600 placeholder:text-gray-400' : 'border-gray-300 bg-white text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 placeholder:text-gray-500'} shadow-sm transition font-medium`}
                        placeholder="Search by name, category, description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                <div className="relative flex justify-center w-full sm:w-auto">
                    <button
                        id="modernFilterButton"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'} font-semibold border-2 shadow-sm hover:shadow-md transition focus:outline-none`}
                        onClick={() => setShowFilter((f) => !f)}
                        type="button"
                        aria-label="Show filter options"
                    >
                        <i className="fa-solid fa-filter"></i>
                        <span>Filter by: {filter}</span>
                        <i
                            className={`fa-solid fa-chevron-${
                                showFilter ? 'up' : 'down'
                            } ml-1`}
                        ></i>
                    </button>
                    {showFilter && (
                        <div 
                            id="modernFilterDropdown"
                            className={`absolute left-0 mt-2 w-48 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-lg shadow-xl border-2 z-20 animate-fade-in py-2`}
                        >
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg font-medium transition text-base ${
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
