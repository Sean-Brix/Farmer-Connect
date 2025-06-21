// All green color classes and hex codes are replaced with blue equivalents.

import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';

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
        quantity: 1,
        request_note: '',
        schedule_date: '',
    });
    const [myRequests, setMyRequests] = useState([]);
    const [showMyRequestsModal, setShowMyRequestsModal] = useState(false);

    const categories = [
        'All',
        ...Array.from(new Set(distributionItems.map((i) => i.category))),
    ];

    const filteredItems = distributionItems.filter(
        (i) =>
            (filter === 'All' || i.category === filter) &&
            (search === '' ||
                (i.name &&
                    i.name.toLowerCase().includes(search.toLowerCase())) ||
                (i.category &&
                    i.category.toLowerCase().includes(search.toLowerCase())) ||
                (i.description &&
                    i.description.toLowerCase().includes(search.toLowerCase())))
    );

    useEffect(() => {
        const fetchDistributionItems = async () => {
            try {
                const response = await fetch(
                    `/api/distribution/getAll?status=Available`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const { payload } = await response.json();
                if (Array.isArray(payload)) {
                    const itemsWithImages = await Promise.all(
                        payload.map(async (item) => {
                            try {
                                const imageResponse = await fetch(
                                    `/api/distribution/getImage?id=${item.id}`
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
                    setDistributionItems(itemsWithImages);
                } else {
                    console.warn(
                        'Payload is not an array or is empty:',
                        payload
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
            return <i className="fa-solid fa-seedling text-blue-500"></i>;
        if (type === 'Fertilizers')
            return <i className="fa-solid fa-flask text-blue-500"></i>;
        if (type === 'Livestock')
            return <i className="fa-solid fa-horse text-yellow-500"></i>;
        if (type === 'Fish Fingerlings')
            return <i className="fa-solid fa-fish text-blue-500"></i>;
        if (type === 'Organic Inputs')
            return <i className="fa-solid fa-leaf text-blue-700"></i>;
        if (type === 'Tools')
            return <i className="fa-solid fa-toolbox text-gray-500"></i>;
        if (type === 'Plants')
            return <i className="fa-solid fa-tree text-blue-900"></i>;
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

    const handleRequestClick = async (item) => {
        try {
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
            console.log('Request Distribution Item: ' + e);
        }
    };

    const cancelRequest = async (request) => {
        if (!confirm('Are you sure you want to cancel this request?')) return;

        const response = await fetch(
            `/api/distribution/deleteRequest?id=${request.id}`,
            {
                method: 'GET',
            }
        );

        if (response.ok) {
            setMyRequests(myRequests.filter((req) => req.id !== request.id));
            alert('Request cancelled successfully!');
        } else {
            alert('Failed to cancel request.');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/distribution/request_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: selectedItem.id,
                    quantity: requestData.quantity,
                    request_note: requestData.request_note,
                    schedule_date: requestData.schedule_date,
                }),
            });

            if (response.ok) {
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
                            background: linear-gradient(90deg, #dbeafe 0%, #2563eb 100%);
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
                    quantity: 1,
                    request_note: '',
                    schedule_date: '',
                });
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || 'Error submitting request';

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
                        <span style="letter-spacing:0.01em;">${errorMessage}</span>
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
                    quantity: 1,
                    request_note: '',
                    schedule_date: '',
                });
            }
        } catch (error) {
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
                    align-items: center ;
                    gap: 1.1rem;
                    min-width: 320px;
                    max-width: 90vw;
                    animation: eicAlertPopIn 0.45s cubic-bezier(.68,-0.55,.27,1.55);
                    overflow: hidden;
                ">
                    <span style="
                        display: flex;
                        align-items: center ;
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
            const response = await fetch('/api/authentication/gotToken');
            if (!response.ok) {
                if (confirm('Login first?')) {
                    navigate('/login');
                    return;
                }
                return;
            }

            const requestsResponse = await fetch('/api/distribution/myRequest');
            if (requestsResponse.ok) {
                const data = await requestsResponse.json();
                setMyRequests(Array.isArray(data.payload) ? data.payload : []);
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
                                Distribution Center
                            </h1>
                            <div className="mt-3 w-16 sm:w-24 h-2 rounded-full bg-gray-200 opacity-80"></div>
                        </header>
                        <div className="flex flex-row items-center w-full max-w-3xl mt-4 mb-8 gap-3 justify-center">
                            <div className="flex flex-none min-w-1/2 max-w-xs gap-2 bg-white rounded-2xl shadow-lg px-4 py-1 items-center border border-gray-200 h-12">
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
                        <div className="grid  grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
                            {paginatedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="max-w-full max-h-[370px] rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_8px_32px_0_rgba(60,60,60,0.25)] bg-blue-200 m-4 border-2 border-blue-300 transition duration-200 hover:border-blue-400 hover:scale-[1.025] backdrop-blur-lg"
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
                                                            'Seeds'
                                                                ? 'bg-gray-700'
                                                                : item.category ===
                                                                  'Fertilizers'
                                                                ? 'bg-gray-500'
                                                                : item.category ===
                                                                  'Livestock'
                                                                ? 'bg-gray-900'
                                                                : item.category ===
                                                                  'Fish Fingerlings'
                                                                ? 'bg-blue-500'
                                                                : item.category ===
                                                                  'Organic Inputs'
                                                                ? 'bg-blue-500'
                                                                : item.category ===
                                                                  'Tools'
                                                                ? 'bg-yellow-500'
                                                                : item.category ===
                                                                  'Plants'
                                                                ? 'bg-indigo-500'
                                                                : item.category ===
                                                                  'Compost'
                                                                ? 'bg-orange-500'
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
                                            {item.name}
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
                                                    className={`inline-block w-2 h-2 rounded-full mr-1
                                                        ${
                                                            item.status ===
                                                            'Available'
                                                                ? 'bg-green-400'
                                                                : item.status ===
                                                                  'Out of Stock'
                                                                ? 'bg-yellow-400'
                                                                : item.status ===
                                                                  'Scheduled'
                                                                ? 'bg-red-400'
                                                                : 'bg-gray-400'
                                                        }`}
                                                ></span>
                                                {item.status}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-white hover:bg-blue-700 text-blue-900 hover:text-white font-bold py-2 px-5 rounded-2xl text-base border-2 border-blue-700 transition-colors shadow-lg"
                                                    onClick={() =>
                                                        handleRequestClick(item)
                                                    }
                                                >
                                                    Request
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                                Request Item
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
                                                            alt={selectedItem?.name}
                                                            className="w-16 h-16 rounded-xl object-cover border-2 border-blue-700 shadow"
                                                        />
                                                        <div>
                                                            <div className="text-lg font-semibold text-blue-900 truncate">
                                                                {selectedItem?.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {selectedItem?.category}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label
                                                                htmlFor="schedule_date"
                                                                className="block text-gray-700 text-sm font-medium mb-1"
                                                            >
                                                                Pickup Date
                                                            </label>
                                                            <input
                                                                type="date"
                                                                id="schedule_date"
                                                                name="schedule_date"
                                                                value={requestData.schedule_date}
                                                                onChange={handleInputChange}
                                                                className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                                                required
                                                                min={new Date().toISOString().split('T')[0]}
                                                            />
                                                        </div>
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
                                                            />
                                                        </div>
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
                                                            rows="3"
                                                            className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none transition resize-none"
                                                            placeholder="Optional"
                                                        ></textarea>
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
                                            <div className="bg-white rounded-3xl shadow-2xl p-0 max-w-3xl w-full relative overflow-hidden animate-fade-in">
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
                                                Pickup Date
                                            </th>
                                            <th className="py-2">Quantity</th>
                                            <th className="py-2">Status</th>
                                            <th className="py-2">Actions</th>
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
                                                    {new Date(
                                                        request.schedule_date
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    {request.quantity}
                                                </td>
                                                <td className="py-3">
                                                    {request.status}
                                                </td>
                                                <td className="py-3">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() =>
                                                            cancelRequest(
                                                                request
                                                            )
                                                        }
                                                    >
                                                        Cancel Request
                                                    </button>
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
                    .text-4xl, .md\\:text-5xl {
                        font-size: 1.7rem !important;
                    }

                    .text-2xl, .sm\\:text-2xl {
                        font-size: 1.2rem !important;
                    }

                    .text-3xl, .sm\\:text-3xl {
                        font-size: 1.5rem !important;
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.2s;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                html,
                body,
                #root {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                html::-webkit-scrollbar,
                body::-webkit-scrollbar,
                #root::-webkit-scrollbar {
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
