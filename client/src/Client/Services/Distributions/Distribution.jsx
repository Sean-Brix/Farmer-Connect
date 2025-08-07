import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';

// ASSETS
import default_image from './Assets/default_image.jpg';

const ITEMS_PER_PAGE = 8;

export default function Distribution() {
    const navigate = useNavigate();
    const [distributionItems, setDistributionItems] = useState([]);
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
    });
    const [myRequests, setMyRequests] = useState([]);
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const categories = [
        'All',
        ...Array.from(new Set(distributionItems.map((i) => i.category))),
    ];

    const filteredItems = distributionItems.filter(
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

    useEffect(() => {
        const fetchDistributionItems = async () => {
            try {
                const response = await fetch('/api/dist/all');
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
            }
        };

        fetchDistributionItems();
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

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
        if (type === 'Seeds')
            return <i className="fa-solid fa-seedling text-green-500"></i>;
        if (type === 'Fertilizers')
            return <i className="fa-solid fa-flask text-green-500"></i>;
        if (type === 'Livestock')
            return <i className="fa-solid fa-horse text-yellow-500"></i>;
        if (type === 'Fish Fingerlings')
            return <i className="fa-solid fa-fish text-green-500"></i>;
        if (type === 'Organic Inputs')
            return <i className="fa-solid fa-leaf text-green-700"></i>;
        if (type === 'Tools')
            return <i className="fa-solid fa-toolbox text-gray-500"></i>;
        if (type === 'Plants')
            return <i className="fa-solid fa-tree text-green-900"></i>;
        if (type === 'Compost')
            return <i className="fa-solid fa-recycle text-orange-500"></i>;
        return <i className="fa-solid fa-question text-gray-500"></i>;
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

    // SEND REQUEST
    const handleRequestClick = async (item) => {
        try {
            //Check if user is logged in
            // const response = await fetch('/api/authentication/gotToken');
            // if (!response.ok) {
            //     if (confirm('Login first?')) {
            //         navigate('/login');
            //         return;
            //     }
            //     return;
            // }

            setSelectedItem(item);
            setModalOpen(true);
        } catch (e) {
            console.error('Request Distribution Item error:', e);
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
            const response = await fetch('/api/dist/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: selectedItem.id,
                    pickupDate: requestData.pickupDate,
                    request_note: requestData.request_note,
                    quantity: parseInt(requestData.quantity),
                }),
            });

            if (response.ok) {
                // Show custom animated alert centered on screen
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
                        box-shadow: 0 12px 40px 0 rgba(59,130,246,0.22);
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
                            box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
                        ">
                            <i class="fa-solid fa-circle-check" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #3b82f688);"></i>
                        </span>
                        <span style="letter-spacing:0.01em;">Request submitted successfully!</span>
                        <span class="dist-alert-bar" style="
                            position: absolute;
                            bottom: 0; left: 0;
                            height: 4px;
                            width: 100%;
                            background: linear-gradient(90deg, #dbeafe 0%, #3b82f6 100%);
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
                });
                setFormErrors({});
            } else {
                await response.json();
                // Custom alert for admin cannot request distribution items
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
                            <i class="fa-solid fa-circle-xmark" style="font-size:2rem; color: #fff; filter: drop-shadow(0 2px 8px #f8717188);"></i>
                        </span>
                        <span style="letter-spacing:0.01em;">Admin cannot request distribution items</span>
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
                });
                setFormErrors({});
                return;
            }
        } catch (error) {
            // Custom alert for error submitting request
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
            const requestsResponse = await fetch('/api/dist/request/me');

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
                setMyRequests(
                    Array.isArray(requestsData.requests)
                        ? requestsData.requests
                        : []
                );
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
                        background: rgba(255,255,255,0.13);
                        border-radius: 50%;
                        width: 3rem;
                        height: 3rem;
                        box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
                    ">
                        <i class="fa-solid fa-exclamation-triangle" style="font-size:1.5rem; color: #fff; filter: drop-shadow(0 2px 8px #3b82f688);"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.4rem;">Cancel Request</h3>
                        <p style="margin: 0; font-weight: 400; opacity: 0.9; font-size: 1rem;">
                            Are you sure you want to cancel your request for "<strong>${itemName}</strong>"?
                        </p>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <button id="confirm-cancel-btn" style="
                            background: rgba(220,38,38,0.9);
                            border: 2px solid rgba(220,38,38,0.8);
                            color: #fff;
                            padding: 0.75rem 1.5rem;
                            border-radius: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 1rem;
                        ">Yes, Cancel</button>
                        <button id="keep-request-btn" style="
                            background: transparent;
                            border: 2px solid rgba(255,255,255,0.3);
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
                    #confirm-cancel-btn:hover { background: rgba(220,38,38,1); transform: translateY(-2px); }
                    #keep-request-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
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

    return (
        <>
            <Navbar />
            <div
                className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative"
                style={{ overflow: 'hidden' }}
            >
                <main className="flex-1 w-full relative z-10 mt-30">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-20">
                        <header className="flex flex-col items-center mb-12 w-full">
                            <span className="uppercase tracking-widest text-green-400 text-xs font-semibold mb-1 letter-spacing-wide">
                                Welcome to
                            </span>
                            <h1
                                className="text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center text-green-800 "
                                
                            >
                                Distribution Center
                            </h1>
                            <div className="mt-4 w-24 h-2 rounded-full bg-gradient-to-r from-green-400 via-green-300 to-green-200 opacity-90 shadow-lg"></div>
                        </header>

                        <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center max-w-5xl mb-8 gap-4 flex-wrap mx-auto">
                            <div className="w-full sm:w-auto flex justify-center order-2 sm:order-1">
                                <button
                                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-green-400"
                                    onClick={handleMyRequestsClick}
                                >
                                    <i className="fa-solid fa-list-check text-lg"></i>
                                    My Requests
                                </button>
                            </div>
                            <div className="flex gap-3 flex-wrap items-center justify-center w-full sm:w-auto order-1 sm:order-2">
                                <div className="relative w-full sm:w-auto flex justify-center">
                                    <input
                                        type="text"
                                        className="w-full sm:w-72 md:w-80 lg:w-96 px-10 py-2 rounded-lg border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 text-green-900 bg-white shadow transition placeholder:text-green-400 font-medium"
                                        placeholder="Search by name, category, description..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </div>
                                <div className="relative flex justify-center w-full sm:w-auto">
                                    <button
                                        id="modernFilterButton"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-green-100 text-green-700 font-semibold border border-green-200 shadow transition focus:outline-none"
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
                                            className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-100 z-20 animate-fade-in py-2"
                                        >
                                            {filterOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg font-medium transition text-base ${
                                                        filter === opt.value
                                                            ? 'bg-green-600 text-white shadow'
                                                            : 'text-green-900 hover:bg-green-50'
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
                        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                            {filteredItems.length === 0 ? (
                                <div className="col-span-full text-center text-green-300 py-16 text-lg font-semibold tracking-wide">
                                    No distribution items found.
                                </div>
                            ) : (
                                paginatedItems.map((item) => {
                                    return (
                                        <div
                                            key={item.id}
                                            className="w-full max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-xl border border-green-100 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden flex flex-col h-[420px]"
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
                                                <span
                                                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg
                                                    ${
                                                        item.category ===
                                                        'Seeds'
                                                            ? 'bg-green-500'
                                                            : item.category ===
                                                              'Fertilizers'
                                                            ? 'bg-green-500'
                                                            : item.category ===
                                                              'Livestock'
                                                            ? 'bg-yellow-500'
                                                            : item.category ===
                                                              'Fish Fingerlings'
                                                            ? 'bg-green-500'
                                                            : item.category ===
                                                              'Organic Inputs'
                                                            ? 'bg-green-700'
                                                            : item.category ===
                                                              'Tools'
                                                            ? 'bg-gray-500'
                                                            : item.category ===
                                                              'Plants'
                                                            ? 'bg-green-900'
                                                            : item.category ===
                                                              'Compost'
                                                            ? 'bg-orange-500'
                                                            : 'bg-gray-500'
                                                    }`}
                                                >
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="text-xl font-bold mb-2 text-green-900 line-clamp-1 min-h-[28px]">
                                                    {item.Name}
                                                </h3>
                                                <p
                                                    className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px] flex-grow"
                                                    title={item.description}
                                                >
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm text-green-700 font-semibold">
                                                        Qty: {item.quantity}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {typeIcon(
                                                            item.category
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 mt-auto"
                                                    onClick={() =>
                                                        handleRequestClick(item)
                                                    }
                                                >
                                                    <i className="fa-solid fa-paper-plane mr-2"></i>
                                                    Request Item
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 mb-2">
                                <nav
                                    className="flex items-center gap-1 bg-white rounded-lg shadow px-3 py-1.5"
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(1, p - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
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
                                                        ? 'bg-green-500 text-white'
                                                        : 'text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                1
                                            </button>
                                            {currentPage > 3 && (
                                                <span className="px-1 text-gray-400">
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
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                }
                                            )}
                                            {currentPage < totalPages - 2 && (
                                                <span className="px-1 text-gray-400">
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setCurrentPage(totalPages)
                                                }
                                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all font-semibold ${
                                                    currentPage === totalPages
                                                        ? 'bg-green-500 text-white'
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
                                                            ? 'bg-green-500 text-white'
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
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all text-gray-500 hover:bg-gray-200 hover:text-gray-700 ${
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-lg w-full relative overflow-hidden animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-700 to-green-600">
                            <h2 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-paper-plane mr-2"></i>
                                Request Distribution Item
                            </h2>
                            <button
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
                            className="px-8 py-6 space-y-5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={selectedItem?.img}
                                    alt={selectedItem?.Name}
                                    onError={(e) => {
                                        e.target.src = default_image;
                                    }}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-green-700 shadow"
                                />
                                <div className="flex-1">
                                    <div className="text-lg font-semibold text-green-900 truncate">
                                        {selectedItem?.Name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {selectedItem?.category}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Available Stock:{' '}
                                        {selectedItem?.quantity}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-green-800">
                                    <i className="fa-solid fa-info-circle mr-2"></i>
                                    <span className="text-red-500">*</span>{' '}
                                    indicates required fields
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none transition ${
                                            formErrors.pickupDate
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-200'
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
                                        className={`w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none transition ${
                                            formErrors.quantity
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-200'
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
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none transition resize-none"
                                    placeholder="Describe the purpose for this distribution item and any special requirements..."
                                ></textarea>
                            </div>

                            {/* Request Summary */}
                            {requestData.pickupDate && requestData.quantity && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        <i className="fa-solid fa-clipboard-check mr-2"></i>
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
                                        <div className="flex justify-between">
                                            <span>Quantity:</span>
                                            <span className="font-medium">
                                                {requestData.quantity} unit(s)
                                            </span>
                                        </div>
                                        <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded border">
                                            <i className="fa-solid fa-info-circle mr-1"></i>
                                            Distribution items do not require
                                            return
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-xl transition focus:outline-none"
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
                                    className={`font-semibold px-6 py-2 rounded-xl shadow transition focus:outline-none ${
                                        !requestData.pickupDate ||
                                        !requestData.quantity
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-700 hover:bg-green-800 text-white'
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-6xl w-full mx-4 relative overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-green-700 to-green-600 flex-shrink-0">
                            <h2 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-list mr-2"></i>
                                My Distribution Requests
                            </h2>
                            <button
                                className="text-white text-2xl hover:text-green-200 transition"
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
                                                                              'No_Pickup'
                                                                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                                                            : request.status ===
                                                                              'Cancelled'
                                                                            ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                                                            : 'bg-green-100 text-green-800 border border-green-200'
                                                                    }`}
                                                                >
                                                                    {request.status ===
                                                                    'No_Pickup'
                                                                        ? 'No Pickup'
                                                                        : request.status}
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
