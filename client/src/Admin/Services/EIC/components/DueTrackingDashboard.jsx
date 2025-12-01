import { useState, useEffect } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import default_image from '../../../../Assets/eic_default.png';

export default function DueTrackingDashboard() {
    const { isDark } = useTheme();
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('dueDate');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch due tracking data
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/eic/request/due-tracking?filter=${filter}&sortBy=${sortBy}`
            );
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                toast.error('Failed to fetch due tracking data');
            }
        } catch (error) {
            console.error('Error fetching due tracking:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter, sortBy]);

    // Filter by search term
    const filteredTransactions = data?.all?.filter(
        (t) =>
            t.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Stat Card Component - Compact version
    const StatCard = ({ title, count, color, icon, onClick, active }) => {
        const colorClasses = {
            red: { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-50', darkBg: 'bg-red-900/20' },
            orange: { border: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', darkBg: 'bg-orange-900/20' },
            yellow: { border: 'border-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50', darkBg: 'bg-yellow-900/20' },
            blue: { border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', darkBg: 'bg-blue-900/20' }
        };
        const colors = colorClasses[color];

        return (
            <button
                onClick={onClick}
                className={`${active ? colors.border : isDark ? 'border-gray-700' : 'border-gray-200'} ${isDark ? colors.darkBg : colors.bg} border-2 rounded-lg px-4 py-2 cursor-pointer transition-all hover:shadow-md ${
                    active ? 'ring-2 ring-offset-1' : ''
                } flex items-center gap-3 w-full`}
            >
                <i className={`fa-solid fa-${icon} ${colors.text} text-xl`}></i>
                <div className="text-left flex-1">
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
                    <p className={`text-xl font-bold ${colors.text}`}>{count || 0}</p>
                </div>
            </button>
        );
    };

    // Urgency Badge Component
    const UrgencyBadge = ({ urgency, daysUntilDue }) => {
        const badgeClasses = {
            critical: 'bg-red-100 text-red-800 border-red-200',
            urgent: 'bg-orange-100 text-orange-800 border-orange-200',
            warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            normal: 'bg-blue-100 text-blue-800 border-blue-200'
        };

        const text =
            daysUntilDue < 0
                ? `${Math.abs(daysUntilDue)} ${Math.abs(daysUntilDue) === 1 ? 'day' : 'days'} overdue`
                : daysUntilDue === 0
                ? 'Due today'
                : `Due in ${daysUntilDue} ${daysUntilDue === 1 ? 'day' : 'days'}`;

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClasses[urgency]}`}
            >
                {text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Summary Cards - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <StatCard
                        title="Overdue"
                        count={data?.counts.overdue}
                        color="red"
                        icon="exclamation-triangle"
                        onClick={() => setFilter('overdue')}
                        active={filter === 'overdue'}
                    />
                    <StatCard
                        title="Due Today"
                        count={data?.counts.dueToday}
                        color="orange"
                        icon="clock"
                        onClick={() => setFilter('today')}
                        active={filter === 'today'}
                    />
                    <StatCard
                        title="Due This Week"
                        count={data?.counts.dueThisWeek}
                        color="yellow"
                        icon="calendar-week"
                        onClick={() => setFilter('week')}
                        active={filter === 'week'}
                    />
                    <StatCard
                        title="Total Active"
                        count={data?.counts.total}
                        color="blue"
                        icon="list-check"
                        onClick={() => setFilter('all')}
                        active={filter === 'all'}
                    />
                </div>

                {/* Filters and Search */}
                <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-6`}>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <i className={`fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}></i>
                            <input
                                type="text"
                                placeholder="Search by item, user, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                } focus:ring-2 focus:ring-green-500 focus:outline-none`}
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`px-4 py-2 rounded-lg border ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-green-500 focus:outline-none`}
                            >
                                <option value="dueDate">Sort by Due Date</option>
                                <option value="user">Sort by User</option>
                                <option value="createdAt">Sort by Request Date</option>
                            </select>

                            <button
                                onClick={fetchData}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <i className="fa-solid fa-rotate"></i>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-16">
                            <i className={`fa-solid fa-inbox text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}></i>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                No Items Found
                            </h3>
                            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                                {searchTerm
                                    ? 'Try adjusting your search'
                                    : 'No items match the selected filter'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <tr>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Item
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Borrower
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Pickup Date
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Return Date
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Status
                                        </th>
                                        <th className={`px-6 py-4 text-center text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Qty
                                        </th>
                                        <th className={`px-6 py-4 text-left text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                                            Contact
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr
                                            key={transaction.id}
                                            className={`${
                                                index % 2 === 0
                                                    ? isDark ? 'bg-gray-800' : 'bg-white'
                                                    : isDark ? 'bg-gray-750' : 'bg-gray-50'
                                            } hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    
                                                    <div>
                                                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {transaction.itemName}
                                                        </div>
                                                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {transaction.itemCategory}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {transaction.userName}
                                                </div>
                                                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {transaction.userEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <i className="fa-solid fa-calendar-plus mr-2 text-green-600"></i>
                                                    {new Date(transaction.pickupDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <i className="fa-solid fa-calendar-minus mr-2 text-red-600"></i>
                                                    {new Date(transaction.returnDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <UrgencyBadge
                                                    urgency={transaction.urgency}
                                                    daysUntilDue={transaction.daysUntilDue}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                                    {transaction.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    <i className="fa-solid fa-phone mr-2 text-blue-600"></i>
                                                    {transaction.userContact || 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            {/* Results Count */}
            {filteredTransactions.length > 0 && (
                <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                    Showing {filteredTransactions.length} of {data?.counts.total} total items
                </div>
            )}
        </div>
    );
}
