import React from 'react';
import { categories, statuses } from '../../constants';

const Header = ({
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    showModal,
    setShowModal,
    showDelete,
    setShowDelete,
    selectedItems,
    filteredItems,
    handleRemoveSelected,
    handleSelectAll,
    setSelectAll,
    setSelectedItems,
    uiSize,
}) => {
    return (
        <div
            className={`w-full sticky top-[-5px] bg-white rounded-xl shadow border-b border-blue-100 mb-4 ${
                uiSize === 'lg' ? 'p-6' : uiSize === 'md' ? 'p-4' : 'p-2'
            }`}
        >
            <h1 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 text-center tracking-tight">
                Inventory Management
            </h1>
            <div className="flex flex-wrap gap-2 w-full mx-auto justify-center mb-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[120px] border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder:text-blue-400 w-full sm:w-auto"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="min-w-[100px] border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 text-blue-900 w-full sm:w-auto"
                >
                    <option key="All">All</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="min-w-[100px] border border-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 bg-blue-50 text-blue-900 w-full sm:w-auto"
                >
                    <option key="All">All</option>
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
                >
                    + Add
                </button>
                {!showDelete ? (
                    <button
                        onClick={() => setShowDelete(true)}
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition w-full sm:w-auto"
                    >
                        Delete
                    </button>
                ) : (
                    <button
                        onClick={() => setShowDelete(false)}
                        className="bg-gray-300 text-blue-900 font-bold px-4 py-2 rounded hover:bg-gray-400 transition w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                )}
            </div>
            {showDelete && (
                <div className="flex flex-col items-end mt-2 gap-2 w-full">
                    <div className="flex gap-2 flex-wrap w-full">
                        <button
                            onClick={handleRemoveSelected}
                            disabled={selectedItems.length === 0}
                            className={`px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed w-full sm:w-auto`}
                        >
                            Remove Selected
                        </button>
                        <button
                            onClick={() => {
                                setSelectAll(true);
                                setSelectedItems(
                                    filteredItems.map((item) => item.id)
                                );
                            }}
                            className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                        >
                            Select All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
