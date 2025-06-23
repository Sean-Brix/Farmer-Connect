import React, { useEffect, useState } from 'react';
import Item_Card from './item_card.jsx';
import default_image from '../../Assets/default_image.png';

export default function All_Items() {
    const [items, setItems] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [newItemModalOpen, setNewItemModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        Name: '',
        description: '',
        quantity: 1,
        status: 'Available',
        category: 'Farming Equipment',
        image: null,
        imagePreview: null,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        fetchItems();
    }, [statusFilter, categoryFilter, search]);

    const fetchItems = async () => {
        const response = await fetch(
            `/api/eic/getAll?status=${statusFilter}&category=${categoryFilter}&search=${search}`
        );
        const data = await response.json();

        if (!data.payload || data.payload.length === 0) {
            setItems([]);
            return;
        }

        const itemsWithImages = await Promise.all(
            data.payload.map(async (item) => {
                try {
                    const imageResponse = await fetch(
                        `/api/eic/getImage?id=${item.id}`
                    );
                    if (imageResponse.ok) {
                        if (imageResponse.status === 204) {
                            return { ...item, photo: default_image };
                        }
                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);
                        return { ...item, photo: imageUrl };
                    } else {
                        return { ...item, photo: default_image };
                    }
                } catch (error) {
                    console.error('Error fetching image:', error);
                    return { ...item, photo: default_image };
                }
            })
        );
        setItems(itemsWithImages);
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to delete.');
            return;
        }

        try {
            const deletePromises = selectedItems.map(async (id) => {
                const response = await fetch(`/api/eic/deleteEIC?id=${id}`);
                const data = await response.json();

                if (response.ok && data.status === 'Success') {
                    return true;
                } else {
                    console.error(
                        `Failed to delete item with id ${id}: ${
                            data.message || 'Unknown error'
                        }`
                    );
                    return false;
                }
            });

            const results = await Promise.all(deletePromises);
            if (results.every((result) => result)) {
                alert('Items deleted successfully.');
                setItems(
                    items.filter((item) => !selectedItems.includes(item.id))
                );
                setSelectedItems([]);
                setIsDeleting(false);
            } else {
                alert(
                    'Some items failed to delete. Please check the console for errors.'
                );
            }
        } catch (error) {
            console.error('Error deleting items:', error);
            alert('Failed to delete items. Please try again.');
        }
    };

    const toggleSelectItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };
    const handleCancelDelete = () => {
        setIsDeleting(false);
        setSelectedItems([]);
    };
    const handleItemClick = (itemId) => {
        if (isDeleting) {
            toggleSelectItem(itemId);
        }
    };

    const handleOpenNewItemModal = () => {
        setNewItemModalOpen(true);
    };
    const handleCloseNewItemModal = () => {
        setNewItemModalOpen(false);
        setNewItem({
            Name: '',
            description: '',
            quantity: 1,
            status: 'Available',
            category: 'Farming Equipment',
            image: null,
            imagePreview: null,
        });
    };
    const handleNewItemInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };
    const handleNewItemImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({
                    ...newItem,
                    image: file,
                    imagePreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        } else {
            setNewItem({ ...newItem, image: null, imagePreview: null });
        }
    };
    const handleCreateNewItem = async () => {
        try {
            const response = await fetch('/api/eic/addNew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: newItem.Name,
                    description: newItem.description,
                    quantity: newItem.quantity,
                    status: newItem.status,
                    category: newItem.category,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newItemId = data.payload[0].id;

                let photo = default_image;

                if (newItem.image) {
                    const formData = new FormData();
                    formData.append('id', newItemId);
                    formData.append('image', newItem.image);

                    const imageResponse = await fetch('/api/eic/addImage', {
                        method: 'POST',
                        body: formData,
                    });

                    if (imageResponse.ok) {
                        const imageFetchResponse = await fetch(
                            `/api/eic/getImage?id=${newItemId}`
                        );
                        if (imageFetchResponse.ok) {
                            const imageBlob = await imageFetchResponse.blob();
                            photo = URL.createObjectURL(imageBlob);
                        } else {
                            console.error('Failed to fetch image after upload');
                        }
                    } else {
                        console.error(
                            'Failed to upload image:',
                            imageResponse.status
                        );
                    }
                }

                const newItemWithImage = { ...data.payload[0], photo };
                setItems([newItemWithImage, ...items]);
                handleCloseNewItemModal();
            } else {
                console.error('Failed to create new item:', response.status);
            }
        } catch (error) {
            alert('Cannot add item, Something went wrong');
            console.error('Error creating new item:', error);
        }
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Reset to first page when filters/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, categoryFilter, search]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto gap-4 px-4 py-4">
                {/* Filters and Actions */}
                <div className="flex-1 flex flex-col md:flex-row gap-3 w-full">
                    {/* Search */}
                    <div className="relative w-full max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800 bg-white"
                        />
                    </div>
                    {/* Category */}
                    <select
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full md:w-48 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
                    >
                        <option value="">All Categories</option>
                        <option value="Farming Equipment">Farming Equipment</option>
                        <option value="Harvesting Tools">Harvesting Tools</option>
                        <option value="Irrigation Systems">Irrigation Systems</option>
                        <option value="Storage Equipment">Storage Equipment</option>
                        <option value="Processing Equipment">Processing Equipment</option>
                        <option value="Safety Gear">Safety Gear</option>
                        <option value="Pest Control">Pest Control</option>
                        <option value="Livestock Equipment">Livestock Equipment</option>
                        <option value="Measuring Tools">Measuring Tools</option>
                        <option value="Fisheries">Fisheries</option>
                        <option value="Machinery">Machinery</option>
                        <option value="Other">Other</option>
                    </select>
                    {/* Status */}
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-40 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
                        defaultValue=""
                    >
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                        <option value="Borrowed">Borrowed</option>
                    </select>
                </div>
                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0 w-full sm:w-auto">
                                    <button
                                        className="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-white transition w-full sm:w-auto"
                                        onClick={handleOpenNewItemModal}
                                    >
                                        New Item
                                    </button>
                                    {isDeleting ? (
                                        <>
                                            <button
                                                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition w-full sm:w-auto"
                                                onClick={handleDelete}
                                            >
                                                Delete Selected
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-800 transition w-full sm:w-auto"
                                                onClick={handleCancelDelete}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-400 hover:bg-red-500 text-white transition w-full sm:w-auto"
                                            onClick={() => setIsDeleting(true)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mx-auto p-2">
                                {currentItems.length === 0 ? (
                                    <div className="text-center w-full text-gray-500 py-12">No items found</div>
                                ) : (
                                    currentItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative"
                                            onClick={() => handleItemClick(item.id)}
                                        >
                                            {isDeleting && (
                                                <input
                                                    type="checkbox"
                                                    className="absolute top-2 left-2 z-10 accent-gray-600"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleSelectItem(item.id)}
                                                />
                                            )}
                                            <Item_Card
                                                key={item.id}
                                                item={item}
                                                isSelected={selectedItems.includes(item.id)}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 mb-4">
                    <nav className="flex items-center gap-1 bg-white rounded-lg shadow px-3 py-2" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 flex items-center justify-center rounded transition text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Previous"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {totalPages > 6 ? (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded font-semibold ${
                                        currentPage === 1 ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >1</button>
                                {currentPage > 3 && <span className="px-1 text-gray-400">...</span>}
                                {Array.from({ length: 3 }, (_, i) => {
                                    const page = Math.max(2, Math.min(currentPage - 1 + i, totalPages - 2));
                                    if (page <= 1 || page >= totalPages) return null;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-8 h-8 flex items-center justify-center rounded font-semibold ${
                                                currentPage === page ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >{page}</button>
                                    );
                                })}
                                {currentPage < totalPages - 2 && <span className="px-1 text-gray-400">...</span>}
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className={`w-8 h-8 flex items-center justify-center rounded font-semibold ${
                                        currentPage === totalPages ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >{totalPages}</button>
                            </>
                        ) : (
                            Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 flex items-center justify-center rounded font-semibold ${
                                        currentPage === i + 1 ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >{i + 1}</button>
                            ))
                        )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-8 h-8 flex items-center justify-center rounded transition text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Next"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </nav>
                </div>
            )}

            {/* New Item Modal */}
            {newItemModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <form
                        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-2 max-h-[95vh] flex flex-col"
                        style={{ minWidth: 280 }}
                        onSubmit={e => {
                            e.preventDefault();
                            handleCreateNewItem();
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b px-5 py-4 bg-gray-50 rounded-t-xl">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Add New Item
                            </h2>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition"
                                onClick={handleCloseNewItemModal}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col md:flex-row gap-6 px-5 py-6 overflow-y-auto">
                            {/* Form Fields */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="Name"
                                        value={newItem.Name}
                                        onChange={handleNewItemInputChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleNewItemInputChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 resize-none"
                                        required
                                        rows={3}
                                    />
                                </div>
                                <div className="flex gap-3 flex-col sm:flex-row">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={newItem.quantity}
                                            min={1}
                                            onChange={handleNewItemInputChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={newItem.status}
                                            onChange={handleNewItemInputChange}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                            required
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Returned">Returned</option>
                                            <option value="Reserved">Reserved</option>
                                            <option value="Borrowed">Borrowed</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={newItem.category}
                                        onChange={handleNewItemInputChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                        required
                                    >
                                        <option value="Farming Equipment">Farming Equipment</option>
                                        <option value="Harvesting Tools">Harvesting Tools</option>
                                        <option value="Irrigation Systems">Irrigation Systems</option>
                                        <option value="Storage Equipment">Storage Equipment</option>
                                        <option value="Processing Equipment">Processing Equipment</option>
                                        <option value="Safety Gear">Safety Gear</option>
                                        <option value="Pest Control">Pest Control</option>
                                        <option value="Livestock Equipment">Livestock Equipment</option>
                                        <option value="Measuring Tools">Measuring Tools</option>
                                        <option value="Fisheries">Fisheries</option>
                                        <option value="Machinery">Machinery</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            {/* Image Upload */}
                            <div className="flex flex-col items-center gap-3 w-full md:w-48">
                                <label className="block text-xs font-medium text-gray-600 mb-1 self-start">
                                    Upload Image <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="image"
                                    name="image"
                                    onChange={handleNewItemImageChange}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                />
                                <div className="w-full flex justify-center">
                                    {newItem.imagePreview ? (
                                        <img
                                            src={newItem.imagePreview}
                                            alt="Image Preview"
                                            className="w-full max-w-[160px] max-h-[160px] bg-gray-50 object-cover mt-2 rounded-lg border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-full max-w-[160px] max-h-[160px] bg-gray-50 mt-2 rounded-lg border border-gray-200 flex items-center justify-center text-gray-300 text-sm h-[120px]">
                                            No image
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg py-2 px-5 transition"
                                onClick={handleCloseNewItemModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg py-2 px-7 transition"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
