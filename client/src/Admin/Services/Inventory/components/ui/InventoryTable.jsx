import React from 'react';
import { truncate, groupStacksByStatus } from '../../utils/helpers';

const InventoryTable = ({
    filteredItems,
    showDelete,
    selectAll,
    handleSelectAll,
    selectedItems,
    handleSelectItem,
    expandedStacks,
    handleViewStacks,
    selectedItemStacks,
    handleEdit,
    handleEditStack,
    setSelectedItemStacks,
    setShowStacksModal,
}) => {
    return (
        <div className="w-full mt-2">
            <div className="overflow-x-auto rounded-xl shadow bg-white border border-blue-50 p-2 sm:p-4 w-full">
                <table className="min-w-full bg-transparent rounded-xl">
                    <thead>
                        <tr>
                            <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold w-[40px]">
                                {showDelete ? (
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectAll &&
                                            filteredItems.length > 0
                                        }
                                        onChange={handleSelectAll}
                                        aria-label="Select all"
                                    />
                                ) : null}
                            </th>
                            <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                Name
                            </th>
                            <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                Quantity
                            </th>
                            <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                Description
                            </th>
                            <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                Category
                            </th>
                            <th className="py-2 px-2 border-b text-left text-blue-700 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-6 text-center text-blue-400 font-semibold"
                                    key="no-items"
                                >
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item, index) => (
                                <React.Fragment key={item.id + index}>
                                    <tr className="hover:bg-blue-50 transition">
                                        <td className="py-2 px-2 border-b w-[40px]">
                                            {showDelete ? (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        item.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectItem(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label={`Select ${item.name}`}
                                                />
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleViewStacks(item)
                                                    }
                                                    className="p-1 rounded transition hover:bg-blue-100 focus:outline-none"
                                                    aria-label={
                                                        expandedStacks.has(
                                                            item.id
                                                        )
                                                            ? 'Collapse Stacks'
                                                            : 'Expand Stacks'
                                                    }
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        background: 'none',
                                                        border: 'none',
                                                    }}
                                                >
                                                    {expandedStacks.has(
                                                        item.id
                                                    ) ? (
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M6 8l4 4 4-4"
                                                                stroke="#2563eb"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M6 12l4-4 4 4"
                                                                stroke="#2563eb"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-2 px-2 border-b font-semibold text-blue-900 max-w-[120px] truncate">
                                            {item.name}
                                        </td>
                                        <td className="py-2 px-2 border-b text-blue-700">
                                            <span>{item.totalQuantity}</span>
                                        </td>
                                        <td className="py-2 px-2 border-b text-blue-700 max-w-[120px] truncate">
                                            <span
                                                title={item.description}
                                                className="block truncate"
                                            >
                                                {truncate(item.description, 24)}
                                            </span>
                                        </td>
                                        <td className="py-2 px-2 border-b text-blue-700 max-w-[120px] truncate">
                                            {item.category}
                                        </td>
                                        <td className="py-2 px-2 border-b text-blue-700">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-green-500 text-white font-bold px-3 py-1 rounded hover:bg-green-600 transition w-full sm:w-auto"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedStacks.has(item.id) &&
                                        selectedItemStacks &&
                                        selectedItemStacks.id === item.id && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="bg-blue-50"
                                                >
                                                    <div className="px-2 py-2 w-full overflow-x-auto">
                                                        <table className="min-w-full bg-white rounded shadow">
                                                            <thead>
                                                                <tr>
                                                                    <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800 w-[50px]">
                                                                        Edit
                                                                    </th>
                                                                    <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800">
                                                                        Status
                                                                    </th>
                                                                    <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800">
                                                                        Qty
                                                                    </th>
                                                                    <th className="py-2 px-3 bg-blue-100 text-left font-semibold text-blue-800">
                                                                        Actions
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.entries(
                                                                    groupStacksByStatus(
                                                                        selectedItemStacks.stacks
                                                                    )
                                                                ).map(
                                                                    (
                                                                        [
                                                                            status,
                                                                            {
                                                                                stacks,
                                                                                totalQuantity,
                                                                            },
                                                                        ],
                                                                        index,
                                                                        array
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                status
                                                                            }
                                                                            className={
                                                                                index ===
                                                                                array.length -
                                                                                    1
                                                                                    ? ''
                                                                                    : 'border-b border-blue-100'
                                                                            }
                                                                        >
                                                                            <td className="py-2 px-3">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleEditStack(
                                                                                            status,
                                                                                            stacks,
                                                                                            totalQuantity
                                                                                        )
                                                                                    }
                                                                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                                                    title="Edit Stack"
                                                                                    aria-label={`Edit ${status} stack`}
                                                                                >
                                                                                    <svg
                                                                                        className="w-4 h-4"
                                                                                        fill="none"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="2"
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                                        />
                                                                                    </svg>
                                                                                </button>
                                                                            </td>
                                                                            <td className="py-2 px-3">
                                                                                <span
                                                                                    className={`px-2 py-1 rounded font-semibold
                                                                                    ${
                                                                                        status ===
                                                                                        'Available'
                                                                                            ? 'bg-green-100 text-green-800'
                                                                                            : ''
                                                                                    }
                                                                                    ${
                                                                                        status ===
                                                                                        'Unavailable'
                                                                                            ? 'bg-red-100 text-red-800'
                                                                                            : ''
                                                                                    }
                                                                                    ${
                                                                                        status ===
                                                                                        'Damaged'
                                                                                            ? 'bg-red-100 text-red-800'
                                                                                            : ''
                                                                                    }
                                                                                    ${
                                                                                        status ===
                                                                                        'Lost'
                                                                                            ? 'bg-gray-100 text-gray-800'
                                                                                            : ''
                                                                                    }
                                                                                    ${
                                                                                        status ===
                                                                                        'EIC'
                                                                                            ? 'bg-purple-100 text-purple-800'
                                                                                            : ''
                                                                                    }
                                                                                    ${
                                                                                        status ===
                                                                                        'Distributed'
                                                                                            ? 'bg-blue-100 text-blue-800'
                                                                                            : ''
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        status
                                                                                    }
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-2 px-3 text-blue-700">
                                                                                {
                                                                                    totalQuantity
                                                                                }
                                                                            </td>
                                                                            <td className="py-2 px-3">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedItemStacks(
                                                                                            {
                                                                                                ...selectedItemStacks,
                                                                                                currentStatus:
                                                                                                    status,
                                                                                                currentStacks:
                                                                                                    stacks,
                                                                                            }
                                                                                        );
                                                                                        setShowStacksModal(
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition w-full sm:w-auto"
                                                                                >
                                                                                    Logs
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;
