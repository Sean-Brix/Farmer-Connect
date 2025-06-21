import React, { useState, useEffect } from 'react';
import default_image from '../Assets/default_image.png';
export default function Edit_Modal({ isOpen, onClose, card, setCard }) {
    const [editedItem, setEditedItem] = useState(card);
    const [new_photo, setNew_Photo] = useState('');
    const [showRequests, setShowRequests] = useState(false);
    const closeAll = () => {
        setShowRequests(false);
        onClose();
    };
    if (!isOpen.state && !showRequests) {
        return null;
    }
    if (showRequests) {
        return (
            <RequestModal
                itemId={editedItem.id}
                onClose={() => setShowRequests(false)}
            />
        );
    }
    return isOpen.modal === 'details'
        ? render_details(closeAll, editedItem, () => setShowRequests(true))
        : render_edit(
              closeAll,
              editedItem,
              setEditedItem,
              setCard,
              setNew_Photo,
              new_photo
          );
}
function RequestModal({ itemId, onClose }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [item_name, setItem_Name] = useState('Sample Item');
    const [requestStats, setRequestStats] = useState({
        total: 2,
        pending: 1,
        approved: 1,
        rejected: 0,
        processing: 0,
    });

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/distribution/item_requests?id=${itemId}`
                );
                if (!response.ok) {
                    console.error('Failed to fetch requests:', response);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const requestsData = data?.payload.requests || [];
                setRequests(requestsData);
                setItem_Name(data?.item_name || 'Sample Item');
                // Calculate statistics
                const total = requestsData.length;
                const pending = requestsData.filter(
                    (req) => req.status === 'Waiting'
                ).length;
                const approved = requestsData.filter(
                    (req) => req.status === 'Approved'
                ).length;
                const rejected = requestsData.filter(
                    (req) => req.status === 'Rejected'
                ).length;
                const processing = requestsData.filter(
                    (req) => req.status === 'Processing'
                ).length;
                setRequestStats({
                    total,
                    pending,
                    approved,
                    rejected,
                    processing,
                });
            } catch (e) {
                setError(e);
                console.error('Failed to fetch requests:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [itemId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-lg p-8">
                    Loading requests...
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-lg p-8">
                    Error: {error.message}
                </div>
            </div>
        );
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                    <h2 className="text-2xl font-bold text-gray-900 truncate">
                        Item:{' '}
                        <span className="text-blue-700">"{item_name}"</span>
                    </h2>
                    <button
                        className="text-3xl text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                {/* Stats Section */}
                <div className="px-6 py-4 border-b bg-white">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Request Statistics
                    </h3>
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 min-w-0">
                            <div className="flex flex-col items-center bg-gray-50 rounded-lg p-2 sm:p-3 shadow-sm text-xs sm:text-sm min-w-0">
                                <span className="text-[10px sm:text-xs text-gray-500">
                                    Total
                                </span>
                                <span className="font-bold text-base sm:text-lg text-gray-800">
                                    {requestStats.total}
                                </span>
                            </div>
                            <div className="flex flex-col items-center bg-yellow-50 rounded-lg p-2 sm:p-3 shadow-sm text-xs sm:text-sm min-w-0">
                                <span className="text-[10px] sm:text-xs text-yellow-700">
                                    Pending
                                </span>
                                <span className="font-bold text-base sm:text-lg text-yellow-700">
                                    {requestStats.pending}
                                </span>
                            </div>
                            <div className="flex flex-col items-center bg-blue-50 rounded-lg p-2 sm:p-3 shadow-sm text-xs sm:text-sm min-w-0">
                                <span className="text-[10px] sm:text-xs text-blue-700">
                                    Processing
                                </span>
                                <span className="font-bold text-base sm:text-lg text-blue-700">
                                    {requestStats.processing}
                                </span>
                            </div>
                            <div className="flex flex-col items-center bg-green-50 rounded-lg p-2 sm:p-3 shadow-sm text-xs sm:text-sm min-w-0">
                                <span className="text-[10px] sm:text-xs text-green-700">
                                    Approved
                                </span>
                                <span className="font-bold text-base sm:text-lg text-green-700">
                                    {requestStats.approved}
                                </span>
                            </div>
                            <div className="flex flex-col items-center bg-red-50 rounded-lg p-2 sm:p-3 shadow-sm text-xs sm:text-sm min-w-0">
                                <span className="text-[10px] sm:text-xs text-red-700">
                                    Rejected
                                </span>
                                <span className="font-bold text-base sm:text-lg text-red-700">
                                    {requestStats.rejected}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Requests List */}
                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-white to-blue-50">
                    {requests.length > 0 ? (
                        <ul className="space-y-4">
                            {requests.map((request) => (
                                <li
                                    key={request.id}
                                    className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition hover:shadow-md"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                                User ID: {request.account_id}
                                            </span>
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs font-semibold
${
    request.status === 'Approved'
        ? 'bg-green-100 text-green-700'
        : request.status === 'Rejected'
        ? 'bg-red-100 text-red-700'
        : request.status === 'Processing'
        ? 'bg-blue-100 text-blue-700'
        : request.status === 'Waiting'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-gray-100 text-gray-700'
}`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                            <span>
                                                <strong>Request:</strong>{' '}
                                                {new Date(
                                                    request.created_at
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </span>
                                            <span>
                                                <strong>Schedule:</strong>{' '}
                                                {new Date(
                                                    request.schedule_date
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    }
                                                )}
                                            </span>
                                            <span>
                                                <strong>Quantity:</strong>{' '}
                                                {request.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <>
                                <svg
                                    className="mx-auto mb-2 w-12 h-12 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M7 7a4 4 0 118 0 4 4 0 01-8 0z"
                                    />
                                </svg>
                                <p>No requests found for this item.</p>
                            </>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
function render_details(onClose, editedItem, onShowRequests) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/60">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Added by:</span>
                        <span className="text-sm font-medium text-gray-700">
                            {editedItem.added_by}
                        </span>
                    </div>
                    <button
                        className="text-2xl text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                {/* IMAGE */}
                <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {editedItem.photo ? (
                        <img
                            className="object-cover w-full h-full"
                            src={editedItem.photo}
                            alt="Item"
                        />
                    ) : (
                        <div className="text-gray-400 text-3xl">No Image</div>
                    )}
                </div>
                {/* DETAILS */}
                <div className="px-6 py-6 bg-white">
                    <div className="mb-2">
                        <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                            Item Name
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">
                            {editedItem.name}
                        </h1>
                    </div>
                    <p className="text-gray-600 mb-4">
                        {editedItem.description}
                    </p>
                    {/* REQUEST COUNT */}
                    <button
                        className="px-4 py-2 cursor-pointer rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition shadow"
                        onClick={onShowRequests}
                    >
                        View Requests
                    </button>
                    {/* PROPERTIES */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {/* CATEGORY */}
                        <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default
    ${
        editedItem.category === 'Seeds'
            ? 'bg-blue-100 text-blue-800'
            : editedItem.category === 'Fertilizers'
            ? 'bg-pink-100 text-pink-800'
            : editedItem.category === 'Livestock'
            ? 'bg-purple-100 text-purple-800'
            : editedItem.category === 'Fish Fingerlings'
            ? 'bg-yellow-100 text-yellow-800'
            : editedItem.category === 'Organic Inputs'
            ? 'bg-green-100 text-green-800'
            : editedItem.category === 'Tools'
            ? 'bg-red-100 text-red-800'
            : editedItem.category === 'Plants'
            ? 'bg-indigo-100 text-indigo-800'
            : editedItem.category === 'Compost'
            ? 'bg-orange-100 text-orange-800'
            : 'bg-gray-100 text-gray-800'
    }`}
                            title="Category"
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            {editedItem.category}
                        </span>
                        {/* QUANTITY */}
                        <span
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold cursor-default"
                            title="Quantity in Stock"
                        >
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="2"
                                    ry="2"
                                />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            {editedItem.quantity}
                        </span>
                        {/* STATUS */}
                        <span
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default
    ${
        editedItem.status === 'Available'
            ? 'bg-green-100 text-green-800'
            : editedItem.status === 'Out of Stock'
            ? 'bg-red-100 text-red-800'
            : editedItem.status === 'Scheduled'
            ? 'bg-yellow-100 text-yellow-800'
            : editedItem.status === 'Discontinued'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
    }`}
                            title="Status"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {editedItem.status}
                        </span>
                    </div>
                </div>
                {/* DATES */}
                <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t">
                    {/* CREATED AT */}
                    <div>
                        <span className="block text-xs text-gray-400 font-medium">
                            Created At
                        </span>
                        <span className="block text-sm text-gray-700">
                            {editedItem.created_at
                                ? new Date(
                                      editedItem.created_at
                                  ).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : '-'}
                        </span>
                    </div>
                    {/* UPDATED AT */}
                    <div>
                        <span className="block text-xs text-gray-400 font-medium">
                            Recent Update
                        </span>
                        <span className="block text-sm text-gray-700">
                            {editedItem.updated_at
                                ? new Date(
                                      editedItem.updated_at
                                  ).toLocaleDateString(undefined, {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  })
                                : '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
function render_edit(
    onClose,
    editedItem,
    setEditedItem,
    setCard,
    setNew_Photo,
    new_photo
) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prev) => ({ ...prev, [name]: value }));
    };
    const handleSave = async () => {
        try {
            const response = await fetch('/api/distribution/updateItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editedItem.id,
                    name: editedItem.name,
                    description: editedItem.description,

                    quantity: parseInt(editedItem.quantity),
                    status: editedItem.status,
                    category: editedItem.category,
                }),
            });
            if (response.ok) {
                if (new_photo != '') {
                    const itemId = editedItem.id;
                    const formData = new FormData();
                    formData.append('id', itemId);
                    formData.append('image', new_photo);
                    const imageResponse = await fetch(
                        '/api/distribution/addImage',
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );
                }
                onClose();
                setCard(editedItem);
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert(
                'Failed to update item. Please check the console for errors.'
            );
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[95vh]">
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Edit Item
                    </h2>
                    <button
                        className="text-2xl sm:text-3xl text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>
                {/* FORM */}
                <form
                    className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    style={{ minHeight: 0 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* NAME */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={editedItem.name}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition px-4 py-2 bg-gray-50"
                                placeholder="Name"
                                autoComplete="off"
                            />
                        </div>
                        {/* CATEGORY */}
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={editedItem.category}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition px-4 py-2 bg-gray-50"
                            >
                                <option value="Other">Not Specified</option>
                                <option value="Seeds">Seeds</option>
                                <option value="Fertilizers">Fertilizers</option>
                                <option value="Livestock">Livestock</option>
                                <option value="Fish Fingerlings">
                                    Fish Fingerlings
                                </option>
                                <option value="Organic Inputs">
                                    Organic Inputs
                                </option>
                                <option value="Tools">Tools</option>
                                <option value="Plants">Plants</option>
                                <option value="Compost">Compost</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {/* STATUS */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={editedItem.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition px-4 py-2 bg-gray-50"
                            >
                                <option value="Available">Available</option>
                                <option value="Out of Stock">
                                    Out of Stock
                                </option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Discontinued">
                                    Discontinued
                                </option>
                            </select>
                        </div>

                        {/* QUANTITY */}
                        <div>
                            <label
                                htmlFor="quantity"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={editedItem.quantity}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition px-4 py-2 bg-gray-50"
                                placeholder="Quantity"
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="photo"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Photo
                            </label>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setEditedItem((prev) => ({
                                                ...prev,
                                                photo: reader.result,
                                            }));
                                            setNew_Photo(file);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition px-4 py-2 bg-gray-50"
                            />
                            {/* IMAGE PREVIEW */}
                            <div className="mt-3 flex items-center gap-3">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={editedItem.photo || default_image}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* DESCRIPTION */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={editedItem.description || ''}
                            onChange={handleChange}
                            rows="4"
                            className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition px-4 py-2 bg-gray-50 resize-none"
                            placeholder="Description"
                        ></textarea>
                    </div>
                </form>
                {/* CONTROLS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 border-t bg-gradient-to-r from-blue-50 to-blue-100">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-6 py-2 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        type="button"
                        className="px-6 py-2 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow w-full sm:w-auto"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
