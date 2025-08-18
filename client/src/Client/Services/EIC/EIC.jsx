import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';

// ASSETS
import default_image from './Assets/default_image.jpg';

// TANSTACK QUERY HOOKS
import { useEICEquipment, useUserRequests, useSubmitRequest, useCancelRequest } from './hooks/useEICQueries';

// COMPONENTS
import EICLoadingState from './components/EICLoadingState';
import EICErrorState from './components/EICErrorState';
import EICSearchAndFilters from './components/EICSearchAndFilters';
import EICEquipmentCard from './components/EICEquipmentCard';
import EICPagination from './components/EICPagination';

// UTILITIES
import { showSuccessAlert, showErrorAlert, showLoginPrompt } from './utils/alertUtils';

const ITEMS_PER_PAGE = 8;

export default function Eic() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        pickupDate: '',
        returnDate: '',
        request_note: '',
        quantity: 1,
    });
    const [myRequests, setMyRequests] = useState([]);
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // TANSTACK QUERY HOOKS
    const { 
        data: equipmentList = [], 
        isLoading, 
        error, 
        refetch 
    } = useEICEquipment();

    const {
        data: userRequests = [],
        refetch: refetchRequests,
        error: requestsError
    } = useUserRequests();

    // MUTATIONS
    const submitRequestMutation = useSubmitRequest();
    const cancelRequestMutation = useCancelRequest();

    const categories = [
        'All',
        ...Array.from(new Set(equipmentList.map((i) => i.category))),
    ];

    const filteredItems = equipmentList.filter(
        (i) =>
            (filter === 'All' || i.category === filter) &&
            (search === '' ||
                (i.Name &&
                    i.Name.toLowerCase().includes(search.toLowerCase())) ||
                (i.category &&
                    i.category.toLowerCase().includes(search.toLowerCase())) ||
                (i.description &&
                    i.description.toLowerCase().includes(search.toLowerCase())))
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

    // Type icon helper function
    const typeIcon = (type) => {
        if (type === 'Farming Equipment')
            return <i className="fa-solid fa-seedling text-green-600"></i>;
        if (type === 'Harvesting Tools')
            return <i className="fa-solid fa-hand-holding text-green-700"></i>;
        if (type === 'Irrigation Systems')
            return <i className="fa-solid fa-tint text-green-500"></i>;
        if (type === 'Storage Equipment')
            return <i className="fa-solid fa-warehouse text-gray-600"></i>;
        if (type === 'Processing Equipment')
            return <i className="fa-solid fa-industry text-gray-700"></i>;
        if (type === 'Safety Gear')
            return <i className="fa-solid fa-shield-alt text-green-800"></i>;
        if (type === 'Pest Control')
            return <i className="fa-solid fa-bug text-gray-600"></i>;
        if (type === 'Livestock Equipment')
            return <i className="fa-solid fa-horse text-green-700"></i>;
        if (type === 'Measuring Tools')
            return <i className="fa-solid fa-ruler-combined text-gray-600"></i>;
        if (type === 'Fisheries')
            return <i className="fa-solid fa-fish text-green-600"></i>;
        if (type === 'Machinery')
            return <i className="fa-solid fa-tractor text-gray-700"></i>;
        return <i className="fa-solid fa-toolbox text-gray-500"></i>;
    };

    // SEND REQUEST
    const handleRequestClick = async (item) => {
        try {
            setSelectedItem(item);
            setModalOpen(true);
        } catch (e) {
            console.error('Request EIC Item error:', e);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // Form validation function
    const validateForm = () => {
        const errors = {};

        if (!requestData.pickupDate) {
            errors.pickupDate = 'Pickup date is required';
        } else if (
            new Date(requestData.pickupDate) < new Date().setHours(0, 0, 0, 0)
        ) {
            errors.pickupDate = 'Pickup date cannot be in the past';
        }

        if (requestData.returnDate) {
            if (requestData.returnDate < requestData.pickupDate) {
                errors.returnDate = 'Return date must be after pickup date';
            } else if (requestData.returnDate === requestData.pickupDate) {
                errors.returnDate =
                    'Return date cannot be the same as pickup date';
            }
        }

        if (!requestData.quantity || requestData.quantity < 1) {
            errors.quantity = 'Quantity must be at least 1';
        } else if (requestData.quantity > selectedItem?.quantity) {
            errors.quantity = 'Quantity exceeds available stock';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // SUBMIT REQUEST
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        try {
            await submitRequestMutation.mutateAsync({
                selectedItem,
                requestData
            });

            showSuccessAlert('Request submitted successfully!');
            setModalOpen(false);
            setRequestData({
                pickupDate: '',
                returnDate: '',
                request_note: '',
                quantity: 1,
            });
            setFormErrors({});
        } catch (error) {
            console.error('Error submitting request:', error);
            
            if (error.message === 'ADMIN_CANNOT_BORROW') {
                showErrorAlert('Admin cannot borrow an EIC item');
            } else {
                showErrorAlert('Error submitting request');
            }
            
            setModalOpen(false);
            setRequestData({
                pickupDate: '',
                returnDate: '',
                request_note: '',
                quantity: 1,
            });
            setFormErrors({});
        }
    };

    const handleMyRequestsClick = async () => {
        try {
            const requestsData = await refetchRequests();
            
            if (requestsData.error?.message === 'UNAUTHORIZED') {
                showLoginPrompt(navigate);
                return;
            }
            
            setMyRequests(requestsData.data || []);
            setShowMyRequestsModal(true);
        } catch (error) {
            console.error('Error fetching user requests:', error);
            
            if (error.message === 'UNAUTHORIZED') {
                showLoginPrompt(navigate);
            } else {
                showErrorAlert('Failed to fetch your requests');
            }
        }
    };

    const handleCloseMyRequestsModal = () => {
        setShowMyRequestsModal(false);
    };

    const handleCancelRequest = async (requestId, itemName) => {
        try {
            // Show confirmation dialog
            const confirmed = await showConfirmationDialog(itemName);
            if (!confirmed) return;

            await cancelRequestMutation.mutateAsync({ requestId });
            
            showSuccessAlert('Request cancelled successfully!');
            
            // Refresh the requests list
            const requestsData = await refetchRequests();
            setMyRequests(requestsData.data || []);
        } catch (error) {
            console.error('Error cancelling request:', error);
            showErrorAlert(error.message || 'Network error. Please try again later.');
        }
    };

    // Confirmation dialog helper
    const showConfirmationDialog = (itemName) => {
        return new Promise((resolve) => {
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div id="custom-confirm-alert" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    z-index: 9999;
                    background: white;
                    color: #374151;
                    padding: 2rem 3rem;
                    border-radius: 2rem;
                    box-shadow: 0 12px 40px 0 rgba(0,0,0,0.15);
                    font-size: 1.18rem;
                    font-weight: 700;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    min-width: 400px;
                    max-width: 90vw;
                    animation: confirmAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                    overflow: hidden;
                    text-align: center;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fef3c7;
                        border-radius: 50%;
                        width: 3rem;
                        height: 3rem;
                        box-shadow: 0 2px 8px 0 rgba(251,191,36,0.10);
                    ">
                        <i class="fa-solid fa-exclamation-triangle" style="font-size:1.5rem; color: #d97706; filter: drop-shadow(0 2px 8px #d97706);"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem; color: #374151;">Cancel Request</h3>
                        <p style="margin: 0; font-weight: 400; color: #6b7280; font-size: 1rem;">
                            Are you sure you want to cancel your request for <strong>"${itemName}"</strong>?
                            <br><br>This action cannot be undone.
                        </p>
                    </div>
                    <div style="display: flex; gap: 1rem; width: 100%;">
                        <button id="confirm-cancel-btn" style="
                            flex: 1;
                            background: #dc2626;
                            border: none;
                            color: #fff;
                            padding: 0.75rem 1.5rem;
                            border-radius: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 1rem;
                        ">Yes, Cancel Request</button>
                        <button id="keep-request-btn" style="
                            flex: 1;
                            background: #16a34a;
                            border: 2px solid #16a34a;
                            color: #fff;
                            padding: 0.75rem 1.5rem;
                            border-radius: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 1rem;
                        ">Keep Request</button>
                    </div>
                </div>
                <style>
                    @keyframes confirmAlertPopIn {
                        0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                        60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                    }
                    #confirm-cancel-btn:hover { background: #b91c1c; transform: translateY(-2px); }
                    #keep-request-btn:hover { background: #15803d; transform: translateY(-2px); }
                </style>
            `;
            document.body.appendChild(alertDiv);

            document.getElementById('confirm-cancel-btn').onclick = () => {
                document.body.removeChild(alertDiv);
                resolve(true);
            };

            document.getElementById('keep-request-btn').onclick = () => {
                document.body.removeChild(alertDiv);
                resolve(false);
            };
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <>
                <Navbar />
                <EICLoadingState />
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Navbar />
                <EICErrorState error={error} onRetry={refetch} />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div
                className="flex min-h-screen bg-white relative"
                style={{ overflow: 'hidden' }}
            >
                <main className="flex-1 w-full relative z-10 mt-30">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-[8vh]">
                        <header className="flex flex-col items-center mb-12 w-full">
                            <span className="uppercase tracking-widest text-gray-600 text-xs font-semibold mb-1 letter-spacing-wide">
                                Welcome to
                            </span>
                            <h1 className="text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center eic-title text-gray-800">
                                Equipment, Inputs & Commodities
                            </h1>
                            <div className="mt-4 w-24 h-2 rounded-full bg-green-500 shadow-lg"></div>
                        </header>

                        <EICSearchAndFilters
                            search={search}
                            setSearch={setSearch}
                            filter={filter}
                            setFilter={setFilter}
                            showFilter={showFilter}
                            setShowFilter={setShowFilter}
                            categories={categories}
                            typeIcon={typeIcon}
                            onMyRequestsClick={handleMyRequestsClick}
                        />

                        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                            {filteredItems.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 py-16 text-lg font-semibold tracking-wide">
                                    No equipment found.
                                </div>
                            ) : (
                                paginatedItems.map((item) => (
                                    <EICEquipmentCard
                                        key={item.id}
                                        item={item}
                                        onRequestClick={handleRequestClick}
                                        typeIcon={typeIcon}
                                    />
                                ))
                            )}
                        </div>

                        <EICPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    </section>
                </main>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all pt-20 sm:pt-20 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-lg w-full relative overflow-hidden animate-fade-in border-2 border-gray-300 mt-8 sm:mt-6 md:mt-4 max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-5rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b-2 border-gray-200 bg-green-600">
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                <i className="fa-solid fa-paper-plane mr-2"></i>
                                Request Equipment
                            </h2>
                            <button
                                className="text-white text-xl sm:text-2xl hover:text-green-200 transition"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <form
                            onSubmit={handleSubmit}
                            className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 space-y-4 sm:space-y-5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={selectedItem?.img}
                                    alt={selectedItem?.Name}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-gray-300 shadow"
                                />
                                <div className="flex-1">
                                    <div className="text-lg font-semibold text-gray-800 truncate">
                                        {selectedItem?.Name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {selectedItem?.category}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Available Stock:{' '}
                                        {selectedItem?.quantity}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-700">
                                    <i className="fa-solid fa-info-circle mr-2 text-green-600"></i>
                                    <span className="text-red-500">*</span>{' '}
                                    indicates required fields
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="pickupDate"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Pickup Date{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="pickupDate"
                                        name="pickupDate"
                                        value={requestData.pickupDate}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-xl border-2 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition ${
                                            formErrors.pickupDate
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300'
                                        }`}
                                        required
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                    />
                                    {formErrors.pickupDate && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors.pickupDate}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="returnDate"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Expected Return Date
                                        <span className="text-gray-400 text-xs ml-1">
                                            (Optional)
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        id="returnDate"
                                        name="returnDate"
                                        value={requestData.returnDate}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            if (
                                                e.target.value &&
                                                e.target.value <
                                                    requestData.pickupDate
                                            ) {
                                                setRequestData((prevData) => ({
                                                    ...prevData,
                                                    pickupDate: e.target.value,
                                                    returnDate: e.target.value,
                                                }));
                                            }
                                        }}
                                        className={`w-full rounded-xl border-2 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition ${
                                            formErrors.returnDate
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300'
                                        }`}
                                        min={
                                            requestData.pickupDate
                                                ? requestData.pickupDate
                                                : new Date()
                                                      .toISOString()
                                                      .split('T')[0]
                                        }
                                    />
                                    {formErrors.returnDate && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors.returnDate}
                                        </p>
                                    )}
                                    {!formErrors.returnDate &&
                                        requestData.returnDate &&
                                        requestData.returnDate <
                                            requestData.pickupDate && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Return date must be after pickup
                                                date.
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div>
                                <div>
                                    <label
                                        htmlFor="quantity"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Quantity{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={requestData.quantity}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-xl border-2 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition ${
                                            formErrors.quantity
                                                ? 'border-red-400 bg-red-50'
                                                : 'border-gray-300'
                                        }`}
                                        required
                                        min="1"
                                        max={selectedItem?.quantity}
                                        title=""
                                    />
                                    {formErrors.quantity && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors.quantity}
                                        </p>
                                    )}
                                    {!formErrors.quantity &&
                                        requestData.quantity >
                                            selectedItem?.quantity && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Quantity exceeds available
                                                stock.
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="request_note"
                                    className="block text-gray-700 text-sm font-medium mb-1"
                                >
                                    Purpose & Additional Notes
                                    <span className="text-gray-400 text-xs ml-1">
                                        (Optional)
                                    </span>
                                </label>
                                <textarea
                                    id="request_note"
                                    name="request_note"
                                    value={requestData.request_note}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full rounded-xl border-2 border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition resize-none"
                                    placeholder="Describe the purpose of borrowing this equipment and any special requirements..."
                                ></textarea>
                            </div>

                            {/* Request Summary */}
                            {requestData.pickupDate && requestData.quantity && (
                                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        <i className="fa-solid fa-clipboard-check mr-2 text-green-600"></i>
                                        Request Summary
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Pickup Date:</span>
                                            <span className="font-medium">
                                                {new Date(
                                                    requestData.pickupDate
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        {requestData.returnDate && (
                                            <div className="flex justify-between">
                                                <span>Expected Return:</span>
                                                <span className="font-medium">
                                                    {new Date(
                                                        requestData.returnDate
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span>Quantity:</span>
                                            <span className="font-medium">
                                                {requestData.quantity} unit(s)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 sm:px-5 py-2 rounded-xl transition border-2 border-gray-300 focus:outline-none order-2 sm:order-1"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        !requestData.pickupDate ||
                                        !requestData.quantity
                                    }
                                    className={`font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-md transition border-2 focus:outline-none order-1 sm:order-2 ${
                                        !requestData.pickupDate ||
                                        !requestData.quantity
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                                            : 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700'
                                    }`}
                                >
                                    <i className="fa-solid fa-paper-plane mr-2"></i>
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showMyRequestsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all pt-24 sm:pt-20 md:pt-16 lg:pt-20 px-2 sm:px-4 md:px-6">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-6xl w-full mx-2 sm:mx-4 relative overflow-hidden animate-fade-in max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-5rem)] lg:max-h-[90vh] flex flex-col border-2 border-gray-300 mt-8 sm:mt-6 md:mt-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b-2 border-gray-200 bg-green-600 flex-shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                <i className="fa-solid fa-list mr-2"></i>
                                My Requests
                            </h2>
                            <button
                                className="text-white text-xl sm:text-2xl hover:text-green-200 transition"
                                onClick={handleCloseMyRequestsModal}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
                            {myRequests.length > 0 ? (
                                <div>
                                    <div className="mb-6 text-sm text-gray-600 bg-green-50 p-4 rounded-xl border border-green-100">
                                        <i className="fa-solid fa-info-circle mr-2 text-green-600"></i>
                                        <span className="font-medium">
                                            Found {myRequests.length} request
                                            {myRequests.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="ml-2 text-gray-500">
                                            • Sorted by most recent first
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse bg-white shadow-sm rounded-xl overflow-hidden">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left text-gray-700">
                                                    <th className="py-4 px-6 font-semibold border-b border-gray-200 min-w-[280px]">
                                                        Item Details
                                                    </th>
                                                    <th className="py-4 px-4 font-semibold border-b border-gray-200 text-center min-w-[80px]">
                                                        Quantity
                                                    </th>
                                                    <th className="py-4 px-4 font-semibold border-b border-gray-200 min-w-[120px]">
                                                        Pickup Date
                                                    </th>
                                                    <th className="py-4 px-4 font-semibold border-b border-gray-200 min-w-[120px]">
                                                        Return Date
                                                    </th>
                                                    <th className="py-4 px-4 font-semibold border-b border-gray-200 text-center min-w-[100px]">
                                                        Status
                                                    </th>
                                                    <th className="py-4 px-6 font-semibold border-b border-gray-200 text-center min-w-[100px]">
                                                        Requested
                                                    </th>
                                                    <th className="py-4 px-4 font-semibold border-b border-gray-200 text-center min-w-[120px]">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myRequests.map(
                                                    (request, index) => (
                                                        <tr
                                                            key={request.id}
                                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                                                index % 2 === 0
                                                                    ? 'bg-white'
                                                                    : 'bg-gray-25'
                                                            }`}
                                                        >
                                                            <td className="py-5 px-6">
                                                                <div className="space-y-2">
                                                                    <div className="font-semibold text-gray-800 text-base leading-tight">
                                                                        {
                                                                            request.itemName
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 font-medium">
                                                                        <i className="fa-solid fa-tag mr-1"></i>
                                                                        {
                                                                            request.itemCategory
                                                                        }
                                                                    </div>
                                                                    {request.itemDateLimit && (
                                                                        <div className="text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded-full">
                                                                            <i className="fa-solid fa-clock mr-1"></i>
                                                                            Max:{' '}
                                                                            {
                                                                                request.itemDateLimit
                                                                            }{' '}
                                                                            days
                                                                        </div>
                                                                    )}
                                                                    {request.requestNote && (
                                                                        <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg border-l-2 border-gray-300">
                                                                            <i className="fa-solid fa-note-sticky mr-1"></i>
                                                                            <span className="font-medium">
                                                                                Note:
                                                                            </span>{' '}
                                                                            {
                                                                                request.requestNote
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-4 text-center">
                                                                <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-bold min-w-[50px] inline-block">
                                                                    {
                                                                        request.quantity
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="py-5 px-4">
                                                                <div className="text-sm font-medium text-gray-700">
                                                                    <i className="fa-solid fa-calendar-plus mr-2 text-green-600"></i>
                                                                    {new Date(
                                                                        request.pickupDate
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                        }
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-4">
                                                                <div className="text-sm font-medium text-gray-700">
                                                                    {request.returnDate ? (
                                                                        <>
                                                                            <i className="fa-solid fa-calendar-minus mr-2 text-red-600"></i>
                                                                            {new Date(
                                                                                request.returnDate
                                                                            ).toLocaleDateString(
                                                                                'en-US',
                                                                                {
                                                                                    year: 'numeric',
                                                                                    month: 'short',
                                                                                    day: 'numeric',
                                                                                }
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-gray-400 italic">
                                                                            <i className="fa-solid fa-minus mr-2"></i>
                                                                            Not
                                                                            specified
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-4 text-center">
                                                                <span
                                                                    className={`px-3 py-2 rounded-full text-xs font-bold min-w-[80px] inline-block ${
                                                                        request.status ===
                                                                        'Pending'
                                                                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                            : request.status ===
                                                                              'Approved'
                                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                                            : request.status ===
                                                                              'Rejected'
                                                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                                                            : request.status ===
                                                                              'Returned'
                                                                            ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                            : 'bg-green-100 text-green-800 border border-green-200'
                                                                    }`}
                                                                >
                                                                    {
                                                                        request.status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="py-5 px-6 text-center">
                                                                <div className="text-xs text-gray-500 font-medium">
                                                                    <i className="fa-solid fa-clock mr-1"></i>
                                                                    {new Date(
                                                                        request.createdAt
                                                                    ).toLocaleDateString(
                                                                        'en-US',
                                                                        {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                        }
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-4 text-center">
                                                                {[
                                                                    'Pending',
                                                                    'Approved',
                                                                ].includes(
                                                                    request.status
                                                                ) ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleCancelRequest(
                                                                                request.id,
                                                                                request.itemName
                                                                            )
                                                                        }
                                                                        className="bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-900 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                                                        title="Cancel this request"
                                                                    >
                                                                        <i className="fa-solid fa-times mr-2"></i>
                                                                        Cancel
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm italic">
                                                                        No
                                                                        actions
                                                                        available
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="mb-4">
                                        <i className="fa-solid fa-inbox text-6xl text-gray-300"></i>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        No Requests Found
                                    </h3>
                                    <p className="text-gray-500">
                                        You haven't made any equipment requests
                                        yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .letter-spacing-wide {
                    letter-spacing: 0.15em;
                }
              
                .line-clamp-1 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                }
                .line-clamp-2 {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
                @media (max-width: 1200px) {
                    .max-w-5xl {
                        max-width: 98vw !important;
                    }
                    .lg\\:grid-cols-3 {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                }
                @media (max-width: 900px) {
                    .lg\\:grid-cols-3, .sm\\:grid-cols-2 {
                        grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                    }
                }
                @media (max-width: 640px) {
                    .text-4xl, .md\\:text-5xl { font-size: 1.7rem !important; }
                    .text-2xl, .sm\\:text-2xl { font-size: 1.2rem !important; }
                    .text-3xl, .sm\\:text-3xl { font-size: 1.5rem !important; }
                    .max-w-5xl {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                html, body, #root {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
            />
        </>
    );
}
