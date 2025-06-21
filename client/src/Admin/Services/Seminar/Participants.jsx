import React, { useEffect, useState } from 'react';

export default function Participants({ data, toggleOff }) {
    const [section, setSection] = useState('participants');
    const [participants, setParticipants] = useState([]);
    const [statsVisible, setStatsVisible] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [totalCounts, setTotalCounts] = useState({
        total: 0,
        attended: 0,
        cancelled: 0,
        noShow: 0,
        registered: 0,
    });
    const [showSelect, setShowSelect] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bulkStatus, setBulkStatus] = useState('Registered');

    useEffect(() => {
        fetchParticipants();
    }, [data.id]);

    const fetchParticipants = async () => {
        try {
            const response = await fetch(
                `/api/seminars/getParticipants?seminar_id=${data.id}`
            );
            const users = await response.json();
            const participantList = users.payload.list;
            setParticipants(participantList);
            updateCounts(participantList);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const updateCounts = (participantList) => {
        const initialCounts = {
            total: participantList.length,
            attended: participantList.filter((p) => p.status === 'Attended')
                .length,
            cancelled: participantList.filter((p) => p.status === 'Cancelled')
                .length,
            noShow: participantList.filter((p) => p.status === 'No Show')
                .length,
            registered: participantList.filter((p) => p.status === 'Registered')
                .length,
        };
        setTotalCounts(initialCounts);
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();

        const newStatus = e.target.value;
        const userId = e.target.closest('tr').querySelector('th').textContent;

        await updateStatus(userId, newStatus);
    };

    const updateStatus = async (userId, newStatus) => {
        const participant_id = participants.find(
            (participant) => participant.id == userId
        )?.participant_id;

        try {
            const response = await fetch(
                '/api/seminars/participants/updateStatus',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        participants_id: participant_id,
                        new_status: newStatus,
                    }),
                }
            );

            if (!response.ok) {
                console.error('Failed to update status:', response.status);
                alert('Failed to update status. Please try again.');
                return;
            }
            const updatedResponse = await fetch(
                `/api/seminars/getParticipants?seminar_id=${data.id}`
            );
            const updatedUsers = await updatedResponse.json();

            const updatedParticipantList = updatedUsers.payload.list;
            setParticipants(updatedParticipantList);

            const updatedCounts = {
                total: updatedParticipantList.length,
                attended: updatedParticipantList.filter(
                    (p) => p.status === 'Attended'
                ).length,
                cancelled: updatedParticipantList.filter(
                    (p) => p.status === 'Cancelled'
                ).length,
                noShow: updatedParticipantList.filter(
                    (p) => p.status === 'No Show'
                ).length,
                registered: updatedParticipantList.filter(
                    (p) => p.status === 'Registered'
                ).length,
            };
            setTotalCounts(updatedCounts);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
        }
    };

    const handleToggleSelectParticipant = (userId) => {
        setSelectedParticipants((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter((id) => id !== userId);
            } else {
                return [...prevSelected, userId];
            }
        });
    };

    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        if (searchTerm === '') {
            fetchParticipants();
        } else {
            try {
                const response = await fetch(
                    `/api/seminars/getParticipants?seminar_id=${data.id}`
                );
                const users = await response.json();
                const allParticipants = users.payload.list;

                const filteredParticipants = allParticipants.filter(
                    (participant) =>
                        participant.firstname
                            .toLowerCase()
                            .includes(searchTerm) ||
                        participant.lastname
                            .toLowerCase()
                            .includes(searchTerm) ||
                        participant.email_address
                            .toLowerCase()
                            .includes(searchTerm)
                );
                setParticipants(filteredParticipants);
                updateCounts(filteredParticipants);
            } catch (error) {
                console.error('Error fetching participants:', error);
            }
        }
    };

    const handleBulkStatusChange = (e) => {
        setBulkStatus(e.target.value);
    };

    const handleUpdateBulkStatus = async () => {
        for (const userId of selectedParticipants) {
            await updateStatus(userId, bulkStatus);
        }
        setSelectedParticipants([]);
        setShowSelect(false);
    };

    const handleSelectAll = () => {
        if (
            selectedParticipants.length === participants.map((p) => p.id).length
        ) {
            setSelectedParticipants([]);
        } else {
            setSelectedParticipants(participants.map((p) => p.id));
        }
    };

    const isAllSelected =
        selectedParticipants.length === participants.map((p) => p.id).length &&
        participants.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-2 md:p-6 lg:p-10 border border-blue-200 transition-all duration-300 flex flex-col max-h-[97vh]">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center p-2 md:p-0 md:justify-between gap-4 md:gap-6 mb-4 md:mb-6 border-b pb-4 md:pb-6">
                    <div className="min-w-0">
                        <h2 className="text-xl md:text-3xl font-black mb-2 text-blue-900 tracking-tight leading-tight truncate">
                            {data.title}
                        </h2>
                        <div className="flex flex-wrap gap-x-8 gap-y-1 text-blue-700 text-base md:text-lg font-medium">
                            <div className="flex flex-col min-w-[120px]">
                                <span className="break-all">
                                    <span className="font-bold text-blue-900">
                                        Speaker:
                                    </span>{' '}
                                    <span className="break-all inline-block align-middle">
                                        {data.speaker}
                                    </span>
                                </span>
                                <span className="break-all mt-1">
                                    <span className="font-bold text-blue-900">
                                        Location:
                                    </span>{' '}
                                    <span className="break-all inline-block align-middle">
                                        {data.location}
                                    </span>
                                </span>
                            </div>
                            <div className="flex flex-col min-w-[120px]">
                                <span className="break-all">
                                    <span className="font-bold text-blue-900">
                                        Status:
                                    </span>{' '}
                                    {data.status}
                                </span>
                                <span className="break-all mt-1">
                                    <span className="font-bold text-blue-900">
                                        Dates:
                                    </span>{' '}
                                    {new Date(
                                        data.start_date
                                    ).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    -{' '}
                                    {new Date(data.end_date).toLocaleDateString(
                                        undefined,
                                        {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={toggleOff}
                        className="absolute top-2 right-2 md:static md:ml-4 bg-gradient-to-tr from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-2xl transition-all duration-200"
                        aria-label="Close"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-2/3">
                        <input
                            type="text"
                            placeholder="Search participants..."
                            className="border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl px-4 py-2 w-full transition text-base shadow-md bg-blue-50"
                            onChange={handleSearchChange}
                            value={searchTerm}
                        />
                        <button
                            onClick={() => setStatsVisible(!statsVisible)}
                            className="bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-800 font-semibold px-4 py-2 rounded-xl transition text-base shadow"
                        >
                            {statsVisible ? 'Hide Stats' : 'Show Stats'}
                        </button>
                    </div>

                    {/* SELECT MULTIPLE */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <button
                            onClick={() => setShowSelect(!showSelect)}



                            className={`font-semibold px-4 py-2 rounded-xl transition text-base shadow ${
                                showSelect
                                    ? 'bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white'
                            }`}
                        >
                            {showSelect ? 'Cancel' : 'Select Multiple'}
                        </button>

                        {showSelect && (
                            <>
                                <button
                                    onClick={handleSelectAll}
                                    className={`bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded-xl transition text-base shadow ${
                                        participants.length === 0
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={participants.length === 0}
                                >
                                    {isAllSelected
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                                <select
                                    className="border border-blue-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base bg-white"
                                    value={bulkStatus}
                                    onChange={handleBulkStatusChange}
                                >
                                    <option value="Registered">
                                        Registered
                                    </option>
                                    <option value="Attended">Attended</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="No Show">No Show</option>
                                </select>
                                <button
                                    onClick={handleUpdateBulkStatus}
                                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold px-4 py-2 rounded-xl transition text-base shadow"
                                >
                                    Update Selected
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* STATS */}
                {statsVisible && (
                    <div className="mb-4 md:mb-6 p-4 border rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-100 flex flex-wrap gap-6 justify-between shadow-inner">
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-xl font-black text-blue-700">
                                {totalCounts.total}
                            </span>
                            <span className="text-xs text-gray-500">Total</span>
                        </div>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-xl font-black text-green-700">
                                {totalCounts.attended}
                            </span>
                            <span className="text-xs text-gray-500">
                                Attended
                            </span>
                        </div>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-xl font-black text-blue-700">
                                {totalCounts.registered}
                            </span>
                            <span className="text-xs text-gray-500">
                                Registered
                            </span>
                        </div>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-xl font-black text-red-700">
                                {totalCounts.cancelled}
                            </span>
                            <span className="text-xs text-gray-500">
                                Cancelled
                            </span>
                        </div>
                        <div className="flex flex-col items-center min-w-[70px]">
                            <span className="text-xl font-black text-yellow-700">
                                {totalCounts.noShow}
                            </span>
                            <span className="text-xs text-gray-500">
                                No Show
                            </span>
                        </div>
                    </div>
                )}

                {/* PARTICIPANTS TABLE */}
                {section === 'participants' && (
                    <div
                        className="overflow-x-auto rounded-2xl shadow-xl border border-blue-100 bg-white flex-1 min-h-0"
                        style={{ maxHeight: '50vh', overflowY: 'auto' }}
                    >
                        <table className="min-w-full text-base text-left text-gray-700">
                            <thead className="text-xs uppercase bg-gradient-to-r from-blue-50 to-blue-100">
                                <tr>
                                    <th className="px-3 py-3 font-bold whitespace-nowrap">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 font-bold whitespace-nowrap">
                                        Full Name
                                    </th>
                                    <th className="px-4 py-3 font-bold whitespace-nowrap">
                                        Email
                                    </th>
                                    <th className="px-3 py-3 font-bold whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-bold whitespace-nowrap">
                                        Registration Date
                                    </th>
                                    <th className="px-3 py-3 font-bold whitespace-nowrap">
                                        Actions
                                    </th>
                                    {showSelect && (
                                        <th className="px-3 py-3 font-bold whitespace-nowrap">
                                            Select
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {participants.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={showSelect ? 7 : 6}
                                            className="px-4 py-16 text-center text-base font-semibold bg-blue-50"
                                        >
                                            No participants found.
                                        </td>
                                    </tr>
                                ) : (
                                    participants.map((user, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white border-b hover:bg-blue-50 transition"
                                        >
                                            <th className="px-3 py-3 font-semibold text-blue-900 whitespace-nowrap">
                                                {user.id}
                                            </th>
                                            <td className="px-4 py-3 max-w-[120px] md:max-w-[220px] truncate">
                                                <span className="font-bold text-blue-900 truncate block">
                                                    {user.firstname}{' '}
                                                    {user.lastname}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-[140px] md:max-w-[260px] truncate">
                                                <span className="text-blue-700 truncate block">
                                                    {user.email_address}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span
                                                    className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                                                        user.status ===
                                                        'Registered'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : user.status ===
                                                              'Attended'
                                                            ? 'bg-green-100 text-green-800'
                                                            : user.status ===
                                                              'Cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : user.status ===
                                                              'No Show'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {user.status || 'loading'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-[100px] md:max-w-[180px] truncate">
                                                <span className="text-gray-500 truncate block">
                                                    {user.reg_date}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <select
                                                    className="border border-blue-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white text-sm"
                                                    value={
                                                        user.status || 'loading'
                                                    }
                                                    onChange={
                                                        handleStatusUpdate
                                                    }
                                                >
                                                    <option value="Registered">
                                                        Registered
                                                    </option>
                                                    <option value="Attended">
                                                        Attended
                                                    </option>
                                                    <option value="Cancelled">
                                                        Cancelled
                                                    </option>
                                                    <option value="No Show">
                                                        No Show
                                                    </option>
                                                </select>
                                            </td>
                                            {showSelect && (
                                                <td className="px-3 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedParticipants.includes(
                                                            user.id
                                                        )}
                                                        onChange={() =>
                                                            handleToggleSelectParticipant(
                                                                user.id
                                                            )
                                                        }
                                                        className="w-5 h-5 accent-blue-500 rounded-lg border-blue-300"
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
