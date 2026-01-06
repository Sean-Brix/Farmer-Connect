import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import Navbar from '../../Components/Navbar';
import { isBefore, startOfDay, addYears } from 'date-fns';
import { CardGridSkeleton, PageHeaderSkeleton, FilterBarSkeleton } from '../../../Components/Skeletons/ServiceSkeletons';
import { createDistributionTutorial } from './distributionTutorial';
import './distributionTutorial.css';

// ASSETS
import default_image from './Assets/default_image.webp';

const ITEMS_PER_PAGE = 8;
const MONTHLY_LIMIT = 2;
const SEED_TYPES = ['Rice', 'Corn', 'High Value Crops'];

const normalizeUnitLabel = (unit) => {
    if (!unit) return 'units';
    const value = unit.toString().trim();
    const lower = value.toLowerCase();

    if (lower.includes('kilogram') || lower === 'kg') return 'kg';
    return value;
};

const getSeedType = (item) => {
    const raw =
        item?.seedVariety?.cropType ||
        item?.seedVariety?.type ||
        item?.cropType ||
        item?.seedType ||
        item?.type ||
        item?.itemType ||
        item?.category ||
        '';

    const normalized = raw.toString().replace(/_/g, ' ').trim();
    const base = normalized.toLowerCase();
    if (!base) return null;

    const matched = SEED_TYPES.find((t) =>
        base.includes(t.toLowerCase())
    );

    if (matched) return matched;

    if (base === 'seed' || base === 'seeds') return null;

    // Fallback: return the normalized value for unknown types
    return normalized;
};

export default function Distribution() {
    const { theme, isDark } = useTheme();
    const navigate = useNavigate();
    const [distributionItems, setDistributionItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        pickupDate: '',
        request_note: '',
        quantity: 1,
        farmLocation: '',
        areaPlanted: '',
        plantingMethod: '',
    });
    const [myRequests, setMyRequests] = useState([]);
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [monthlyUsage, setMonthlyUsage] = useState(null);
    const [authInfo, setAuthInfo] = useState({
        checked: false,
        isAuthenticated: false,
        role: null,
    });
    const [tutorial, setTutorial] = useState(null);
    const [isTutorialActive, setIsTutorialActive] = useState(false);

    const typeOptions = Array.from(
        new Set(distributionItems.map((i) => getSeedType(i)).filter(Boolean))
    );
    const categories = ['All', ...typeOptions];

    const filteredItems = distributionItems.filter((i) => {
        const typeName = getSeedType(i);
        return (
            (filter === 'All' || typeName === filter) &&
            (search === '' ||
                (i.Name &&
                    i.Name.toLowerCase().includes(search.toLowerCase())) ||
                (typeName &&
                    typeName.toLowerCase().includes(search.toLowerCase())) ||
                (i.description &&
                    i.description.toLowerCase().includes(search.toLowerCase())))
        );
    });

    useEffect(() => {
        const fetchDistributionItems = async () => {
            try {
                const response = await fetch('/api/dist/all', {
                    headers: {
                        'Cache-Control': 'max-age=300' // 5 minutes cache
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const distributionData = await response.json();

                if (Array.isArray(distributionData)) {
                    // Transform the data to match the expected structure
                    const transformedItems = distributionData.map((stack) => ({
                        id: stack.itemId,
                        stackId: stack.id,
                        Name: stack.item.name,
                        name: stack.item.name, // Add lowercase version for consistency
                        category: stack.item.category,
                        description: stack.item.description,
                        quantity: stack.quantity,
                        status: stack.status,
                        max_quantity_per_request:
                            stack.max_quantity_per_request || null,
                        date_limit: stack.date_limit || null,
                        img: stack.item.picture
                            ? `/api/dist/photo/${stack.itemId}`
                            : default_image,
                        // Include all original item properties
                        ...stack.item,
                        // Override with stack-specific data
                        availableQuantity: stack.quantity,
                    }));

                    setDistributionItems(transformedItems);
                } else {
                    console.warn(
                        'Response is not an array or is empty:',
                        distributionData
                    );
                    setDistributionItems([]);
                }
            } catch (error) {
                console.error('Failed to fetch distribution items:', error);
                setDistributionItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDistributionItems();
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

    const calculateActiveRequests = (requests = []) => {
        // Count all active/ongoing requests (no time limit, just status-based)
        const excludedStatuses = ['Rejected', 'Cancelled', 'No_Pickup', 'Archived'];
        const used = requests.filter((req) => {
            // Exclude specifically rejected/cancelled/archived requests
            if (excludedStatuses.includes(req.status)) return false;
            // Exclude requests with Harvested planting reports (complete, not active)
            if (req.plantingReport?.state === 'Harvested') return false;
            return true;
        }).length;

        return {
            used,
            remaining: Math.max(0, MONTHLY_LIMIT - used),
        };
    };

    // Demo request for tutorial (for users with no requests)
    const demoRequest = {
        id: 'demo-1',
        itemName: 'NSIC Rc222 (Rice)',
        quantity: 5,
        unit: 'kg',
        status: 'Pending',
        pickupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        farmLocation: 'Demo Farm Location',
        areaPlanted: '1 hectare',
        plantingMethod: 'Transplanting',
        createdAt: new Date().toISOString(),
        request_note: 'Demo request for tutorial purposes'
    };

    // Use demo data during tutorial if user has no requests
    // Sort requests: ongoing (Pending, Approved, Picked_Up) at top, then others
    const sortedRequests = [...myRequests].sort((a, b) => {
        const ongoingStatuses = ['Pending', 'Approved', 'Picked_Up', 'Planted'];
        // Requests with Harvested planting reports are considered complete, not ongoing
        const aIsOngoing = ongoingStatuses.includes(a.status) && a.plantingReport?.state !== 'Harvested';
        const bIsOngoing = ongoingStatuses.includes(b.status) && b.plantingReport?.state !== 'Harvested';
        
        if (aIsOngoing && !bIsOngoing) return -1;
        if (!aIsOngoing && bIsOngoing) return 1;
        
        // If both are same type (both ongoing or both not), sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    const displayRequests = isTutorialActive && myRequests.length === 0 ? [demoRequest] : sortedRequests;

    // Initialize tutorial
    useEffect(() => {
        const tourInstance = createDistributionTutorial();
        setTutorial(tourInstance);

        return () => {
            if (tourInstance) {
                tourInstance.complete();
            }
        };
    }, []);

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

    const isAdminUser = ['admin', 'super_admin', 'super admin'].includes(
        (authInfo.role || '').toLowerCase()
    );
    const canShowUserActions = authInfo.checked && !isAdminUser;

    // Check if user has active (pending/approved/ongoing) request for an item
    const hasActiveRequestForItem = (stackId) => {
        const hasActive = myRequests.some(
            (req) => {
                if (req.itemStackId !== stackId) return false;
                // Check if request has a harvested planting report - not active
                if (req.plantingReport?.state === 'Harvested') return false;
                // Otherwise check status
                return ['Pending', 'Approved', 'Picked_Up', 'Planted'].includes(req.status);
            }
        );
        if (hasActive) {
            console.log('Found active request for stackId:', stackId, myRequests.filter(r => r.itemStackId === stackId));
        }
        return hasActive;
    };

    // Get the active request status for an item
    const getActiveRequestStatus = (stackId) => {
        const activeReq = myRequests.find(
            (req) => {
                if (req.itemStackId !== stackId) return false;
                // Exclude harvested planting reports
                if (req.plantingReport?.state === 'Harvested') return false;
                // Check for active statuses
                return ['Pending', 'Approved', 'Picked_Up', 'Planted'].includes(req.status);
            }
        );
        return activeReq ? activeReq.status : null;
    };

    // Check if there's a harvested request for an item (completed, not active)
    const hasHarvestedRequestForItem = (stackId) => {
        return myRequests.some(
            (req) =>
                req.itemStackId === stackId &&
                req.status === 'Planted' &&
                req.plantingReport?.state === 'Harvested'
        );
    };

    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const response = await fetch('/api/dist/request/me', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.log('Failed to fetch requests:', response.status);
                    return;
                }

                const data = await response.json();
                const requests = Array.isArray(data.requests)
                    ? data.requests
                    : [];

                console.log('Fetched requests on mount:', requests);
                console.log('Planted requests with planting report state:', 
                    requests.filter(r => r.status === 'Planted').map(r => ({
                        id: r.id,
                        status: r.status,
                        plantingReportState: r.plantingReport?.state
                    }))
                );
                setMyRequests(requests);
                setMonthlyUsage(calculateActiveRequests(requests));
            } catch (error) {
                console.error('Failed to fetch monthly usage:', error);
            }
        };

        fetchUsage();
    }, []);

    const fetchAuthStatus = async () => {
        try {
            const res = await fetch('/auth/is-authenticated', {
                credentials: 'include',
            });

            if (!res.ok) {
                setAuthInfo({ checked: true, isAuthenticated: false, role: null });
                return { isAuthenticated: false };
            }

            const data = await res.json();
            const isAuthed = Boolean(data?.check);
            const role = data?.payload?.access || null;

            setAuthInfo({ checked: true, isAuthenticated: isAuthed, role });
            return { isAuthenticated: isAuthed, role };
        } catch (error) {
            console.error('Failed to fetch auth status:', error);
            setAuthInfo({ checked: true, isAuthenticated: false, role: null });
            return { isAuthenticated: false };
        }
    };

    useEffect(() => {
        fetchAuthStatus();
    }, []);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const filterBy = filter;
    const filterOptions = categories.map((c) => ({
        value: c,
        label: c,
    }));

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
    }, [showFilter]);

    const typeIcon = (type) => {
        // return a fixed-size inline-flex container so icons align consistently
        const icon = (className) => (
            <span className="w-5 h-5 flex items-center justify-center">
                <i className={`${className} text-base`} />
            </span>
        );

        if (type === 'All') return icon('fa-solid fa-border-all text-blue-500');
        if (type === 'Seed' || type === 'Seeds')
            return icon('fa-solid fa-seedling text-green-600');
        if (type === 'Rice') return icon('fa-solid fa-bowl-rice text-amber-600');
        if (type === 'Corn') return icon('fa-solid fa-seedling text-blue-600');
        if (type === 'High Value Crops')
            return icon('fa-solid fa-leaf text-emerald-600');
        return icon('fa-solid fa-question text-gray-500');
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          ::-webkit-scrollbar {
            display: none;
          }
          html, body {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const showLoginPrompt = () => {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
            <div id="custom-login-alert" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                z-index: 9999;
                background: rgba(37,99,235,0.98);
                background: linear-gradient(100deg, #2563eb 0%, #3b82f6 100%);
                color: #fff;
                padding: 2rem 3rem;
                border-radius: 2rem;
                box-shadow: 0 12px 40px 0 rgba(59,130,246,0.22);
                font-size: 1.18rem;
                font-weight: 700;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
                min-width: 320px;
                max-width: 90vw;
                animation: loginAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                overflow: hidden;
                text-align: center;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.13);
                    border-radius: 50%;
                    width: 3rem;
                    height: 3rem;
                    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
                ">
                    <i class="fa-solid fa-user-lock" style="font-size:1.5rem; color: #fff; filter: drop-shadow(0 2px 8px #3b82f688);"></i>
                </div>
                <div>
                    <div style="font-size: 1.2rem; margin-bottom: 0.35rem;">Login Required</div>
                    <div style="font-size: 1rem; font-weight: 400; opacity: 0.9; line-height: 1.4;">
                        Please login to request distribution items.
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                    <button id="login-btn" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid rgba(255,255,255,0.3);
                        color: #fff;
                        padding: 0.75rem 1.5rem;
                        border-radius: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 1rem;
                    ">Go to Login</button>
                    <button id="cancel-btn" style="
                        background: transparent;
                        border: 2px solid rgba(255,255,255,0.3);
                        color: #fff;
                        padding: 0.75rem 1.5rem;
                        border-radius: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        font-size: 1rem;
                    ">Cancel</button>
                </div>
                <span class="login-alert-bar" style="
                    position: absolute;
                    bottom: 0; left: 0;
                    height: 4px;
                    width: 100%;
                    background: linear-gradient(90deg, #dbeafe 0%, #3b82f6 100%);
                "></span>
            </div>
            <style>
                @keyframes loginAlertPopIn {
                    0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);} 
                    60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);} 
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1);} 
                }
                #login-btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
                #cancel-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
            </style>
        `;
        document.body.appendChild(alertDiv);

        document.getElementById('login-btn').onclick = () => {
            document.body.removeChild(alertDiv);
            navigate('/login');
        };

        document.getElementById('cancel-btn').onclick = () => {
            document.body.removeChild(alertDiv);
        };
    };

    const showAdminBlockedPrompt = () => {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
            <div id="admin-block-alert" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                z-index: 9999;
                background: linear-gradient(135deg, #166534 0%, #22c55e 100%);
                color: #fff;
                padding: 1.75rem 2.5rem;
                border-radius: 1.5rem;
                box-shadow: 0 12px 40px rgba(22,101,52,0.35);
                display: flex;
                flex-direction: column;
                gap: 1rem;
                min-width: 320px;
                max-width: 90vw;
                font-weight: 700;
                text-align: center;
            ">
                <div style="display:flex; justify-content:center;">
                    <span style="display:flex; align-items:center; justify-content:center; width:3rem; height:3rem; border-radius:999px; background: rgba(255,255,255,0.14);">
                        <i class="fa-solid fa-user-shield" style="font-size:1.2rem;"></i>
                    </span>
                </div>
                <div>
                    <div style="font-size:1.05rem;">Admin accounts cannot submit distribution requests.</div>
                    <div style="font-size:0.95rem; font-weight:600; opacity:0.9;">Use a farmer/user account to create a request.</div>
                </div>
                <button id="admin-close-btn" style="
                    margin: 0 auto;
                    padding: 0.6rem 1.4rem;
                    background: rgba(255,255,255,0.14);
                    border: 2px solid rgba(255,255,255,0.35);
                    border-radius: 999px;
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                ">Got it</button>
            </div>
        `;
        document.body.appendChild(alertDiv);
        document.getElementById('admin-close-btn').onclick = () => {
            document.body.removeChild(alertDiv);
        };
    };

    // SEND REQUEST
    const handleRequestClick = async (item) => {
        try {
            const status = authInfo.checked ? authInfo : await fetchAuthStatus();

            if (!status.isAuthenticated) {
                showLoginPrompt();
                return;
            }

            const role = status.role?.toLowerCase();
            if (role === 'admin' || role === 'super_admin' || role === 'super admin') {
                showAdminBlockedPrompt();
                return;
            }

            setSelectedItem(item);
            setModalOpen(true);
        } catch (e) {
            console.error('Request Distribution Item error:', e);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFormErrors({});
        setRequestData({
            pickupDate: '',
            request_note: '',
            quantity: 1,
            farmLocation: '',
            areaPlanted: '',
            plantingMethod: '',
        });
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

    // Enhanced date validation
    const handleDateInput = (e) => {
        const { name, value } = e.target;
        const selectedDate = startOfDay(new Date(value));
        const today = startOfDay(new Date());
        const maxDate = startOfDay(addYears(new Date(), 2));

        let errors = { ...formErrors };

        if (isBefore(selectedDate, today)) {
            errors.pickupDate = 'Pickup date cannot be in the past';
            setFormErrors(errors);
            e.target.value = new Date().toISOString().split('T')[0];
            return;
        }

        if (selectedDate > maxDate) {
            errors.pickupDate = 'Date cannot be more than 2 years in the future';
            setFormErrors(errors);
            return;
        }

        handleInputChange(e);
    };

    // Enhanced quantity validation
    const handleQuantityChange = (e) => {
        let value = parseInt(e.target.value);
        const errors = { ...formErrors };

        if (isNaN(value) || value < 1) {
            value = 1;
        }

        if (value > selectedItem?.quantity) {
            errors.quantity = `Only ${selectedItem?.quantity} units available`;
            setFormErrors(errors);
            value = selectedItem?.quantity;
        } else {
            delete errors.quantity;
            setFormErrors(errors);
        }

        setRequestData((prev) => ({ ...prev, quantity: value }));
    };

    // Form validation function
    const validateForm = () => {
        const errors = {};
        const today = startOfDay(new Date());

        if (!requestData.pickupDate) {
            errors.pickupDate = 'Pickup date is required';
        } else {
            const pickup = startOfDay(new Date(requestData.pickupDate));
            if (isBefore(pickup, today)) {
                errors.pickupDate = 'Pickup date cannot be in the past';
            }
        }

        if (!requestData.quantity || requestData.quantity < 1) {
            errors.quantity = 'Quantity must be at least 1';
        } else if (requestData.quantity > selectedItem?.quantity) {
            errors.quantity = `Only ${selectedItem?.quantity} units available`;
        } else if (selectedItem?.max_quantity_per_request && requestData.quantity > selectedItem.max_quantity_per_request) {
            errors.quantity = `Maximum ${selectedItem.max_quantity_per_request} units per request`;
        }

        if (!requestData.farmLocation.trim()) {
            errors.farmLocation = 'Farm location is required';
        }

        const areaValue = parseFloat(requestData.areaPlanted);
        if (!requestData.areaPlanted) {
            errors.areaPlanted = 'Area planted is required';
        } else if (isNaN(areaValue) || areaValue <= 0) {
            errors.areaPlanted = 'Area planted must be greater than 0';
        }

        if (!requestData.plantingMethod) {
            errors.plantingMethod = 'Select a planting method';
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
            const response = await fetch('/api/dist/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    item_id: selectedItem.id,
                    pickupDate: requestData.pickupDate,
                    request_note: requestData.request_note,
                    quantity: parseInt(requestData.quantity),
                    farmLocation: requestData.farmLocation.trim(),
                    areaPlanted: parseFloat(requestData.areaPlanted),
                    plantingMethod: requestData.plantingMethod,
                }),
            });

            if (response.ok) {
                const alertDiv = document.createElement('div');
                alertDiv.innerHTML = `
                    <div id="custom-dist-alert" style="
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0.95);
                        z-index: 9999;
                        background: rgba(37,99,235,0.98);
                        background: linear-gradient(100deg, #2563eb 0%, #3b82f6 100%);
                        color: #fff;
                        padding: 1.5rem 2.8rem;
                        border-radius: 2rem;
                        box-shadow: 0 12px 40px 0 rgba(37,99,235,0.22);
                        font-size: 1.18rem;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        gap: 1.1rem;
                        min-width: 320px;
                        max-width: 90vw;
                        animation: distAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                        overflow: hidden;
                    ">
                        <span style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: rgba(255,255,255,0.13);
                            border-radius: 50%;
                            width: 2.8rem;
                            height: 2.8rem;
                            box-shadow: 0 2px 8px 0 rgba(37,99,235,0.10);
                        ">
                            <i class="fa-solid fa-circle-check" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #3b82f688);"></i>
                        </span>
                        <span style="letter-spacing:0.01em;">Request submitted successfully</span>
                        <span class="dist-alert-bar" style="
                            position: absolute;
                            bottom: 0; left: 0;
                            height: 4px;
                            width: 100%;
                            background: linear-gradient(90deg, #c7d2fe 0%, #2563eb 100%);
                            animation: distAlertBar 2.1s linear;
                        "></span>
                    </div>
                    <style>
                        @keyframes distAlertPopIn {
                            0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                            60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                            100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                        }
                        @keyframes distAlertBar {
                            from { width: 0%; }
                            to { width: 100%; }
                        }
                    </style>
                `;
                document.body.appendChild(alertDiv);

                setTimeout(() => {
                    const el = document.getElementById('custom-dist-alert');
                    if (el) {
                        el.style.transition = 'opacity 0.35s, transform 0.35s';
                        el.style.opacity = '0';
                        el.style.transform =
                            'translate(-50%, -50%) scale(0.95)';
                        setTimeout(() => {
                            if (alertDiv.parentNode)
                                alertDiv.parentNode.removeChild(alertDiv);
                        }, 350);
                    }
                }, 2100);

                setModalOpen(false);
                setRequestData({
                    pickupDate: '',
                    request_note: '',
                    quantity: 1,
                    farmLocation: '',
                    areaPlanted: '',
                    plantingMethod: '',
                });
                setFormErrors({});
                setMonthlyUsage((prev) => {
                    const used = Math.min(
                        MONTHLY_LIMIT,
                        (prev?.used || 0) + 1
                    );
                    return {
                        used,
                        remaining: Math.max(0, MONTHLY_LIMIT - used),
                    };
                });
                return;
            }

            let message = 'Submission failed. Please check your inputs and try again.';
            try {
                const err = await response.json();
                message = err.message || err.error || message;
            } catch (err) {
                // ignore JSON parse failures
            }

            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div id="custom-dist-alert" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    z-index: 9999;
                    background: rgba(239,68,68,0.98);
                    background: linear-gradient(100deg, #ef4444 0%, #f87171 100%);
                    color: #fff;
                    padding: 1.3rem 2.6rem;
                    border-radius: 2rem;
                    box-shadow: 0 12px 40px 0 rgba(248,113,113,0.22);
                    font-size: 1.05rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    min-width: 320px;
                    max-width: 90vw;
                    animation: distAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                    overflow: hidden;
                ">
                    <span style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255,255,255,0.13);
                        border-radius: 50%;
                        width: 2.6rem;
                        height: 2.6rem;
                        box-shadow: 0 2px 8px 0 rgba(248,113,113,0.10);
                    ">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.2rem;"></i>
                    </span>
                    <div>
                        <div style="margin-bottom: 0.2rem;">Submission failed</div>
                        <div style="font-size: 0.9rem; font-weight: 600; opacity: 0.9;">${message}</div>
                    </div>
                    <button onclick="document.getElementById('custom-dist-alert').remove()" style="
                        margin-left: auto;
                        background: rgba(255,255,255,0.16);
                        border: none;
                        color: #fff;
                        padding: 0.4rem 0.8rem;
                        border-radius: 999px;
                        cursor: pointer;
                        font-weight: 700;
                    ">
                        Close
                    </button>
                </div>
                <style>
                    @keyframes distAlertPopIn {
                        0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                        60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                    }
                    @keyframes distAlertBar {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                const el = document.getElementById('custom-dist-alert');
                if (el) {
                    el.style.transition = 'opacity 0.35s, transform 0.35s';
                    el.style.opacity = '0';
                    el.style.transform = 'translate(-50%, -50%) scale(0.95)';
                    setTimeout(() => {
                        if (alertDiv.parentNode)
                            alertDiv.parentNode.removeChild(alertDiv);
                    }, 350);
                }
            }, 2100);

            setModalOpen(false);
            return;
        } catch (error) {
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div id="custom-dist-alert" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    z-index: 9999;
                    background: #dc2626;
                    background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
                    color: #fff;
                    padding: 1.5rem 2.8rem;
                    border-radius: 2rem;
                    box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
                    font-size: 1.18rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 1.1rem;
                    min-width: 320px;
                    max-width: 90vw;
                    animation: distAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                    overflow: hidden;
                ">
                    <span style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255,255,255,0.13);
                        border-radius: 50%;
                        width: 2.8rem;
                        height: 2.8rem;
                        box-shadow: 0 2px 8px 0 rgba(239,68,68,0.10);
                    ">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #f8717188);"></i>
                    </span>
                    <span style="letter-spacing:0.01em;">Error submitting request</span>
                    <span class="dist-alert-bar" style="
                        position: absolute;
                        bottom: 0; left: 0;
                        height: 4px;
                        width: 100%;
                        background: linear-gradient(90deg, #fecaca 0%, #dc2626 100%);
                        animation: distAlertBar 2.1s linear;
                    "></span>
                </div>
                <style>
                    @keyframes distAlertPopIn {
                        0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                        60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                    }
                    @keyframes distAlertBar {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                const el = document.getElementById('custom-dist-alert');
                if (el) {
                    el.style.transition = 'opacity 0.35s, transform 0.35s';
                    el.style.opacity = '0';
                    el.style.transform = 'translate(-50%, -50%) scale(0.95)';
                    setTimeout(() => {
                        if (alertDiv.parentNode)
                            alertDiv.parentNode.removeChild(alertDiv);
                    }, 350);
                }
            }, 2100);

            console.error('Error submitting request:', error);
        }
    };

    const handleMyRequestsClick = async () => {
        try {
            // Fetch user requests using the correct endpoint
            const requestsResponse = await fetch('/api/dist/request/me', {
                credentials: 'include',
            });

            if (requestsResponse.status === 401) {
                // Show custom login prompt when unauthorized
                const alertDiv = document.createElement('div');
                alertDiv.innerHTML = `
                    <div id="custom-login-alert" style="
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0.95);
                        z-index: 9999;
                        background: rgba(37,99,235,0.98);
                        background: linear-gradient(100deg, #2563eb 0%, #3b82f6 100%);
                        color: #fff;
                        padding: 2rem 3rem;
                        border-radius: 2rem;
                        box-shadow: 0 12px 40px 0 rgba(59,130,246,0.22);
                        font-size: 1.18rem;
                        font-weight: 700;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1.5rem;
                        min-width: 350px;
                        max-width: 90vw;
                        animation: loginAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                        overflow: hidden;
                        text-align: center;
                    ">
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: rgba(255,255,255,0.13);
                            border-radius: 50%;
                            width: 3rem;
                            height: 3rem;
                            box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
                        ">
                            <i class="fa-solid fa-user-lock" style="font-size:1.5rem; color: #fff; filter: drop-shadow(0 2px 8px #3b82f688);"></i>
                        </div>
                        <div>
                            <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">Login Required</div>
                            <div style="font-size: 1rem; font-weight: 400; opacity: 0.9; line-height: 1.4;">
                                You need to login first to view your requests
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                            <button id="login-btn" style="
                                background: rgba(255,255,255,0.2);
                                border: 2px solid rgba(255,255,255,0.3);
                                color: #fff;
                                padding: 0.75rem 1.5rem;
                                border-radius: 1rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s;
                                font-size: 1rem;
                            ">Go to Login</button>
                            <button id="cancel-btn" style="
                                background: transparent;
                                border: 2px solid rgba(255,255,255,0.3);
                                color: #fff;
                                padding: 0.75rem 1.5rem;
                                border-radius: 1rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s;
                                font-size: 1rem;
                            ">Cancel</button>
                        </div>
                        <span class="login-alert-bar" style="
                            position: absolute;
                            bottom: 0; left: 0;
                            height: 4px;
                            width: 100%;
                            background: linear-gradient(90deg, #dbeafe 0%, #3b82f6 100%);
                        "></span>
                    </div>
                    <style>
                        @keyframes loginAlertPopIn {
                            0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                            60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                            100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                        }
                        #login-btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
                        #cancel-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
                    </style>
                `;
                document.body.appendChild(alertDiv);

                // Handle button clicks
                document.getElementById('login-btn').onclick = () => {
                    document.body.removeChild(alertDiv);
                    navigate('/login');
                };

                document.getElementById('cancel-btn').onclick = () => {
                    document.body.removeChild(alertDiv);
                };

                return;
            }

            if (requestsResponse.ok) {
                const requestsData = await requestsResponse.json();
                const requestsList = Array.isArray(requestsData.requests)
                    ? requestsData.requests
                    : [];

                setMyRequests(requestsList);
                setMonthlyUsage(calculateActiveRequests(requestsList));
                setShowMyRequestsModal(true);
            } else {
                // Show error alert for other errors
                const alertDiv = document.createElement('div');
                alertDiv.innerHTML = `
                    <div id="custom-error-alert" style="
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0.95);
                        z-index: 9999;
                        background: #dc2626;
                        background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
                        color: #fff;
                        padding: 1.5rem 2.8rem;
                        border-radius: 2rem;
                        box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
                        font-size: 1.18rem;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        gap: 1.1rem;
                        min-width: 320px;
                        max-width: 90vw;
                        animation: errorAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                        overflow: hidden;
                    ">
                        <span style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: rgba(255,255,255,0.13);
                            border-radius: 50%;
                            width: 2.8rem;
                            height: 2.8rem;
                            box-shadow: 0 2px 8px 0 rgba(239,68,68,0.10);
                        ">
                            <i class="fa-solid fa-circle-exclamation" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #f8717188);"></i>
                        </span>
                        <span style="letter-spacing:0.01em;">Failed to fetch your requests</span>
                    </div>
                    <style>
                        @keyframes errorAlertPopIn {
                            0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                            60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                            100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                        }
                    </style>
                `;
                document.body.appendChild(alertDiv);

                setTimeout(() => {
                    if (document.getElementById('custom-error-alert')) {
                        document.body.removeChild(alertDiv);
                    }
                }, 3000);

                console.error(
                    'Failed to fetch user requests:',
                    requestsResponse.statusText
                );
            }
        } catch (error) {
            // Show error alert for network issues
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div id="custom-network-error-alert" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    z-index: 9999;
                    background: #dc2626;
                    background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
                    color: #fff;
                    padding: 1.5rem 2.8rem;
                    border-radius: 2rem;
                    box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
                    font-size: 1.18rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 1.1rem;
                    min-width: 320px;
                    max-width: 90vw;
                    animation: networkErrorAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                    overflow: hidden;
                ">
                    <span style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255,255,255,0.13);
                        border-radius: 50%;
                        width: 2.8rem;
                        height: 2.8rem;
                        box-shadow: 0 2px 8px 0 rgba(239,68,68,0.10);
                    ">
                        <i class="fa-solid fa-wifi" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #f8717188);"></i>
                    </span>
                    <span style="letter-spacing:0.01em;">Network error. Please try again.</span>
                </div>
                <style>
                    @keyframes networkErrorAlertPopIn {
                        0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                        60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                if (document.getElementById('custom-network-error-alert')) {
                    document.body.removeChild(alertDiv);
                }
            }, 3000);

            console.error('Error fetching user requests:', error);
        }
    };

    const handleCloseMyRequestsModal = () => {
        setShowMyRequestsModal(false);
    };

    const handleCancelRequest = async (requestId, itemName) => {
        try {
            // Show confirmation dialog
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

            // Handle confirmation
            document.getElementById('confirm-cancel-btn').onclick =
                async () => {
                    document.body.removeChild(alertDiv);

                    try {
                        const response = await fetch(
                            '/api/dist/request/cancel',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    transactionId: requestId,
                                    status: 'Cancelled',
                                }),
                            }
                        );

                        if (response.ok) {
                            // Remove from UI
                            setMyRequests((prev) =>
                                prev.filter((req) => req.id !== requestId)
                            );

                            // Show success message
                            const successDiv = document.createElement('div');
                            successDiv.innerHTML = `
                            <div id="custom-success-alert" style="
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%) scale(0.95);
                                z-index: 9999;
                                background: #10b981;
                                background: linear-gradient(100deg, #10b981 0%, #34d399 100%);
                                color: #fff;
                                padding: 1.5rem 2.8rem;
                                border-radius: 2rem;
                                box-shadow: 0 12px 40px 0 rgba(16,185,129,0.22);
                                font-size: 1.18rem;
                                font-weight: 700;
                                display: flex;
                                align-items: center;
                                gap: 1.1rem;
                                min-width: 320px;
                                max-width: 90vw;
                                animation: successAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                                overflow: hidden;
                            ">
                                <span style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: rgba(255,255,255,0.2);
                                    border-radius: 50%;
                                    width: 2.2rem;
                                    height: 2.2rem;
                                ">
                                    <i class="fa-solid fa-check" style="font-size:1.2rem; color: #fff;"></i>
                                </span>
                                <span>Request cancelled successfully!</span>
                                <span class="success-alert-bar" style="
                                    position: absolute;
                                    bottom: 0; left: 0;
                                    height: 4px;
                                    width: 100%;
                                    background: linear-gradient(90deg, #a7f3d0 0%, #34d399 100%);
                                    animation: successAlertBar 2.1s linear;
                                "></span>
                            </div>
                            <style>
                                @keyframes successAlertPopIn {
                                    0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                                    60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                                }
                                @keyframes successAlertBar {
                                    from { width: 0%; }
                                    to { width: 100%; }
                                }
                            </style>
                        `;
                            document.body.appendChild(successDiv);

                            // Auto-remove success alert after 2.1 seconds
                            setTimeout(() => {
                                if (document.body.contains(successDiv)) {
                                    document.body.removeChild(successDiv);
                                }
                            }, 2100);
                        } else {
                            // Show error message
                            const errorDiv = document.createElement('div');
                            errorDiv.innerHTML = `
                            <div id="custom-error-alert" style="
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%) scale(0.95);
                                z-index: 9999;
                                background: #dc2626;
                                background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
                                color: #fff;
                                padding: 1.5rem 2.8rem;
                                border-radius: 2rem;
                                box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
                                font-size: 1.18rem;
                                font-weight: 700;
                                display: flex;
                                align-items: center;
                                gap: 1.1rem;
                                min-width: 320px;
                                max-width: 90vw;
                                animation: errorAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                                overflow: hidden;
                            ">
                                <span style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: rgba(255,255,255,0.2);
                                    border-radius: 50%;
                                    width: 2.2rem;
                                    height: 2.2rem;
                                ">
                                    <i class="fa-solid fa-times" style="font-size:1.2rem; color: #fff;"></i>
                                </span>
                                <span>Failed to cancel request. Please try again.</span>
                                <span class="error-alert-bar" style="
                                    position: absolute;
                                    bottom: 0; left: 0;
                                    height: 4px;
                                    width: 100%;
                                    background: linear-gradient(90deg, #fee2e2 0%, #f87171 100%);
                                "></span>
                            </div>
                            <style>
                                @keyframes errorAlertPopIn {
                                    0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                                    60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                                }
                            </style>
                        `;
                            document.body.appendChild(errorDiv);

                            // Auto-remove error alert after 5 seconds
                            setTimeout(() => {
                                if (document.body.contains(errorDiv)) {
                                    document.body.removeChild(errorDiv);
                                }
                            }, 5000);
                        }
                    } catch (error) {
                        console.error('Error cancelling request:', error);

                        // Show error message
                        const errorDiv = document.createElement('div');
                        errorDiv.innerHTML = `
                        <div id="custom-error-alert" style="
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%) scale(0.95);
                            z-index: 9999;
                            background: #dc2626;
                            background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
                            color: #fff;
                            padding: 1.5rem 2.8rem;
                            border-radius: 2rem;
                            box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
                            font-size: 1.18rem;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            gap: 1.1rem;
                            min-width: 320px;
                            max-width: 90vw;
                            animation: errorAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                            overflow: hidden;
                        ">
                            <span style="
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: rgba(255,255,255,0.2);
                                border-radius: 50%;
                                width: 2.2rem;
                                height: 2.2rem;
                            ">
                                <i class="fa-solid fa-times" style="font-size:1.2rem; color: #fff;"></i>
                            </span>
                            <span>Network error. Please try again later.</span>
                            <span class="error-alert-bar" style="
                                position: absolute;
                                bottom: 0; left: 0;
                                height: 4px;
                                width: 100%;
                                background: linear-gradient(90deg, #fee2e2 0%, #f87171 100%);
                            "></span>
                        </div>
                        <style>
                            @keyframes errorAlertPopIn {
                                0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                                60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                                100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                            }
                        </style>
                    `;
                        document.body.appendChild(errorDiv);

                        // Auto-remove error alert after 5 seconds
                        setTimeout(() => {
                            if (document.body.contains(errorDiv)) {
                                document.body.removeChild(errorDiv);
                            }
                        }, 5000);
                    }
                };

            // Handle cancel
            document.getElementById('keep-request-btn').onclick = () => {
                document.body.removeChild(alertDiv);
            };
        } catch (error) {
            console.error('Error cancelling request:', error);

            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div id="custom-error-alert" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    z-index: 9999;
                    background: #dc2626;
                    background: linear-gradient(100deg, #dc2626 0%, #f87171 100%);
                    color: #fff;
                    padding: 1.5rem 2.8rem;
                    border-radius: 2rem;
                    box-shadow: 0 12px 40px 0 rgba(239,68,68,0.22);
                    font-size: 1.18rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 1.1rem;
                    min-width: 320px;
                    max-width: 90vw;
                    animation: errorAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                    overflow: hidden;
                ">
                    <span style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(255,255,255,0.2);
                        border-radius: 50%;
                        width: 2.2rem;
                        height: 2.2rem;
                    ">
                        <i class="fa-solid fa-times" style="font-size:1.2rem; color: #fff;"></i>
                    </span>
                    <span>Network error. Please try again later.</span>
                    <span class="error-alert-bar" style="
                        position: absolute;
                        bottom: 0; left: 0;
                        height: 4px;
                        width: 100%;
                        background: linear-gradient(90deg, #fee2e2 0%, #f87171 100%);
                    "></span>
                </div>
                <style>
                    @keyframes errorAlertPopIn {
                        0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                        60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                    }
                </style>
            `;
            document.body.appendChild(errorDiv);

            // Auto-remove error alert after 5 seconds
            setTimeout(() => {
                if (document.body.contains(errorDiv)) {
                    document.body.removeChild(errorDiv);
                }
            }, 5000);
        }
    };

    // Show skeleton during loading
    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className={`flex min-h-screen relative ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                    <main className="flex-1 w-full relative z-10 mt-30">
                        <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-[8vh]">
                            <div className="w-full max-w-5xl mx-auto">
                                <PageHeaderSkeleton />
                                <FilterBarSkeleton />
                                <CardGridSkeleton count={8} columns={4} />
                            </div>
                        </section>
                    </main>
                </div>
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
                            <span className={`uppercase tracking-widest text-xs font-semibold mb-1 letter-spacing-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Welcome to
                            </span>
                            <h1
                                className={`text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
                            >
                                Distribution Center
                            </h1>
                            <div className={`mt-4 w-24 h-2 rounded-full opacity-90 shadow-lg ${isDark ? 'bg-gradient-to-r from-green-400 via-green-400 to-green-300' : 'bg-gradient-to-r from-green-600 via-green-500 to-green-400'}`}></div>
                        </header>

                        <div className="w-full max-w-5xl mb-8 mx-auto space-y-4">
                            <div className="w-full flex flex-wrap items-center gap-3 justify-between">
                                {canShowUserActions && monthlyUsage && (
                                    <div data-tutorial="monthly-limit" className={`${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-blue-50 border-blue-200 text-blue-900'} border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm`}> 
                                        <div className={`${isDark ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} w-10 h-10 rounded-xl flex items-center justify-center shadow-md`}>
                                            <i className="fa-solid fa-circle-info text-base"></i>
                                        </div>
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-semibold text-sm">{MONTHLY_LIMIT} active request limit</span>
                                            <span className={`${isDark ? 'text-gray-300' : 'text-blue-900/80'} text-xs font-medium`}>
                                                {monthlyUsage.remaining} remaining · {monthlyUsage.used} active request{monthlyUsage.used !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 ml-auto">
                                    {canShowUserActions && !monthlyUsage && (
                                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs sm:text-sm`}>Login to view monthly limit</span>
                                    )}
                                    {/* My Requests Button - Always visible for consistency with EIC page */}
                                    <button
                                        data-tutorial="my-requests-button"
                                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm sm:text-base ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-green-400`}
                                        onClick={handleMyRequestsClick}
                                    >
                                        <i className="fa-solid fa-list-check text-base sm:text-lg"></i>
                                        <span className="hidden sm:inline">My Requests</span>
                                        <span className="sm:hidden">Requests</span>
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filter Section */}
                            <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
                                {/* Search Input with Help Button */}
                                <div className="relative flex-1 sm:max-w-md flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            data-tutorial="search-bar"
                                            type="text"
                                            className={`w-full px-10 py-2.5 rounded-lg border text-sm sm:text-base ${isDark ? 'border-gray-600 bg-gray-800 text-gray-100 focus:border-gray-500 focus:ring-2 focus:ring-gray-600 placeholder:text-gray-400' : 'border-gray-300 bg-white text-gray-900 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 placeholder:text-gray-400'} shadow transition font-medium`}
                                            placeholder="Search by name or description..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'} pointer-events-none`}>
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </span>
                                    </div>
                                    <button
                                        onClick={startTutorial}
                                        className={`${isDark ? 'text-gray-400 hover:text-gray-200 bg-gray-800 border-gray-600' : 'text-gray-400 hover:text-gray-600 bg-white border-gray-300'} transition-colors px-3 rounded-lg border shadow hover:bg-opacity-80`}
                                        title="Start Tutorial"
                                        aria-label="Start Tutorial"
                                    >
                                        <i className="fa-solid fa-circle-question text-xl"></i>
                                    </button>
                                </div>

                                {/* Filter Dropdown */}
                                <div className="relative w-auto sm:w-auto sm:ml-auto">
                                    <button
                                        data-tutorial="filter-button"
                                        id="modernFilterButton"
                                        className={`w-auto sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm sm:text-base ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'} font-semibold border shadow transition focus:outline-none`}
                                        onClick={() => setShowFilter((f) => !f)}
                                        type="button"
                                        aria-label="Show filter options"
                                    >
                                        <span className="flex items-center gap-2">
                                            <i className="fa-solid fa-filter"></i>
                                            <span>Filter: {filter}</span>
                                        </span>
                                        <i className={`fa-solid fa-chevron-${showFilter ? 'up' : 'down'} ml-1`}></i>
                                    </button>
                                    {showFilter && (
                                        <div
                                            id="modernFilterDropdown"
                                            className={`absolute w-56 sm:w-56 left-0 sm:left-auto sm:right-0 mt-2 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-lg shadow-lg border z-20 animate-fade-in py-2`}
                                        >
                                            {filterOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    className={`flex items-center gap-3 w-full text-left px-4 py-2 font-medium transition text-sm sm:text-base ${
                                                        filter === opt.value
                                                            ? 'bg-green-600 text-white shadow'
                                                            : isDark 
                                                            ? 'text-gray-200 hover:bg-gray-700'
                                                            : 'text-gray-900 hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => {
                                                        setFilter(opt.value);
                                                        setShowFilter(false);
                                                    }}
                                                >
                                                    {typeIcon(opt.value)}
                                                    <span>{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                            {filteredItems.length === 0 ? (
                                <div className={`col-span-full text-center ${isDark ? 'text-gray-400' : 'text-gray-400'} py-16 text-lg font-semibold tracking-wide`}>
                                    No distribution items found.
                                </div>
                            ) : (
                                paginatedItems.map((item, index) => {
                                    const matchedType = getSeedType(item);
                                    const availableQty =
                                        item.availableQuantity ?? item.quantity ?? 0;
                                    const maxPerRequest =
                                        item.max_quantity_per_request ?? null;
                                    const unitLabel = normalizeUnitLabel(
                                        item.unit
                                    );

                                    return (
                                        <div
                                            key={item.id}
                                            data-tutorial={index === 0 ? "seedling-card" : undefined}
                                            className={`w-full max-w-sm ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200'} rounded-2xl shadow-lg hover:shadow-xl border transition-all duration-300 hover:transform hover:scale-105 overflow-hidden flex flex-col h-[430px]`}
                                        >
                                            <div className="relative">
                                                <img
                                                    className="w-full h-48 object-cover"
                                                    src={item.img}
                                                    alt={item.Name}
                                                    onError={(e) => {
                                                        e.target.src =
                                                            default_image;
                                                    }}
                                                    style={{
                                                        background: '#eff6ff',
                                                    }}
                                                />
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'} line-clamp-1 min-h-[28px]`}>
                                                    {item.Name}
                                                </h3>
                                                <p
                                                    className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2 min-h-[40px] flex-grow`}
                                                    title={item.description}
                                                >
                                                    {item.description}
                                                </p>
                                                {matchedType && (
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                matchedType === 'Rice'
                                                                    ? 'bg-amber-100 text-amber-800'
                                                                    : matchedType === 'Corn'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : matchedType === 'High Value Crops'
                                                                    ? 'bg-emerald-100 text-emerald-800'
                                                                    : isDark
                                                                    ? 'bg-gray-700 text-gray-200'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            {matchedType}
                                                        </span>
                                                        {typeIcon(matchedType)}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mb-4 text-sm font-semibold">
                                                    <span className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                                        Available: {availableQty} {unitLabel}
                                                    </span>
                                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        Max/request:{' '}
                                                        {maxPerRequest != null
                                                            ? `${maxPerRequest} ${unitLabel}`
                                                            : '—'}
                                                    </span>
                                                </div>
                                                {hasActiveRequestForItem(item.stackId) ? (
                                                    <div
                                                        className={`w-full ${
                                                            getActiveRequestStatus(item.stackId) === 'Pending'
                                                                ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                                                                : getActiveRequestStatus(item.stackId) === 'Approved'
                                                                ? 'bg-green-50 border-green-300 text-green-800'
                                                                : 'bg-blue-50 border-blue-300 text-blue-800'
                                                        } border-2 font-semibold py-2.5 px-4 rounded-xl text-center mt-auto`}
                                                    >
                                                        <i className={`fa-solid ${
                                                            getActiveRequestStatus(item.stackId) === 'Pending'
                                                                ? 'fa-clock'
                                                                : getActiveRequestStatus(item.stackId) === 'Approved'
                                                                ? 'fa-check-circle'
                                                                : 'fa-box-open'
                                                        } mr-2`}></i>
                                                        {getActiveRequestStatus(item.stackId) === 'Pending'
                                                            ? 'Request Pending'
                                                            : getActiveRequestStatus(item.stackId) === 'Approved'
                                                            ? 'Request Approved'
                                                            : getActiveRequestStatus(item.stackId) === 'Planted'
                                                            ? 'Planted - Ongoing'
                                                            : 'Picked Up - Ongoing'}
                                                    </div>
                                                ) : monthlyUsage && monthlyUsage.remaining === 0 ? (
                                                    <div
                                                        className={`w-full bg-gray-100 border-2 border-gray-300 text-gray-500 font-semibold py-2.5 px-4 rounded-xl text-center mt-auto cursor-not-allowed`}
                                                    >
                                                        <i className="fa-solid fa-ban mr-2"></i>
                                                        Request Limit Reached
                                                    </div>
                                                ) : (
                                                    <button
                                                        data-tutorial={index === 0 ? "request-button" : undefined}
                                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 mt-auto"
                                                        onClick={() =>
                                                            handleRequestClick(item)
                                                        }
                                                    >
                                                        <i className="fa-solid fa-paper-plane mr-2"></i>
                                                        Request Item
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 mb-2">
                                <nav
                                    data-tutorial="pagination"
                                    className={`flex items-center gap-1 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow px-3 py-1.5`}
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(1, p - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} ${
                                            currentPage === 1
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        aria-label="Previous"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M15 19l-7-7 7-7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    {totalPages > 6 ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(1)
                                                }
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === 1
                                                        ? 'bg-green-600 text-white'
                                                        : isDark 
                                                        ? 'text-gray-200 hover:bg-gray-700'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                1
                                            </button>
                                            {currentPage > 3 && (
                                                <span className={`px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    ...
                                                </span>
                                            )}
                                            {Array.from(
                                                { length: 3 },
                                                (_, i) => {
                                                    const page =
                                                        currentPage - 1 + i;
                                                    if (
                                                        page <= 1 ||
                                                        page >= totalPages
                                                    )
                                                        return null;
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    page
                                                                )
                                                            }
                                                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                                currentPage ===
                                                                page
                                                                    ? 'bg-green-600 text-white'
                                                                    : isDark 
                                                                    ? 'text-gray-200 hover:bg-gray-700'
                                                                    : 'text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                }
                                            )}
                                            {currentPage < totalPages - 2 && (
                                                <span className={`px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(totalPages)
                                                }
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === totalPages
                                                        ? 'bg-green-600 text-white'
                                                        : isDark 
                                                        ? 'text-gray-200 hover:bg-gray-700'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    ) : (
                                        Array.from(
                                            { length: totalPages },
                                            (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() =>
                                                        setCurrentPage(i + 1)
                                                    }
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                        currentPage === i + 1
                                                            ? 'bg-green-600 text-white'
                                                            : isDark 
                                                            ? 'text-gray-200 hover:bg-gray-700'
                                                            : 'text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            )
                                        )
                                    )}
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'} ${
                                            currentPage === totalPages
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                        aria-label="Next"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M9 5l7 7-7 7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </section>
                </main>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-all pt-24 sm:pt-20 md:pt-16 overflow-y-auto">
                    <div data-tutorial="request-modal" className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-0 max-w-4xl w-full relative overflow-hidden animate-fade-in mx-4`}> 
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between px-8 py-6 ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b bg-gradient-to-r from-green-600 to-green-700`}>
                            <h2 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-paper-plane mr-2"></i>
                                Request Distribution Item
                            </h2>
                            <button
                                data-tutorial="close-request-modal"
                                className="text-white text-2xl hover:text-green-200 transition"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <form
                            onSubmit={handleSubmit}
                            className="px-8 py-6 flex flex-col gap-6 max-h-[80vh]"
                        >
                            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-y-auto pr-1">
                                <div className="flex-1 space-y-5 min-w-0">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={selectedItem?.img}
                                            alt={selectedItem?.Name}
                                            onError={(e) => {
                                                e.target.src = default_image;
                                            }}
                                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-300 shadow"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                                                {selectedItem?.Name}
                                            </div>
                                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {selectedItem?.category}
                                            </div>
                                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Available Stock: {selectedItem?.quantity} {normalizeUnitLabel(selectedItem?.unit)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3`}>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <i className="fa-solid fa-info-circle mr-2"></i>
                                            <span className="text-red-500">*</span>{' '}
                                            indicates required fields
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="pickupDate"
                                                className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                            >
                                                Pickup Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                id="pickupDate"
                                                name="pickupDate"
                                                value={requestData.pickupDate}
                                                onChange={handleInputChange}
                                                onBlur={handleDateInput}
                                                className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition ${
                                                    formErrors.pickupDate
                                                        ? 'border-red-300 bg-red-50'
                                                        : isDark 
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                        : 'border-gray-300 bg-white text-gray-900'
                                                }`}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                max={addYears(new Date(), 2).toISOString().split('T')[0]}
                                            />
                                            {formErrors.pickupDate && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {formErrors.pickupDate}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="quantity"
                                                className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                            >
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                name="quantity"
                                                value={requestData.quantity}
                                                onChange={handleQuantityChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === '-' || e.key === '.' || e.key === 'e' || e.key === 'E') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition ${
                                                    formErrors.quantity
                                                        ? 'border-red-300 bg-red-50'
                                                        : isDark 
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                        : 'border-gray-300 bg-white text-gray-900'
                                                }`}
                                                required
                                                min="1"
                                                max={
                                                    selectedItem?.max_quantity_per_request
                                                        ? Math.min(selectedItem.max_quantity_per_request, selectedItem?.quantity)
                                                        : selectedItem?.quantity
                                                }
                                            />
                                            {formErrors.quantity && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {formErrors.quantity}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor="farmLocation"
                                                className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                            >
                                                Farm Location <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="farmLocation"
                                                name="farmLocation"
                                                value={requestData.farmLocation}
                                                onChange={handleInputChange}
                                                className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition ${
                                                    formErrors.farmLocation
                                                        ? 'border-red-300 bg-red-50'
                                                        : isDark 
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                        : 'border-gray-300 bg-white text-gray-900'
                                                }`}
                                                placeholder="Barangay, Municipality"
                                                required
                                            />
                                            {formErrors.farmLocation && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {formErrors.farmLocation}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="areaPlanted"
                                                className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                            >
                                                Area Planted (ha) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="areaPlanted"
                                                name="areaPlanted"
                                                value={requestData.areaPlanted}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => {
                                                    if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                                }}
                                                step="0.01"
                                                min="0"
                                                className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition ${
                                                    formErrors.areaPlanted
                                                        ? 'border-red-300 bg-red-50'
                                                        : isDark 
                                                        ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                        : 'border-gray-300 bg-white text-gray-900'
                                                }`}
                                                placeholder="e.g., 1.5"
                                                required
                                            />
                                            {formErrors.areaPlanted && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {formErrors.areaPlanted}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="plantingMethod"
                                            className={`block ${isDark ? 'text-gray-200' : 'text-gray-700'} text-sm font-medium mb-1`}
                                        >
                                            Planting Method <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="plantingMethod"
                                            name="plantingMethod"
                                            value={requestData.plantingMethod}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition ${
                                                formErrors.plantingMethod
                                                    ? 'border-red-300 bg-red-50'
                                                    : isDark 
                                                    ? 'border-gray-600 bg-gray-700 text-gray-100'
                                                    : 'border-gray-300 bg-white text-gray-900'
                                            }`}
                                            required
                                        >
                                            <option value="">Select method</option>
                                            <option value="Direct_Seeded">Direct Seeded</option>
                                            <option value="Transplanting">Transplanting</option>
                                        </select>
                                        {formErrors.plantingMethod && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {formErrors.plantingMethod}
                                            </p>
                                        )}
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
                                            className={`w-full rounded-xl border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition resize-none`}
                                            placeholder="Describe the purpose for this distribution item and any special requirements..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="w-full lg:w-80 xl:w-96 space-y-4 flex-shrink-0">
                                    {selectedItem?.max_quantity_per_request && (
                                        <div className={`${isDark ? 'bg-blue-900/30 border-blue-600 text-blue-100' : 'bg-blue-50 border-blue-400 text-blue-800'} border rounded-lg p-4`}> 
                                            <div className="flex items-start gap-2">
                                                <i className={`fa-solid fa-box mt-0.5 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}></i>
                                                <div>
                                                    <p className="text-sm font-semibold">Quantity limit per request</p>
                                                    <p className="text-sm">
                                                        Up to <strong>{selectedItem.max_quantity_per_request} {normalizeUnitLabel(selectedItem.unit)}</strong> per submission.
                                                    </p>
                                                    {requestData.quantity > 0 && (
                                                        <p className={`text-xs mt-1 font-semibold ${requestData.quantity > selectedItem.max_quantity_per_request ? 'text-red-200' : 'text-green-200'}`}>
                                                            Your entry: {requestData.quantity} {normalizeUnitLabel(selectedItem.unit)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`${isDark ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 space-y-3`}> 
                                        <div className="flex items-center gap-2">
                                            <i className="fa-solid fa-clipboard-check text-green-600"></i>
                                            <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                                Request Summary
                                            </h4>
                                        </div>
                                        {requestData.pickupDate || requestData.quantity || requestData.farmLocation || requestData.areaPlanted || requestData.plantingMethod ? (
                                            <div className={`space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                <div className="flex justify-between gap-2">
                                                    <span>Pickup Date:</span>
                                                    <span className="font-medium text-right">
                                                        {requestData.pickupDate
                                                            ? new Date(requestData.pickupDate).toLocaleDateString('en-US', {
                                                                  weekday: 'short',
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                              })
                                                            : '—'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span>Quantity:</span>
                                                    <span className="font-medium text-right">
                                                        {requestData.quantity ? `${requestData.quantity} ${normalizeUnitLabel(selectedItem?.unit)}` : '—'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span>Farm Location:</span>
                                                    <span className="font-medium text-right ml-2 truncate max-w-[160px]">
                                                        {requestData.farmLocation || '—'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span>Area Planted:</span>
                                                    <span className="font-medium text-right">
                                                        {requestData.areaPlanted ? `${requestData.areaPlanted} ha` : '—'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-2">
                                                    <span>Planting Method:</span>
                                                    <span className="font-medium text-right">
                                                        {requestData.plantingMethod === 'Direct_Seeded'
                                                            ? 'Direct Seeded'
                                                            : requestData.plantingMethod === 'Transplanting'
                                                            ? 'Transplanting'
                                                            : requestData.plantingMethod || '—'}
                                                    </span>
                                                </div>
                                                <div className={`text-xs text-green-600 mt-2 p-2 ${isDark ? 'bg-green-900/30' : 'bg-green-50'} rounded border`}>
                                                    <i className="fa-solid fa-info-circle mr-1"></i>
                                                    Distribution items do not require return
                                                </div>
                                            </div>
                                        ) : (
                                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Fill out the form to see a quick summary.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`flex flex-col sm:flex-row sm:justify-end gap-3 pt-3 ${isDark ? 'border-gray-700' : 'border-gray-200'} border-t`}> 
                                <button
                                    type="button"
                                    className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} font-semibold px-5 py-2 rounded-xl transition focus:outline-none`}
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="font-semibold px-6 py-2 rounded-xl shadow transition focus:outline-none bg-green-600 hover:bg-green-700 text-white"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-all pt-24 sm:pt-20 md:pt-16">
                    <div data-tutorial="requests-modal" className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-0 max-w-6xl w-full mx-4 relative overflow-hidden animate-fade-in max-h-[90vh] flex flex-col`}>
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between px-8 py-6 ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b bg-gradient-to-r from-green-600 to-green-700 flex-shrink-0`}>
                            <h2 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-list mr-2"></i>
                                My Distribution Requests
                            </h2>
                            <button
                                data-tutorial="close-requests-modal"
                                className="text-white text-2xl hover:text-green-200 transition"
                                onClick={handleCloseMyRequestsModal}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
                            {monthlyUsage && canShowUserActions && (
                                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`${isDark ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} w-10 h-10 rounded-xl flex items-center justify-center shadow-md`}>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm sm:text-base">{MONTHLY_LIMIT} active request limit</div>
                                            <div className={`${isDark ? 'text-gray-300' : 'text-blue-900/80'} text-xs sm:text-sm`}>
                                                {monthlyUsage.remaining} remaining · {monthlyUsage.used} active request{monthlyUsage.used !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:min-w-[220px] w-full sm:w-auto">
                                        <div className={`${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full h-2 flex-1 overflow-hidden border ${isDark ? 'border-gray-600' : 'border-blue-100'}`}>
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                                                style={{ width: `${Math.min(100, ((monthlyUsage?.used || 0) / MONTHLY_LIMIT) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-blue-900/90'}`}>
                                            {`${Math.min(monthlyUsage?.used || 0, MONTHLY_LIMIT)}/${MONTHLY_LIMIT}`}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {displayRequests.length > 0 ? (
                                <div>
                                    <div className={`mb-6 text-sm ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-gray-600 bg-gray-50 border-gray-200'} p-4 rounded-xl border`}>
                                        <i className={`fa-solid fa-info-circle mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}></i>
                                        <span className="font-medium">
                                            Found {displayRequests.length} request
                                            {displayRequests.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            • Sorted by most recent first
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className={`w-full border-collapse ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm rounded-xl overflow-hidden`}>
                                            <thead>
                                                <tr className={`${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'} text-left`}>
                                                    <th className={`py-4 px-6 font-semibold ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b min-w-[280px]`}>
                                                        Item Details
                                                    </th>
                                                    <th className={`py-4 px-4 font-semibold ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b text-center min-w-[80px]`}>
                                                        Quantity
                                                    </th>
                                                    <th className={`py-4 px-4 font-semibold ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b min-w-[120px]`}>
                                                        Pickup Date
                                                    </th>
                                                    <th className={`py-4 px-4 font-semibold ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b text-center min-w-[100px]`}>
                                                        Status
                                                    </th>
                                                    <th className={`py-4 px-6 font-semibold ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b text-center min-w-[160px]`}>
                                                        Next Steps
                                                    </th>
                                                    <th className={`py-4 px-4 font-semibold ${isDark ? 'border-gray-600' : 'border-gray-200'} border-b text-center min-w-[120px]`}>
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {displayRequests.map(
                                                    (request, index) => (
                                                        <tr
                                                            key={request.id}
                                                            className={`${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border-b transition-colors ${
                                                                index % 2 === 0
                                                                    ? isDark ? 'bg-gray-800' : 'bg-white'
                                                                    : isDark ? 'bg-gray-750' : 'bg-gray-25'
                                                            }`}
                                                        >
                                                            <td className="py-5 px-6">
                                                                <div className="space-y-2">
                                                                    <div className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'} text-base leading-tight`}>
                                                                        {
                                                                            request.itemName
                                                                        }
                                                                    </div>
                                                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                                                                        <i className="fa-solid fa-tag mr-1"></i>
                                                                        {
                                                                            request.itemCategory
                                                                        }
                                                                    </div>
                                                                    {request.requestNote && (
                                                                        <div className={`text-xs ${isDark ? 'text-gray-300 bg-gray-700 border-gray-600' : 'text-gray-600 bg-gray-50 border-gray-300'} mt-2 p-2 rounded-lg border-l-2`}>
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
                                                                <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
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
                                                            <td className="py-5 px-4 text-center">
                                                                <span
                                                                    className={`px-3 py-2 rounded-full text-xs font-bold min-w-[80px] inline-block ${
                                                                        // Check for archived request with harvested planting report - show as Harvested
                                                                        (request.status === 'Archived' && request.plantingReport?.state === 'Harvested')
                                                                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                            // Or check for harvested planting report regardless of status
                                                                            : request.plantingReport?.state === 'Harvested'
                                                                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                            : request.status ===
                                                                        'Pending'
                                                                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                            : request.status ===
                                                                              'Approved'
                                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                                            : request.status ===
                                                                              'Picked_Up'
                                                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                                            : request.status ===
                                                                              'late_pickup'
                                                                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                                                            : request.status ===
                                                                              'Planted'
                                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                                            : request.status ===
                                                                              'Rejected'
                                                                            ? 'bg-red-100 text-red-800 border border-red-200'
                                                                            : request.status ===
                                                                              'No_Pickup'
                                                                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                                                            : request.status ===
                                                                              'Cancelled'
                                                                            ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                            : request.status ===
                                                                              'Archived'
                                                                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                                                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                    }`}
                                                                >
                                                                    {
                                                                        // Show Harvested for archived requests with harvested planting reports
                                                                        (request.status === 'Archived' && request.plantingReport?.state === 'Harvested')
                                                                        ? 'Harvested'
                                                                        // Or check for harvested planting report regardless of status
                                                                        : request.plantingReport?.state === 'Harvested'
                                                                        ? 'Harvested'
                                                                        : request.status ===
                                                                    'No_Pickup'
                                                                        ? 'No Pickup'
                                                                        : request.status ===
                                                                          'Picked_Up'
                                                                        ? 'Picked Up'
                                                                        : request.status ===
                                                                          'late_pickup'
                                                                        ? 'Late Pickup'
                                                                        : request.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <div className={`text-xs font-medium ${
                                                                    request.plantingReport?.state === 'Harvested'
                                                                        ? isDark ? 'text-purple-300 bg-purple-900/20' : 'text-purple-700 bg-purple-50'
                                                                        : request.status === 'Pending'
                                                                        ? isDark ? 'text-yellow-300 bg-yellow-900/20' : 'text-yellow-700 bg-yellow-50'
                                                                        : request.status === 'Approved'
                                                                        ? isDark ? 'text-green-300 bg-green-900/20' : 'text-green-700 bg-green-50'
                                                                        : request.status === 'Picked_Up'
                                                                        ? isDark ? 'text-blue-300 bg-blue-900/20' : 'text-blue-700 bg-blue-50'
                                                                        : request.status === 'Rejected'
                                                                        ? isDark ? 'text-red-300 bg-red-900/20' : 'text-red-700 bg-red-50'
                                                                        : request.status === 'Cancelled' || request.status === 'No_Pickup'
                                                                        ? isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100'
                                                                        : isDark ? 'text-gray-400' : 'text-gray-600'
                                                                } px-3 py-2 rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                                                    {request.plantingReport?.state === 'Harvested' ? (
                                                                        <>
                                                                            <i className="fa-solid fa-check-circle mr-1"></i>
                                                                            Harvest completed
                                                                        </>
                                                                    ) : request.status === 'Pending' && (
                                                                        <>
                                                                            <i className="fa-solid fa-hourglass-half mr-1"></i>
                                                                            Waiting for admin approval
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Approved' && (
                                                                        <>
                                                                            <i className="fa-solid fa-box mr-1"></i>
                                                                            Pick up on {new Date(request.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Picked_Up' && !request.plantingReport && (
                                                                        <>
                                                                            <i className="fa-solid fa-seedling mr-1"></i>
                                                                            Plant and report progress
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Picked_Up' && request.plantingReport && request.plantingReport.state !== 'Harvested' && (
                                                                        <>
                                                                            <i className="fa-solid fa-seedling mr-1"></i>
                                                                            Continue reporting progress
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Planted' && request.plantingReport?.state !== 'Harvested' && (
                                                                        <>
                                                                            <i className="fa-solid fa-seedling mr-1"></i>
                                                                            Continue reporting progress
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Rejected' && (
                                                                        <>
                                                                            <i className="fa-solid fa-ban mr-1"></i>
                                                                            Request was not approved
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Cancelled' && (
                                                                        <>
                                                                            <i className="fa-solid fa-circle-xmark mr-1"></i>
                                                                            Request cancelled
                                                                        </>
                                                                    )}
                                                                    {request.status === 'No_Pickup' && (
                                                                        <>
                                                                            <i className="fa-solid fa-calendar-xmark mr-1"></i>
                                                                            Pickup window expired
                                                                        </>
                                                                    )}
                                                                    {request.status === 'Archived' && (
                                                                        <>
                                                                            <i className="fa-solid fa-archive mr-1"></i>
                                                                            Request completed
                                                                        </>
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
                                                                    <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm italic`}>
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
                                        <i className={`fa-solid fa-inbox text-6xl ${isDark ? 'text-gray-600' : 'text-gray-300'}`}></i>
                                    </div>
                                    <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                                        No Requests Found
                                    </h3>
                                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        You haven't made any distribution
                                        requests yet.
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
