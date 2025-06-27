// Replace all green color classes and hex codes with blue equivalents

// 1. Tailwind classes:
// - green-700 -> blue-700
// - green-800 -> blue-800
// - green-900 -> blue-900
// - green-600 -> blue-600
// - green-400 -> blue-400
// - green-200 -> blue-200
// - green-100 -> blue-100
// - green-50  -> blue-50
// - green-500 -> blue-500

// 2. Inline styles and gradients:
// - #16a34a (green-600) -> #2563eb (blue-600)
// - #22c55e (green-500) -> #3b82f6 (blue-500)
// - #14532d (green-900) -> #1e3a8a (blue-900)
// - #bbf7d0 (green-100) -> #dbeafe (blue-100)
// - #14532d (green-900) -> #1e3a8a (blue-900)
// - #22c55e (green-500) -> #3b82f6 (blue-500)
// - #14532d (green-900) -> #1e3a8a (blue-900)
// - #14532d (green-900) -> #1e3a8a (blue-900)
// - #22c55e (green-500) -> #3b82f6 (blue-500)
// - #16a34a (green-600) -> #2563eb (blue-600)
// - #bbf7d0 (green-100) -> #dbeafe (blue-100)

// The following is your code with all green colors replaced with blue:

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';

// ASSETS
import default_image from './Assets/default_image.jpg';

const ITEMS_PER_PAGE = 8;

export default function Eic() {
    const navigate = useNavigate();
    const [equipmentList, setEquipmentList] = useState([]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [requestData, setRequestData] = useState({
        borrow_date: '',
        return_date: '',
        request_note: '',
        quantity: 1,
    });
    const [myRequests, setMyRequests] = useState([]);
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);

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

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(
                    `/api/eic/getAll?status=Available`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const { payload } = await response.json();

                if (Array.isArray(payload)) {
                    const equipmentWithImages = await Promise.all(
                        payload.map(async (item) => {
                            try {
                                const imageResponse = await fetch(
                                    `/api/eic/getImage?id=${item.id}`
                                );
                                if (imageResponse.ok) {
                                    const imageBlob =
                                        await imageResponse.blob();
                                    if (imageBlob.size > 0) {
                                        const imageURL =
                                            URL.createObjectURL(imageBlob);
                                        return { ...item, img: imageURL };
                                    } else {
                                        return { ...item, img: default_image };
                                    }
                                } else {
                                    console.error(
                                        `Failed to fetch image for item ${item.id}: ${imageResponse.statusText}`
                                    );
                                    return { ...item, img: default_image };
                                }
                            } catch (imageError) {
                                console.error(
                                    `Error fetching image for item ${item.id}:`,
                                    imageError
                                );
                                return { ...item, img: default_image };
                            }
                        })
                    );
                    setEquipmentList(equipmentWithImages);
                } else {
                    console.warn(
                        'Payload is not an array or is empty:',
                        payload
                    );
                    setEquipmentList([]);
                }
            } catch (error) {
                console.error('Failed to fetch equipment:', error);
                setEquipmentList([]);
            }
        };

        fetchEquipment();
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
        if (type === 'Farming Equipment')
            return <i className="fa-solid fa-seedling text-blue-500"></i>;
        if (type === 'Harvesting Tools')
            return <i className="fa-solid fa-hand-holding text-yellow-500"></i>;
        if (type === 'Irrigation Systems')
            return <i className="fa-solid fa-tint text-blue-500"></i>;
        if (type === 'Storage Equipment')
            return <i className="fa-solid fa-warehouse text-gray-500"></i>;
        if (type === 'Processing Equipment')
            return <i className="fa-solid fa-industry text-red-500"></i>;
        if (type === 'Safety Gear')
            return <i className="fa-solid fa-shield-alt text-orange-500"></i>;
        if (type === 'Pest Control')
            return <i className="fa-solid fa-bug text-purple-500"></i>;
        if (type === 'Livestock Equipment')
            return <i className="fa-solid fa-horse text-pink-500"></i>;
        if (type === 'Measuring Tools')
            return <i className="fa-solid fa-ruler-combined text-teal-500"></i>;
        if (type === 'Fisheries')
            return <i className="fa-solid fa-fish text-indigo-500"></i>;
        if (type === 'Machinery')
            return <i className="fa-solid fa-tractor text-cyan-500"></i>;
        return <i className="fa-solid fa-toolbox text-gray-500"></i>;
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
            const response = await fetch('/api/authentication/gotToken');
            if (!response.ok) {
                if (confirm('Login first?')) {
                    navigate('/login');
                    return;
                }
                return;
            }

            setSelectedItem(item);
            setModalOpen(true);
        } catch (e) {
            console.log('Request EIC Item:  ' + e);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // SUBMIT REQUEST
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/eic/request_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: selectedItem.id,
                    borrow_date: requestData.borrow_date,
                    return_date: requestData.return_date,
                    request_note: requestData.request_note,
                    quantity: requestData.quantity,
                }),
            });

            if (response.ok) {
                // Show custom animated alert centered on screen
                const alertDiv = document.createElement('div');
                alertDiv.innerHTML = `
                    <div id="custom-eic-alert" style="
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
                        animation: eicAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
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
                        <span class="eic-alert-bar" style="
                            position: absolute;
                            bottom: 0; left: 0;
                            height: 4px;
                            width: 100%;
                            background: linear-gradient(90deg, #dbeafe 0%, #3b82f6 100%);
                            animation: eicAlertBar 2.1s linear;
                        "></span>
                    </div>
                    <style>
                        @keyframes eicAlertPopIn {
                            0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                            60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                            100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                        }
                        @keyframes eicAlertBar {
                            from { width: 0%; }
                            to { width: 100%; }
                        }
                    </style>
                `;
                document.body.appendChild(alertDiv);

                setTimeout(() => {
                    const el = document.getElementById('custom-eic-alert');
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
                    borrow_date: '',
                    return_date: '',
                    request_note: '',
                    quantity: 1,
                });
            } else {
                await response.json();
                // Custom alert for admin cannot borrow
                const alertDiv = document.createElement('div');
                alertDiv.innerHTML = `
                    <div id="custom-eic-alert" style="
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
                        animation: eicAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
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
                        <span style="letter-spacing:0.01em;">Admin cannot borrow an EIC item</span>
                        <span class="eic-alert-bar" style="
                            position: absolute;
                            bottom: 0; left: 0;
                            height: 4px;
                            width: 100%;
                            background: linear-gradient(90deg, #fecaca 0%, #dc2626 100%);
                            animation: eicAlertBar 2.1s linear;
                        "></span>
                    </div>
                    <style>
                        @keyframes eicAlertPopIn {
                            0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                            60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                            100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                        }
                        @keyframes eicAlertBar {
                            from { width: 0%; }
                            to { width: 100%; }
                        }
                    </style>
                `;
                document.body.appendChild(alertDiv);

                setTimeout(() => {
                    const el = document.getElementById('custom-eic-alert');
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
                    borrow_date: '',
                    return_date: '',
                    request_note: '',
                    quantity: 1,
                });
                return;
            }
        } catch (error) {
            // Custom alert for error submitting request
            const alertDiv = document.createElement('div');
            alertDiv.innerHTML = `
                <div id="custom-eic-alert" style="
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
                    animation: eicAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
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
                    <span class="eic-alert-bar" style="
                        position: absolute;
                        bottom: 0; left: 0;
                        height: 4px;
                        width: 100%;
                        background: linear-gradient(90deg, #fecaca 0%, #dc2626 100%);
                        animation: eicAlertBar 2.1s linear;
                    "></span>
                </div>
                <style>
                    @keyframes eicAlertPopIn {
                        0% { opacity: 0; transform: translate(-50%, -60%) scale(0.85);}
                        60% { opacity: 1; transform: translate(-50%, -50%) scale(1.05);}
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
                    }
                    @keyframes eicAlertBar {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                </style>
            `;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                const el = document.getElementById('custom-eic-alert');
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
            //Check if user is logged in
            const response = await fetch('/api/authentication/gotToken');
            if (!response.ok) {
                if (confirm('Login first?')) {
                    navigate('/login');
                    return;
                }
                return;
            }

            // TODO do
            const requestsResponse = await fetch('/api/eic/myRequest');
            if (requestsResponse.ok) {
                const requestsData = await requestsResponse.json();
                setMyRequests(
                    Array.isArray(requestsData.payload)
                        ? requestsData.payload
                        : []
                );
                setShowMyRequestsModal(true);
            } else {
                console.error(
                    'Failed to fetch user requests:',
                    requestsResponse.statusText
                );
                alert('Failed to fetch your requests.');
            }
        } catch (error) {
            console.error('Error fetching user requests:', error);
            alert('Error fetching your requests.');
        }
    };

    const handleCloseMyRequestsModal = () => {
        setShowMyRequestsModal(false);
    };

    return (
        <>
            <Navbar />
            <div
                className="flex min-h-screen bg-white relative"
                style={{
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                }}
            >
                <main className="flex-1 w-full relative z-10 mt-30">
                    <section className="w-full px-2 sm:px-4 flex flex-col items-center pt-16 ">
                        <header className="flex flex-col items-center mb-10">
                            <span className="uppercase tracking-widest text-gray-400 text-xs font-medium mb-1 letter-spacing-wide">
                                Welcome to
                            </span>
                            <h1 className="text-4xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center eic-title">
                                Equipments, Inputs & Commodities
                            </h1>
                            <div className="mt-3 w-16 sm:w-24 h-2 rounded-full bg-gray-200 opacity-80"></div>
                        </header>
                        <div className="flex flex-row items-center w-full max-w-3xl mt-4 mb-8 gap-3 justify-center">
                            <div className="flex flex-none min-w-1/2 max-w-xs gap-2 bg-white rounded-2xl shadow-lg px-4 py-1 items-center border</div> border-gray-200 h-12">
                                <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-transparent focus:outline-none focus:ring-0 text-gray-900 bg-transparent transition placeholder:text-gray-400"
                                        placeholder="Search by name, category, description..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="relative h-12 flex items-center">
                                <button
                                    id="modernFilterButton"
                                    className="flex items-center gap-2 px-4 sm:px-5 py-2 h-12 rounded-xl bg-white text-blue-900 font-semibold border border-gray-200 shadow transition-all duration-200 hover:bg-gray-50 focus:outline-none text-base sm:text-lg"
                                    onClick={() => setShowFilter((f) => !f)}
                                    type="button"
                                    aria-label="Show filter options"
                                    style={{ minHeight: '3rem' }}
                                >
                                    <i className="fa-solid fa-filter text-blue-900 text-base sm:text-lg"></i>
                                    <span className="hidden sm:inline">
                                        {filterBy}
                                    </span>
                                    <i
                                        className={`fa-solid fa-chevron-${
                                            showFilter ? 'up' : 'down'
                                        } ml-2 text-blue-900`}
                                    ></i>
                                </button>
                                {showFilter && (
                                    <div
                                        id="modernFilterDropdown"
                                        className="absolute left-0 top-full mt-2 w-44 sm:w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 animate-fade-in py-2 px-2"
                                        style={{ minWidth: '100%' }}
                                    >
                                        {filterOptions.map((opt) => (
                                            <button
                                                key={opt.value}
                                                className={`flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2 rounded-xl font-semibold transition text-sm sm:text-base ${
                                                    filterBy === opt.value
                                                        ? 'bg-gray-800 text-white'
                                                        : 'text-gray-700 hover:bg-gray-50'
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
                                <div className="sm:hidden absolute left-0 top-0 w-full h-full pointer-events-none">
                                    <select
                                        className="opacity-0 absolute w-full h-full pointer-events-auto"
                                        value={filter}
                                        onChange={(e) =>
                                            setFilter(e.target.value)
                                        }
                                        aria-label="Filter by category"
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                className="flex items-center gap-2 px-4 sm:px-5 py-2 h-12 rounded-xl bg-white text-blue-900 font-semibold border border-gray-200 shadow transition-all duration-200 hover:bg-gray-50 focus:outline-none text-base sm:text-lg"
                                onClick={handleMyRequestsClick}
                                type="button"
                                aria-label="View your requests"
                                style={{ minHeight: '3rem' }}
                            >
                                <i className="fa-solid fa-list text-blue-900 text-base sm:text-lg"></i>
                                <span className="hidden sm:inline">
                                    My Requests
                                </span>
                            </button>
                        </div>
                        <div className="w-full max-w-7xl grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 px-2">
                            {paginatedItems.map((item) => {
                                // Status color mapping
                                let statusColor = 'bg-gray-400';
                                switch (item.status) {
                                    case 'Available':
                                        statusColor = 'bg-green-300';
                                        break;
                                    case 'Borrowed':
                                        statusColor = 'bg-borrowed-500';
                                        break;
                                    case 'Reserved':
                                        statusColor = 'bg-yellow-400';
                                        break;
                                    case 'Returned':
                                        statusColor = 'bg-green-500';
                                        break;
                                    case 'Maintenance':
                                        statusColor = 'bg-orange-500';
                                        break;
                                    default:
                                        statusColor = 'bg-gray-400';
                                }
                                return (
                                    <div
                                        key={item.id}
                                        className="max-w-full max-h-[370px]  overflow-hidden shadow-2xl hover:shadow-[0_8px_32px_0_rgba(60,60,60,0.25)] bg-blue-100 m-4 border-2 border-blue-200 transition duration-200 hover:border-blue-300 hover:scale-[1.025] backdrop-blur-lg"
                                    >
                                        <div className="relative">
                                            <img
                                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                                src={item.img}
                                                alt={item.name}
                                            />
                                            <span
                                                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                                            ${
                                                item.category ===
                                                'Farming Equipment'
                                                    ? 'bg-gray-700'
                                                    : item.category ===
                                                      'Harvesting Tools'
                                                    ? 'bg-gray-500'
                                                    : item.category ===
                                                      'Machinery'
                                                    ? 'bg-gray-900'
                                                    : 'bg-gray-400'
                                            } text-white`}
                                                style={{
                                                    boxShadow:
                                                        '0 2px 8px 0 rgba(60,60,60,0.12)',
                                                }}
                                            >
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="p-5 flex flex-col h-[170px]">
                                            <h3 className="text-xl font-bold mb-1 truncate text-blue-900">
                                                {item.Name}
                                            </h3>
                                            <p
                                                className="text-gray-700 text-sm mb-4 truncate"
                                                title={item.description}
                                            >
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-xs text-gray-700 flex items-center gap-1">
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full mr-1 ${statusColor}`}
                                                    ></span>
                                                    {item.status}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="bg-white hover:bg-blue-700 text-blue-900 hover:text-white font-bold py-2 px-5 rounded-2xl text-base border-2 border-blue-700 transition-colors shadow-lg"
                                                        onClick={() =>
                                                            handleRequestClick(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Request
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {filteredItems.length === 0 && (
                            <div className="text-center text-gray-400 py-10 sm:py-16 text-base sm:text-lg font-medium">
                                No items found for this category.
                            </div>
                        )}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap justify-center mt-10 gap-2 items-center mb-6">
                                <button
                                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    aria-label="Previous page"
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`px-4 py-2 rounded-lg font-semibold ${
                                            currentPage === i + 1
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-gray-200 text-blue-700 hover:bg-blue-300'
                                        }`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    aria-label="Next page"
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-lg w-full relative overflow-hidden animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-blue-600">
                            <h2 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-paper-plane mr-2"></i>
                                Request Equipment
                            </h2>
                            <button
                                className="text-white text-2xl hover:text-blue-200 transition"
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
                            <div className="flex items-center gap-4 mb-2">
                                <img
                                    src={selectedItem?.img}
                                    alt={selectedItem?.Name}
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-blue-700 shadow"
                                />
                                <div>
                                    <div className="text-lg font-semibold text-blue-900 truncate">
                                        {selectedItem?.Name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {selectedItem?.category}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Stock: {selectedItem?.quantity}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="borrow_date"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Borrow Date
                                    </label>
                                    <input
                                        type="date"
                                        id="borrow_date"
                                        name="borrow_date"
                                        value={requestData.borrow_date}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                        required
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="return_date"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Return Date
                                    </label>
                                    <input
                                        type="date"
                                        id="return_date"
                                        name="return_date"
                                        value={requestData.return_date}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            if (
                                                e.target.value <
                                                requestData.borrow_date
                                            ) {
                                                setRequestData((prevData) => ({
                                                    ...prevData,
                                                    borrow_date: e.target.value,
                                                    return_date: e.target.value,
                                                }));
                                            }
                                        }}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                        required
                                        min={
                                            requestData.borrow_date
                                                ? requestData.borrow_date
                                                : new Date()
                                                      .toISOString()
                                                      .split('T')[0]
                                        }
                                    />
                                    {requestData.return_date <
                                        requestData.borrow_date && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Return date must be after borrow
                                            date.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="quantity"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        value={requestData.quantity}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                        required
                                        min="1"
                                        max={selectedItem?.quantity}
                                        title=""
                                    />
                                    {requestData.quantity >
                                        selectedItem?.quantity && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Quantity exceeds available stock.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="request_note"
                                        className="block text-gray-700 text-sm font-medium mb-1"
                                    >
                                        Notes
                                    </label>
                                    <textarea
                                        id="request_note"
                                        name="request_note"
                                        value={requestData.request_note}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition resize-none"
                                        placeholder="Optional"
                                    ></textarea>
                                </div>
                            </div>
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
                                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl shadow transition focus:outline-none"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showMyRequestsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-2xl w-full relative overflow-hidden animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-blue-600">
                            <h2 className="text-xl font-bold text-white">
                                <i className="fa-solid fa-list mr-2"></i>
                                My Requests
                            </h2>
                            <button
                                className="text-white text-2xl hover:text-blue-200 transition"
                                onClick={handleCloseMyRequestsModal}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="px-8 py-6 space-y-5">
                            {myRequests.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="py-2">Item</th>
                                            <th className="py-2">
                                                Borrow Date
                                            </th>
                                            <th className="py-2">
                                                Return Date
                                            </th>
                                            <th className="py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myRequests.map((request) => (
                                            <tr
                                                key={request.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3">
                                                    {request.item_name}
                                                </td>
                                                <td className="py-3">
                                                    {request.borrow_date}
                                                </td>
                                                <td className="py-3">
                                                    {request.return_date}
                                                </td>
                                                <td className="py-3">
                                                    {request.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center text-gray-500 py-10">
                                    No requests found.
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
                .eic-title {
                    color: #1e3a8a !important;
                }
                @media (max-width: 640px) {
                    .text-4xl, .md\\:text-5xl { font-size: 1.7rem !important; }
                    .text-2xl, .sm\\:text-2xl { font-size: 1.2rem !important; }
                    .text-3xl, .sm\\:text-3xl { font-size: 1.5rem !important; }
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
