import React, { useEffect, useState } from 'react';
import Item_Card from './Item_Card.jsx';
import default_image from '../Assets/default_image.png';
export default function All_Items() {
    const [items, setItems] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [newItemModalOpen, setNewItemModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        quantity: 1,
        status: 'Available',
        category: 'Seeds',
        image: null,
        imagePreview: null,
    });
    const [originalItems, setOriginalItems] = useState([]); // Store original fetched items

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        // Apply filters and search on client-side
        let filteredItems = originalItems;

        if (statusFilter) {
            filteredItems = filteredItems.filter(
                (item) => item.status === statusFilter
            );
        }

        if (categoryFilter) {
            filteredItems = filteredItems.filter(
                (item) => item.category === categoryFilter
            );
        }

        if (search) {
            filteredItems = filteredItems.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setItems(filteredItems);
    }, [statusFilter, categoryFilter, search, originalItems]);

    const fetchItems = async () => {
        try {
            const response = await fetch(
                `/api/distribution/getAll?status=${statusFilter}&category=${categoryFilter}&search=${search}`
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
                            `/api/distribution/getImage?id=${item.id}`
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
            setOriginalItems(itemsWithImages);
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        }
    };

    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to delete.');
            return;
        }

        try {
            const deletePromises = selectedItems.map(async (id) => {
                const response = await fetch(
                    `/api/distribution/deleteDist?id=${id}`
                );
                const data = await response.json();
                console.log(data);

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
                const updatedItems = items.filter(
                    (item) => !selectedItems.includes(item.id)
                );
                setItems(updatedItems);
                setOriginalItems(
                    originalItems.filter(
                        (item) => !selectedItems.includes(item.id)
                    )
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
            name: '',
            description: '',
            quantity: 1,
            status: 'Available',
            category: 'Seeds',
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
            const response = await fetch('/api/distribution/addNew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newItem.name,
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

                    const imageResponse = await fetch(
                        '/api/distribution/addImage',
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );

                    if (imageResponse.ok) {
                        const imageFetchResponse = await fetch(
                            `/api/distribution/getImage?id=${newItemId}`
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
                const newItemWithImage = {
                    ...data.payload[0],
                    photo,
                };
                setItems([newItemWithImage, ...items]);
                setOriginalItems([newItemWithImage, ...originalItems]);
                handleCloseNewItemModal();
            } else {
                console.error('Failed to create new item:', response.status);
                alert('Failed to create new item.');
            }
        } catch (error) {
            alert('Cannot add item, Something went wrong');
            console.error('Error creating new item:', error);
        }
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Calculate paginated items
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
                <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
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
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Livestock">Livestock</option>
                        <option value="Fish Fingerlings">
                            Fish Fingerlings
                        </option>
                        <option value="Organic Inputs">Organic Inputs</option>
                        <option value="Tools">Tools</option>
                        <option value="Plants">Plants</option>
                        <option value="Compost">Compost</option>
                        <option value="Other">Other</option>
                    </select>
                    <select
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-44 border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 shadow"
                        defaultValue=""
                    >
                        <option value="">All Items</option>
                        <option value="Available">Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Discontinued">Discontinued</option>
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
            {/* Modern Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                    <button
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                            currentPage === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-green-100 text-green-600'
                        } shadow`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => {
                        // Show first, last, current, and neighbors, with ellipsis
                        if (
                            i === 0 ||
                            i === totalPages - 1 ||
                            Math.abs(currentPage - (i + 1)) <= 1
                        ) {
                            return (
                                <button
                                    key={i + 1}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                                        currentPage === i + 1
                                            ? 'bg-green-500 text-white shadow'
                                            : 'bg-white hover:bg-green-100 text-green-600'
                                    }`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            );
                        }
                        // Ellipsis logic
                        if (
                            (i === 1 && currentPage > 3) ||
                            (i === totalPages - 2 && currentPage < totalPages - 2)
                        ) {
                            return (
                                <span key={i} className="px-2 text-gray-400 select-none">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}
                    <button
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                            currentPage === totalPages
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-green-100 text-green-600'
                        } shadow`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
            {newItemModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 ">
                    <div className="relative w-full max-w-md mx-2 sm:mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-gray-100 max-h-[90vh] overflow-y-auto transition-all duration-300">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                                onClick={handleCloseNewItemModal}
                                aria-label="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Add New Item</h2>
                            <form
                                className="space-y-4"
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleCreateNewItem();
                                }}
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-gray-700 text-sm font-semibold mb-1"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newItem.name}
                                        onChange={handleNewItemInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-gray-700 text-sm font-semibold mb-1"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={newItem.description}
                                        onChange={handleNewItemInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <label
                                            htmlFor="quantity"
                                            className="block text-gray-700 text-sm font-semibold mb-1"
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={newItem.quantity}
                                            onChange={handleNewItemInputChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                            min={1}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            htmlFor="status"
                                            className="block text-gray-700 text-sm font-semibold mb-1"
                                        >
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={newItem.status}
                                            onChange={handleNewItemInputChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Out of Stock">Out of Stock</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Discontinued">Discontinued</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="block text-gray-700 text-sm font-semibold mb-1"
                                    >
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={newItem.category}
                                        onChange={handleNewItemInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                    >
                                        <option value="Seeds">Seeds</option>
                                        <option value="Fertilizers">Fertilizers</option>
                                        <option value="Livestock">Livestock</option>
                                        <option value="Fish Fingerlings">Fish Fingerlings</option>
                                        <option value="Organic Inputs">Organic Inputs</option>
                                        <option value="Tools">Tools</option>
                                        <option value="Plants">Plants</option>
                                        <option value="Compost">Compost</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="image"
                                        className="block text-gray-700 text-sm font-semibold mb-1"
                                    >
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleNewItemImageChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                    />
                                    {newItem.imagePreview && (
                                        <img
                                            src={newItem.imagePreview}
                                            alt="Image Preview"
                                            className="mt-3 rounded-lg border max-h-40 mx-auto"
                                        />
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg transition focus:outline-none"
                                        onClick={handleCloseNewItemModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition focus:outline-none"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
