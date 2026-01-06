import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext.jsx';
import Navbar from '../../Components/Navbar';
import { differenceInDays, isAfter, isBefore, startOfDay, addYears, addDays } from 'date-fns';
import { ARCHIVED_STATUSES } from '../../../constants/eicStatuses';
import { createEICTutorial } from './eicTutorial';
import './eicTutorial.css';

// TANSTACK QUERY HOOKS
import { useEICEquipment, useUserRequests, useSubmitRequest, useCancelRequest } from './hooks/useEICQueries';

// NEW HOOKS
import useSystemSettings from './hooks/useSystemSettings';
import useRequestActions from './hooks/useRequestActions';

// COMPONENTS
import EICLoadingState from './components/EICLoadingState';
import EICErrorState from './components/EICErrorState';
import EICSearchAndFilters from './components/EICSearchAndFilters';
import EICEquipmentCard from './components/EICEquipmentCard';
import EICPagination from './components/EICPagination';
import ActiveRequestCounter from './components/ActiveRequestCounter';
import BorrowPeriodCard from './components/BorrowPeriodCard';
import RequestStatusBadge from './components/RequestStatusBadge';
import RequestActionPanel from './components/RequestActionPanel';
import RequestTimeline from './components/RequestTimeline';
import RequestDetailModal from './components/RequestDetailModal';

// UTILITIES
import { showSuccessAlert, showErrorAlert, showLoginPrompt } from './utils/alertUtils';
import { canRequestItem, getUserFriendlyStatus } from './utils/statusHelpers';
import { validateRequestForm } from './utils/validationHelpers';

const ITEMS_PER_PAGE = 8;

// Helper function to determine smart date labels for Client view
const getClientDateLabels = (request) => {
  const pickupAdjusted = request.actual_pickup && 
    new Date(request.actual_pickup).getTime() !== new Date(request.pickupDate).getTime();
  const returnAdjusted = request.adjustedReturnDate && 
    new Date(request.adjustedReturnDate).getTime() !== new Date(request.returnDate).getTime();
  
  // If neither adjusted, return null (no labels needed)
  if (!pickupAdjusted && !returnAdjusted) {
    return { 
      pickupLabel: null, 
      returnLabel: null,
      pickupAdjusted: false,
      returnAdjusted: false
    };
  }
  
  // If one adjusted, show "(adjusted)" on adjusted date, "(on time)" on other for height consistency
  return {
    pickupLabel: pickupAdjusted ? '(adjusted)' : (returnAdjusted ? '(on time)' : null),
    returnLabel: returnAdjusted ? '(adjusted)' : (pickupAdjusted ? '(on time)' : null),
    pickupAdjusted,
    returnAdjusted
  };
};

export default function Eic() {
    const { theme, isDark } = useTheme();
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
        quantity: '',
    });
    const [myRequests, setMyRequests] = useState([]);
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
    const [requestsTab, setRequestsTab] = useState('active'); // 'active', 'history', 'cancelled'
    const [selectedRequestDetail, setSelectedRequestDetail] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [expandedRowId, setExpandedRowId] = useState(null); // Track which row is expanded
    const [highlightedItemId, setHighlightedItemId] = useState(null); // Track which item to highlight
    const [tutorial, setTutorial] = useState(null);
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    // NEW HOOKS - System Settings
    const { settings: systemSettings, loading: settingsLoading } = useSystemSettings();

    // Tutorial initialization
    useEffect(() => {
        const newTutorial = createEICTutorial();
        setTutorial(newTutorial);

        return () => {
            if (newTutorial) {
                newTutorial.complete();
            }
        };
    }, []);

    // Start tutorial function
    const startTutorial = () => {
        if (tutorial) {
            setIsTutorialActive(true);
            tutorial.start();

            tutorial.on('complete', () => {
                setIsTutorialActive(false);
            });

            tutorial.on('cancel', () => {
                setIsTutorialActive(false);
            });
        }
    };

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

    // REQUEST ACTIONS HOOK
    const { 
        loading: actionsLoading, 
        error: actionsError,
        cancelRequest,
        confirmPickup,
        confirmReturn,
        requestExtension
    } = useRequestActions({
        onSuccess: (actionType) => {
            showSuccessAlert(`${actionType} completed successfully!`);
            refetchRequests();
        }
    });

    // Calculate active requests count (exclude archived statuses)
    const activeRequestsCount = userRequests?.filter(
        r => !ARCHIVED_STATUSES.includes(r.status)
    ).length || 0;

    // TEST 5.3: Client Active Requests Filter
    if (userRequests && userRequests.length > 0) {
      const breakdown = userRequests.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {});
      
      console.log(`
${'='.repeat(60)}
📋 TEST 5.3: CLIENT ACTIVE REQUESTS FILTER
${'='.repeat(60)}
Total user requests: ${userRequests.length}
Active requests count: ${activeRequestsCount}
Archived statuses used: ${ARCHIVED_STATUSES.join(', ')}
Request breakdown: ${JSON.stringify(breakdown, null, 2)}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 5.3
${'='.repeat(60)}
`);
    }

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
            // Check if user already has active request for this item (not archived)
            const hasActiveRequest = userRequests?.some(
                r => r.itemStackId === item.id && !ARCHIVED_STATUSES.includes(r.status)
            );
            
            if (hasActiveRequest) {
                showErrorAlert(`You already have an ongoing request for "${item.Name}". Please complete or cancel your current request before making a new one.`);
                return;
            }
            
            // Check if can request this item (additional validations like max simultaneous borrows)
            const requestCheck = canRequestItem(userRequests, item.id, systemSettings);
            if (!requestCheck.can) {
                showErrorAlert(requestCheck.reason);
                return;
            }
            
            console.log('🔍 Selected Item Data:', {
                id: item.id,
                stackId: item.stackId,
                name: item.Name || item.name,
                max_quantity_per_request: item.max_quantity_per_request,
                quantity: item.quantity,
                date_limit: item.date_limit,
                'HAS max_quantity_per_request?': item.max_quantity_per_request !== undefined && item.max_quantity_per_request !== null,
                fullItem: item
            });
            
            setSelectedItem(item);
            setModalOpen(true);
        } catch (e) {
            console.error('Request EIC Item error:', e);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
        setRequestData({
            pickupDate: '',
            returnDate: '',
            request_note: '',
            quantity: '',
        });
        setFormErrors({});
    };

    const handleOpenMyRequestsWithHighlight = async (itemId) => {
        try {
            // Refetch to get latest data
            const requestsData = await refetchRequests();
            
            if (requestsData.error?.message === 'UNAUTHORIZED') {
                showLoginPrompt(navigate);
                return;
            }
            
            // Update myRequests state with latest data
            setMyRequests(requestsData.data || []);
            setHighlightedItemId(itemId);
            setShowMyRequestsModal(true);
            setRequestsTab('active'); // Always show active tab when opening from card
            
            // Clear highlight after 3 seconds
            setTimeout(() => {
                setHighlightedItemId(null);
            }, 3000);
        } catch (error) {
            console.error('Error fetching user requests:', error);
            
            if (error.message === 'UNAUTHORIZED') {
                showLoginPrompt(navigate);
            } else {
                // Still open the modal with existing data
                setMyRequests(userRequests || []);
                setHighlightedItemId(itemId);
                setShowMyRequestsModal(true);
                setRequestsTab('active');
                
                setTimeout(() => {
                    setHighlightedItemId(null);
                }, 3000);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear specific error when user starts typing
        if (formErrors[name] && formErrors[name].length > 0) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: [],
            }));
        }
    };

    // Enhanced date validation with prevention of past dates
    const handleDateInput = (e) => {
        const { name, value } = e.target;
        const selectedDate = startOfDay(new Date(value));
        const today = startOfDay(new Date());
        const maxDate = startOfDay(addYears(new Date(), 2)); // Max 2 years in future

        let errors = { ...formErrors };

        // Prevent past dates
        if (name === 'pickupDate' && isBefore(selectedDate, today)) {
            errors.pickupDate = ['Pickup date cannot be in the past'];
            setFormErrors(errors);
            // Reset to today
            e.target.value = new Date().toISOString().split('T')[0];
            return;
        }

        // Prevent unrealistic future dates
        if (isAfter(selectedDate, maxDate)) {
            errors[name] = ['Date cannot be more than 2 years in the future'];
            setFormErrors(errors);
            return;
        }

        // Return date validation
        if (name === 'returnDate' && requestData.pickupDate) {
            const pickup = startOfDay(new Date(requestData.pickupDate));
            if (!isAfter(selectedDate, pickup)) {
                errors.returnDate = ['Return date must be after pickup date'];
                setFormErrors(errors);
                return;
            }

            // Check against date_limit if set
            if (selectedItem?.date_limit) {
                const borrowDays = differenceInDays(selectedDate, pickup);
                if (borrowDays > selectedItem.date_limit) {
                    errors.returnDate = [`Borrowing period (${borrowDays} days) exceeds maximum limit of ${selectedItem.date_limit} days`];
                    setFormErrors(errors);
                    return;
                }
            }
        }

        handleInputChange(e);
    };

    // Enhanced quantity validation
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const errors = { ...formErrors };

        // Allow empty value or any number input
        if (value === '' || value === null) {
            setRequestData((prev) => ({ ...prev, quantity: '' }));
            delete errors.quantity;
            setFormErrors(errors);
            return;
        }

        const numValue = parseInt(value);
        
        if (isNaN(numValue)) {
            // Invalid input, keep previous value
            return;
        }

        // Check max_quantity_per_request limit first
        if (selectedItem?.max_quantity_per_request && numValue > selectedItem.max_quantity_per_request) {
            errors.quantity = [`Maximum ${selectedItem.max_quantity_per_request} units per request allowed`];
        }
        // Check available stock
        else if (numValue > selectedItem?.quantity) {
            errors.quantity = [`Only ${selectedItem?.quantity} units available`];
        } 
        // Clear errors if valid
        else {
            delete errors.quantity;
        }

        setFormErrors(errors);
        setRequestData((prev) => ({ ...prev, quantity: numValue }));
    };

    // Calculate borrowing period in days
    const calculateBorrowingPeriod = () => {
        if (requestData.pickupDate && requestData.returnDate) {
            const pickup = startOfDay(new Date(requestData.pickupDate));
            const returnD = startOfDay(new Date(requestData.returnDate));
            return differenceInDays(returnD, pickup);
        }
        return 0;
    };

    // Form validation function with date_limit check
    const validateForm = () => {
        // Use comprehensive validation from validationHelpers
        const validation = validateRequestForm(
            {
                pickupDate: requestData.pickupDate,
                returnDate: requestData.returnDate,
                quantity: requestData.quantity,
                request_note: requestData.request_note
            },
            selectedItem,
            userRequests,
            systemSettings
        );

        setFormErrors(validation.errors);
        
        // Show error alert for critical validation failures
        if (validation.hasErrors) {
            const firstError = Object.values(validation.errors)[0];
            if (firstError && (firstError.includes('duplicate') || firstError.includes('maximum') || firstError.includes('cooldown'))) {
                showErrorAlert(firstError);
            }
        }
        
        return !validation.hasErrors;
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
            } else if (error.message && error.message !== 'Failed to submit request: 400') {
                // Show the specific error message from the backend
                showErrorAlert(error.message);
            } else {
                showErrorAlert('Error submitting request. Please try again.');
            }
            
            setModalOpen(false);
            setRequestData({
                pickupDate: '',
                returnDate: '',
                request_note: '',
                quantity: '',
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

    // Demo data for tutorial when user has no requests
    const demoRequest = {
        id: 'demo-1',
        itemStackId: 'demo-item-1',
        itemName: 'Hand Tractor',
        itemImage: '/src/Client/Services/EIC/Assets/default_image.webp',
        itemCategory: 'Machinery',
        quantity: 1,
        status: 'Pending',
        pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        returnDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days from now
        requestNote: 'Need for plowing rice field',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Display requests (use demo data during tutorial if user has no requests)
    const displayRequests = isTutorialActive && myRequests.length === 0 
        ? [demoRequest] 
        : myRequests;

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
                className={`flex min-h-screen relative ${isDark ? 'bg-gray-900' : 'bg-white'}`}
                style={{ overflow: 'hidden' }}
            >
                <main className="flex-1 w-full relative z-10 mt-30">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-[8vh]">
                        <header className="flex flex-col items-center mb-12 w-full">
                            <span className={`uppercase tracking-widest text-xs font-semibold mb-1 letter-spacing-wide ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Welcome to
                            </span>
                            <h1 className={`text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center eic-title ${
                                isDark ? 'text-gray-100' : 'text-gray-800'
                            }`}>
                                Equipment, Inputs & Commodities
                            </h1>
                            <div className={`mt-4 w-24 h-2 rounded-full shadow-lg ${
                                isDark ? 'bg-green-400' : 'bg-green-500'
                            }`}></div>
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
                            activeRequestsCount={activeRequestsCount}
                            maxActiveRequests={systemSettings?.eic_max_simultaneous_borrows || 3}
                            onStartTutorial={startTutorial}
                        />

                        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 lg:grid-cols-3 justify-items-center">
                            {filteredItems.length === 0 ? (
                                <div className={`col-span-full text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} py-16 text-lg font-semibold tracking-wide`}>
                                    No equipment found.
                                </div>
                            ) : (
                                paginatedItems.map((item) => {
                                    // Check if user has active request for this item (not in archives)
                                    const hasActiveRequest = userRequests?.some(
                                        r => r.itemStackId === item.id && !ARCHIVED_STATUSES.includes(r.status)
                                    );
                                    
                                    // Check if user can request this item
                                    const requestCheck = canRequestItem(userRequests, item.id, systemSettings);
                                    
                                    // Check if user has reached 3 active request limit
                                    const maxActiveRequests = systemSettings?.eic_max_simultaneous_borrows || 3;
                                    const atRequestLimit = activeRequestsCount >= maxActiveRequests;
                                    
                                    // Determine disabled reason
                                    const disabledReason = hasActiveRequest 
                                        ? `You already have an active request for this item`
                                        : requestCheck.reason;
                                    
                                    return (
                                        <EICEquipmentCard
                                            key={item.id}
                                            item={item}
                                            onRequestClick={handleRequestClick}
                                            typeIcon={typeIcon}
                                            hasActiveRequest={hasActiveRequest}
                                            atRequestLimit={atRequestLimit}
                                            isDisabled={!requestCheck.can}
                                            disabledReason={disabledReason}
                                            onOpenMyRequests={handleOpenMyRequestsWithHighlight}
                                            isTutorialActive={isTutorialActive}
                                        />
                                    );
                                })
                            )}
                        </div>

                        <EICPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            isTutorialActive={isTutorialActive}
                        />
                    </section>
                </main>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all pt-20 sm:pt-20 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8">
                    <div data-tutorial="request-modal" className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-0 max-w-lg w-full relative overflow-hidden animate-fade-in border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'} mt-8 sm:mt-6 md:mt-4 max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-5rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto`}>
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b-2 ${isDark ? 'border-gray-600' : 'border-gray-200'} bg-green-600`}>
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                <i className="fa-solid fa-paper-plane mr-2"></i>
                                Request Equipment
                            </h2>
                            <button
                                data-tutorial="close-request-modal"
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
                                    <div className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'} truncate`}>
                                        {selectedItem?.Name}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {selectedItem?.category}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Available Stock:{' '}
                                        {selectedItem?.quantity}
                                    </div>
                                </div>
                            </div>

                            <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 rounded-lg p-3 mb-4`}>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <i className="fa-solid fa-info-circle mr-2 text-green-600"></i>
                                    <span className="text-red-500">*</span>{' '}
                                    indicates required fields
                                </p>
                            </div>

                            {/* Max Quantity Per Request Warning - Always Visible */}
                            {selectedItem?.max_quantity_per_request && (() => {
                                const isExceeding = requestData.quantity > 0 && requestData.quantity > selectedItem.max_quantity_per_request;
                                return (
                                    <div className={`${
                                        isExceeding
                                            ? isDark ? 'bg-red-900/30 border-red-600' : 'bg-red-50 border-red-400'
                                            : isDark ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-400'
                                    } border-l-4 rounded-lg p-4 mb-4`}>
                                        <div className="flex items-start">
                                            <i className={`fa-solid fa-box ${
                                                isExceeding
                                                    ? isDark ? 'text-red-400' : 'text-red-600'
                                                    : isDark ? 'text-blue-400' : 'text-blue-600'
                                            } mr-2 mt-0.5`}></i>
                                            <div className="flex-1">
                                                <p className={`text-sm font-semibold ${
                                                    isExceeding
                                                        ? isDark ? 'text-red-200' : 'text-red-800'
                                                        : isDark ? 'text-blue-200' : 'text-blue-800'
                                                } mb-1`}>
                                                    Quantity Limit Per Request
                                                </p>
                                                <p className={`text-sm ${
                                                    isExceeding
                                                        ? isDark ? 'text-red-300' : 'text-red-700'
                                                        : isDark ? 'text-blue-300' : 'text-blue-700'
                                                }`}>
                                                    Maximum per request: <strong>{selectedItem.max_quantity_per_request} units</strong>
                                                    {requestData.quantity !== '' && requestData.quantity !== null && (
                                                        <span className={
                                                            isExceeding
                                                                ? 'text-red-600 dark:text-red-400 font-bold'
                                                                : 'text-green-600 dark:text-green-400 font-semibold'
                                                        }>
                                                            {' '}| Your request: <strong>{requestData.quantity} units</strong>
                                                            {isExceeding && ' (Exceeds limit!)'}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Date Limit Warning */}
                            {selectedItem?.date_limit && (
                                <div className={`${isDark ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-400'} border-l-4 rounded-lg p-4 mb-4`}>
                                    <div className="flex items-start">
                                        <i className={`fa-solid fa-clock ${isDark ? 'text-yellow-400' : 'text-yellow-600'} mr-2 mt-0.5`}></i>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${isDark ? 'text-yellow-200' : 'text-yellow-800'} mb-1`}>
                                                Borrowing Time Limit
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                                                This item can be borrowed for a maximum of{' '}
                                                <strong>{selectedItem.date_limit} days</strong>.
                                                {requestData.pickupDate && requestData.returnDate && (() => {
                                                    const borrowPeriod = calculateBorrowingPeriod();
                                                    const isExceeding = borrowPeriod > selectedItem.date_limit;
                                                    return (
                                                        <span className={isExceeding ? 'text-red-600 font-bold' : 'text-green-600 font-semibold'}>
                                                            {' '}Your requested period: <strong>{borrowPeriod} days</strong>
                                                            {isExceeding && ' (Exceeds limit!)'}
                                                        </span>
                                                    );
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="pickupDate"
                                        className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                    >
                                        Pickup Date{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="pickupDate"
                                        name="pickupDate"
                                        value={requestData.pickupDate}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleDateInput(e);
                                        }}
                                        className={`w-full rounded-xl border-2 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition ${
                                            formErrors.pickupDate && formErrors.pickupDate.length > 0
                                                ? 'border-red-400 bg-red-50'
                                                : isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                        required
                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                        max={addYears(new Date(), 2).toISOString().split('T')[0]}
                                    />
                                    {formErrors.pickupDate && formErrors.pickupDate.length > 0 && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors.pickupDate[0]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="returnDate"
                                        className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                    >
                                        Expected Return Date
                                        <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-xs ml-1`}>
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
                                            handleDateInput(e);
                                        }}
                                        className={`w-full rounded-xl border-2 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition ${
                                            formErrors.returnDate && formErrors.returnDate.length > 0
                                                ? 'border-red-400 bg-red-50'
                                                : isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                        min={
                                            requestData.pickupDate
                                                ? requestData.pickupDate
                                                : new Date().toISOString().split('T')[0]
                                        }
                                        max={
                                            selectedItem?.date_limit && requestData.pickupDate
                                                ? addDays(new Date(requestData.pickupDate), selectedItem.date_limit).toISOString().split('T')[0]
                                                : addYears(new Date(), 2).toISOString().split('T')[0]
                                        }
                                    />
                                    {formErrors.returnDate && formErrors.returnDate.length > 0 && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors.returnDate[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Borrow Period Card */}
                            {requestData.pickupDate && requestData.returnDate && (
                                <BorrowPeriodCard
                                    pickupDate={requestData.pickupDate}
                                    returnDate={requestData.returnDate}
                                    dateLimit={selectedItem?.date_limit}
                                />
                            )}

                            <div>
                                <div>
                                    <label
                                        htmlFor="quantity"
                                        className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                    >
                                        Quantity{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={requestData.quantity}
                                        onChange={handleQuantityChange}
                                        onInput={(e) => {
                                            // Enforce max limit strictly
                                            const maxAllowed = selectedItem?.max_quantity_per_request || selectedItem?.quantity || 999;
                                            if (parseInt(e.target.value) > maxAllowed) {
                                                e.target.value = maxAllowed;
                                                handleQuantityChange(e);
                                            }
                                        }}
                                        step="1"
                                        min="1"
                                        max={selectedItem?.max_quantity_per_request || selectedItem?.quantity || 999}
                                        className={`w-full rounded-xl border-2 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition ${
                                            formErrors.quantity && formErrors.quantity.length > 0
                                                ? 'border-red-400 bg-red-50'
                                                : isDark 
                                                ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                : 'border-gray-300 bg-white text-gray-900'
                                        }`}
                                        required
                                    />
                                    {formErrors.quantity && formErrors.quantity.length > 0 && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formErrors.quantity[0]}
                                        </p>
                                    )}
                                    {(!formErrors.quantity || formErrors.quantity.length === 0) && (requestData.quantity === '' || requestData.quantity < 1) && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Quantity must be at least 1
                                        </p>
                                    )}
                                    {(!formErrors.quantity || formErrors.quantity.length === 0) &&
                                        requestData.quantity >= 1 &&
                                        requestData.quantity >
                                            selectedItem?.quantity && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Quantity exceeds available stock ({selectedItem?.quantity} available)
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="request_note"
                                    className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                >
                                    Purpose & Additional Notes
                                    <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-xs ml-1`}>
                                        (Optional)
                                    </span>
                                </label>
                                <textarea
                                    id="request_note"
                                    name="request_note"
                                    value={requestData.request_note}
                                    onChange={handleInputChange}
                                    rows="3"
                                    maxLength={500}
                                    className={`w-full rounded-xl border-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-500 focus:outline-none transition resize-none`}
                                    placeholder="Describe the purpose of borrowing this equipment and any special requirements..."
                                ></textarea>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1 text-right`}>
                                    {requestData.request_note?.length || 0}/500 characters
                                </p>
                            </div>

                            {/* Request Summary */}
                            {requestData.pickupDate && requestData.quantity && (
                                <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 rounded-lg p-4`}>
                                    <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                        <i className="fa-solid fa-clipboard-check mr-2 text-green-600"></i>
                                        Request Summary
                                    </h4>
                                    <div className={`space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                                    className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300'} font-semibold px-4 sm:px-5 py-2 rounded-xl transition border-2 focus:outline-none order-2 sm:order-1`}
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        !requestData.pickupDate ||
                                        !requestData.quantity ||
                                        (selectedItem?.max_quantity_per_request && requestData.quantity > selectedItem.max_quantity_per_request) ||
                                        (requestData.quantity > selectedItem?.quantity) ||
                                        Object.values(formErrors).some(err => Array.isArray(err) && err.length > 0)
                                    }
                                    className={`font-semibold px-4 sm:px-6 py-2 rounded-xl shadow-md transition border-2 focus:outline-none order-1 sm:order-2 ${
                                        !requestData.pickupDate ||
                                        !requestData.quantity ||
                                        (selectedItem?.max_quantity_per_request && requestData.quantity > selectedItem.max_quantity_per_request) ||
                                        (requestData.quantity > selectedItem?.quantity) ||
                                        Object.values(formErrors).some(err => Array.isArray(err) && err.length > 0)
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all pt-24 sm:pt-20 md:pt-16 lg:pt-20 px-2 sm:px-4 md:px-6">
                    <div data-tutorial="my-requests-modal" className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-3xl shadow-2xl p-0 max-w-6xl w-full mx-2 sm:mx-4 relative overflow-hidden animate-fade-in max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-5rem)] lg:max-h-[90vh] flex flex-col border-2 mt-8 sm:mt-6 md:mt-4`}>
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b-2 ${isDark ? 'border-gray-600' : 'border-gray-200'} bg-green-600 flex-shrink-0`}>
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                <i className="fa-solid fa-list mr-2"></i>
                                My Requests
                            </h2>
                            <button
                                data-tutorial="close-requests-modal"
                                className="text-white text-xl sm:text-2xl hover:text-green-200 transition"
                                onClick={handleCloseMyRequestsModal}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Tabs */}
                        <div className={`flex border-b-2 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'} px-4 sm:px-6 md:px-8`}>
                            {['active', 'history', 'cancelled'].map((tab) => {
                                const count = displayRequests.filter(r => {
                                    if (tab === 'active') return !ARCHIVED_STATUSES.includes(r.status);
                                    if (tab === 'cancelled') return r.status === 'Cancelled';
                                    return ['Returned', 'late_return', 'No_Return', 'No_Pickup', 'Rejected'].includes(r.status);
                                }).length;

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setRequestsTab(tab)}
                                        className={`px-4 py-3 font-semibold text-sm border-b-4 transition-all ${
                                            requestsTab === tab
                                                ? 'border-green-500 text-green-600'
                                                : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                                        }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                            requestsTab === tab
                                                ? 'bg-green-100 text-green-800'
                                                : isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Modal Body */}
                        <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
                            {(() => {
                                const filteredRequests = displayRequests.filter(r => {
                                    if (requestsTab === 'active') return !ARCHIVED_STATUSES.includes(r.status);
                                    if (requestsTab === 'cancelled') return r.status === 'Cancelled';
                                    return ['Returned', 'late_return', 'No_Return', 'No_Pickup', 'Rejected'].includes(r.status);
                                });

                                return filteredRequests.length > 0 ? (
                                <div>
                                    <div className={`mb-6 text-sm ${isDark ? 'text-gray-300 bg-green-900/20 border-green-700' : 'text-gray-600 bg-green-50 border-green-100'} p-4 rounded-xl border`}>
                                        <i className="fa-solid fa-info-circle mr-2 text-green-600"></i>
                                        <span className="font-medium">
                                            Found {filteredRequests.length} {requestsTab} request
                                            {filteredRequests.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className={`ml-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
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
                                                {filteredRequests.map(
                                                    (request, index) => {
                                                        const isExpanded = expandedRowId === request.id;
                                                        const isHighlighted = highlightedItemId === request.itemStackId;
                                                        
                                                        return (
                                                        <React.Fragment key={request.id}>
                                                        <tr
                                                            onClick={() => setExpandedRowId(isExpanded ? null : request.id)}
                                                            className={`border-b border-gray-100 hover:bg-green-50 transition-all cursor-pointer ${
                                                                isHighlighted
                                                                    ? 'bg-yellow-100 animate-pulse'
                                                                    : index % 2 === 0
                                                                    ? 'bg-white'
                                                                    : 'bg-gray-25'
                                                            }`}
                                                            title="Click to view details"
                                                        >
                                                            <td className="py-5 px-6">
                                                                <div className="space-y-2">
                                                                    <div className="font-semibold text-gray-800 text-base leading-tight flex items-center gap-2">
                                                                        {request.itemName}
                                                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs text-gray-400"></i>
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
                                                                    {(() => {
                                                                        const labels = getClientDateLabels(request);
                                                                        const displayDate = request.actual_pickup || request.pickupDate;
                                                                        
                                                                        return (
                                                                            <>
                                                                                <i className="fa-solid fa-calendar-plus mr-2 text-green-600"></i>
                                                                                {new Date(displayDate).toLocaleDateString(
                                                                                    'en-US',
                                                                                    {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                    }
                                                                                )}
                                                                                {labels.pickupLabel && (
                                                                                    <div className="text-green-600 text-xs font-medium mt-0.5">
                                                                                        {labels.pickupLabel}
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-4">
                                                                <div className="text-sm font-medium text-gray-700">
                                                                    {(request.actual_return || request.adjustedReturnDate || request.returnDate) ? (
                                                                        (() => {
                                                                            const labels = getClientDateLabels(request);
                                                                            const displayDate = request.actual_return || request.adjustedReturnDate || request.returnDate;
                                                                            
                                                                            return (
                                                                                <>
                                                                                    <i className="fa-solid fa-calendar-minus mr-2 text-red-600"></i>
                                                                                    {new Date(displayDate).toLocaleDateString(
                                                                                        'en-US',
                                                                                        {
                                                                                            year: 'numeric',
                                                                                            month: 'short',
                                                                                            day: 'numeric',
                                                                                        }
                                                                                    )}
                                                                                    {labels.returnLabel && (
                                                                                        <div className="text-green-600 text-xs font-medium mt-0.5">
                                                                                            {labels.returnLabel}
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        })()
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
                                                                {(() => {
                                                                    const userFriendly = getUserFriendlyStatus(request.status, request.adjustedReturnDate || request.returnDate);
                                                                    
                                                                    if (userFriendly && requestsTab === 'active') {
                                                                        return (
                                                                            <div className={`inline-flex flex-col items-center px-3 py-2 rounded-lg border-2 ${userFriendly.bgClass} ${userFriendly.borderClass} ${userFriendly.textClass}`}>
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <i className={`fa-solid ${userFriendly.icon} text-xs`}></i>
                                                                                    <span className="font-bold text-xs">{userFriendly.label}</span>
                                                                                </div>
                                                                                {userFriendly.subLabel && (
                                                                                    <div className="text-xs mt-1 font-medium">
                                                                                        {userFriendly.subLabel}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                    
                                                                    return (
                                                                        <RequestStatusBadge 
                                                                            status={request.status} 
                                                                            size="sm"
                                                                            pulse={request.status === 'Approved' || request.status === 'late_return'}
                                                                        />
                                                                    );
                                                                })()}
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
                                                            <td className="py-5 px-4" onClick={(e) => e.stopPropagation()}>
                                                                <div className="flex gap-2 justify-center items-center">
                                                                    {request.status === 'Pending' && (
                                                                        <button
                                                                            onClick={() => handleCancelRequest(request.id, request.itemName)}
                                                                            disabled={actionsLoading}
                                                                            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 transition-all disabled:opacity-50"
                                                                            title="Cancel this request"
                                                                        >
                                                                            <i className="fa-solid fa-ban mr-1"></i>
                                                                            Cancel
                                                                        </button>
                                                                    )}
                                                                    {request.status === 'Approved' && (
                                                                        <button
                                                                            onClick={() => handleCancelRequest(request.id, request.itemName)}
                                                                            disabled={actionsLoading}
                                                                            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 transition-all disabled:opacity-50"
                                                                            title="Cancel this request"
                                                                        >
                                                                            <i className="fa-solid fa-ban mr-1"></i>
                                                                            Cancel
                                                                        </button>
                                                                    )}
                                                                    {!['Pending', 'Approved'].includes(request.status) && (
                                                                        <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-xs italic`}>
                                                                            No actions
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        
                                                        {/* Expandable Row Content */}
                                                        {isExpanded && (
                                                            <tr className="bg-green-50 border-l-4 border-green-500">
                                                                <td colSpan="7" className="p-0">
                                                                    <div className="p-6 space-y-4 animate-slide-down">
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <h4 className="font-bold text-gray-800 text-lg">
                                                                                <i className="fa-solid fa-info-circle mr-2 text-green-600"></i>
                                                                                Request Details & Progress
                                                                            </h4>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setExpandedRowId(null);
                                                                                }}
                                                                                className="text-gray-500 hover:text-gray-700 text-sm"
                                                                            >
                                                                                <i className="fa-solid fa-chevron-up mr-1"></i>
                                                                                Collapse
                                                                            </button>
                                                                        </div>
                                                                        
                                                                        {/* Timeline */}
                                                                        <RequestTimeline request={request} isDark={false} />
                                                                        
                                                                        {/* Action Panel - Client can only cancel */}
                                                                        <RequestActionPanel
                                                                            request={request}
                                                                            onCancel={() => handleCancelRequest(request.id, request.itemName)}
                                                                            isDark={false}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        </React.Fragment>
                                                    );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="mb-4">
                                        <i className={`fa-solid fa-inbox text-6xl ${isDark ? 'text-gray-600' : 'text-gray-300'}`}></i>
                                    </div>
                                    <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                        No {requestsTab.charAt(0).toUpperCase() + requestsTab.slice(1)} Requests
                                    </h3>
                                    <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                                        You don't have any {requestsTab} requests at the moment.
                                    </p>
                                </div>
                            );
                            })()}
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
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }
                @keyframes slideDown {
                    from { 
                        opacity: 0; 
                        transform: translateY(-10px);
                        max-height: 0;
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                        max-height: 1000px;
                    }
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
