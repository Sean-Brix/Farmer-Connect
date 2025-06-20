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
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 max-w-7xl mx-auto gap-4 p-6">
                {/* ...filters and buttons (unchanged) */}
                <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                    {/* ...search, category, status filters */}
                    <div className="relative w-full max-w-lg">
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
                            placeholder="Search programs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-black bg-white shadow"
                        />
                    </div>
                    <select
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full md:w-50 border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 shadow"
                    >
                        <option value="">All Category</option>
                        <option value="Farming Equipment">
                            Farming Equipment
                        </option>
                        <option value="Harvesting Tools">
                            Harvesting Tools
                        </option>
                        <option value="Irrigation Systems">
                            Irrigation Systems
                        </option>
                        <option value="Storage Equipment">
                            Storage Equipment
                        </option>
                        <option value="Processing Equipment">
                            Processing Equipment
                        </option>
                        <option value="Safety Gear">Safety Gear</option>
                        <option value="Pest Control">Pest Control</option>
                        <option value="Livestock Equipment">
                            Livestock Equipment
                        </option>
                        <option value="Measuring Tools">Measuring Tools</option>
                        <option value="Fisheries">Fisheries</option>
                        <option value="Machinery">Machinery</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-44 border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 shadow"
                        defaultValue=""
                    >
                        <option value="">All Items</option>
                        <option value="Available">Available</option>
                        <option value="Not Available">Not Available</option>
                        <option value="Borrowed">Borrowed</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        className="flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium shadow bg-green-500 hover:bg-green-600 text-white transition-all"
                        onClick={handleOpenNewItemModal}
                    >
                        New Item
                    </button>
                    {isDeleting ? (
                        <>
                            <button
                                className="flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium shadow bg-red-600 hover:bg-red-700 text-white transition-all"
                                onClick={handleDelete}
                            >
                                Delete Selected
                            </button>
                            <button
                                className="flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium shadow bg-gray-400 hover:bg-gray-500 text-white transition-all"
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="flex items-center justify-center px-4 py-1.5 rounded-lg text-sm font-medium shadow bg-red-500 hover:bg-red-600 text-white transition-all"
                            onClick={() => setIsDeleting(true)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-auto p-4 rounded-2xl">
                {currentItems.length === 0 ? (
                    <div className="text-center w-full">No items found</div>
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
                                    className="absolute top-2 left-2 z-10"
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

            {/* Pagination Controls (unchanged) */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 mb-2">
                    <nav className="flex items-center gap-1 bg-white rounded-xl shadow px-4 py-2 mb-8" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-blue-100 hover:text-blue-600 ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Previous"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {totalPages > 6 ? (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
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
                                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
                                            }`}
                                        >{page}</button>
                                    );
                                })}
                                {currentPage < totalPages - 2 && <span className="px-1 text-gray-400">...</span>}
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
                                    }`}
                                >{totalPages}</button>
                            </>
                        ) : (
                            Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-all font-semibold ${
                                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-100'
                                    }`}
                                >{i + 1}</button>
                            ))
                        )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-blue-100 hover:text-blue-600 ${
                                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Next"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </nav>
                </div>
            )}

            {/* Responsive New Item Modal */}
            {newItemModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <form
                        className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-2xl max-h-[95vh] relative border border-blue-200 flex flex-col"
                        style={{ minWidth: 320 }}
                        onSubmit={e => {
                            e.preventDefault();
                            handleCreateNewItem();
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-blue-100 px-6 md:px-8 py-5 bg-gradient-to-r from-blue-500/10 to-blue-100 rounded-t-3xl">
                            <h2 className="text-xl font-bold text-blue-700 tracking-tight">
                                Add New Item
                            </h2>
                            <button
                                type="button"
                                className="text-blue-400 hover:text-blue-700 text-3xl leading-none transition"
                                onClick={handleCloseNewItemModal}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col md:flex-row gap-8 md:gap-10 px-6 md:px-8 py-8 overflow-y-auto">
                            {/* Left: Form Fields */}
                            <div className="flex-1 flex flex-col gap-5">
                                <div>
                                    <label className="block text-xs font-semibold text-blue-600 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="Name"
                                        value={newItem.Name}
                                        onChange={handleNewItemInputChange}
                                        className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-blue-600 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleNewItemInputChange}
                                        className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
                                        required
                                        rows={3}
                                    />
                                </div>
                                <div className="flex gap-3 flex-col sm:flex-row">
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-blue-600 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={newItem.quantity}
                                            min={1}
                                            onChange={handleNewItemInputChange}
                                            className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-semibold text-blue-600 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={newItem.status}
                                            onChange={handleNewItemInputChange}
                                            className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
                                    <label className="block text-xs font-semibold text-blue-600 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={newItem.category}
                                        onChange={handleNewItemInputChange}
                                        className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                        required
                                    >
                                        <option value="Farming Equipment">
                                            Farming Equipment
                                        </option>
                                        <option value="Harvesting Tools">
                                            Harvesting Tools
                                        </option>
                                        <option value="Irrigation Systems">
                                            Irrigation Systems
                                        </option>
                                        <option value="Storage Equipment">
                                            Storage Equipment
                                        </option>
                                        <option value="Processing Equipment">
                                            Processing Equipment
                                        </option>
                                        <option value="Safety Gear">Safety Gear</option>
                                        <option value="Pest Control">
                                            Pest Control
                                        </option>
                                        <option value="Livestock Equipment">
                                            Livestock Equipment
                                        </option>
                                        <option value="Measuring Tools">
                                            Measuring Tools
                                        </option>
                                        <option value="Fisheries">Fisheries</option>
                                        <option value="Machinery">Machinery</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            {/* Right: Image Upload */}
                            <div className="flex flex-col items-center gap-4 w-full md:w-64">
                                <label className="block text-xs font-semibold text-blue-600 mb-1 self-start">
                                    Upload Image <span className="text-blue-300">(optional)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="image"
                                    name="image"
                                    onChange={handleNewItemImageChange}
                                    className="w-full border border-blue-100 rounded-xl px-3 py-2 bg-blue-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                                />
                                <div className="w-full flex justify-center">
                                    {newItem.imagePreview ? (
                                        <img
                                            src={newItem.imagePreview}
                                            alt="Image Preview"
                                            className="w-full max-w-[200px] max-h-[200px] bg-blue-50 object-cover mt-2 rounded-xl border border-blue-200 shadow"
                                        />
                                    ) : (
                                        <div className="w-full max-w-[200px] max-h-[200px] bg-blue-50 mt-2 rounded-xl border border-blue-200 flex items-center justify-center text-blue-200 text-sm">
                                            No image
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 md:px-8 py-5 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-b-3xl flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-xl py-2 px-6 transition-colors shadow focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                onClick={handleCloseNewItemModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 px-8 transition-colors shadow focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
