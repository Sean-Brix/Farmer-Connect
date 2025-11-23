import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Calendar, TrendingUp, Users, Filter, Archive, Eye, Settings, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReportModal from './ReportModal';
import ManageReferences from './ManageReferences';
import { usePlantingReport } from '../../../contexts/PlantingReportContext';

const PlantingReports = () => {
    const {
        fetchReports,
        createReport,
        updateReport,
        archiveReport,
        fetchSeasons,
        fetchVarieties,
        loadingReports,
        loadingSeasons,
        loadingVarieties
    } = usePlantingReport();

    const [reports, setReports] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [varieties, setVarieties] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCropType, setFilterCropType] = useState('');
    const [filterSeason, setFilterSeason] = useState('');
    const [viewMode, setViewMode] = useState('active'); // 'active' or 'archived'
    const [showManageReferences, setShowManageReferences] = useState(false); // Toggle management page
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [reportsData, seasonsData, varietiesData] = await Promise.all([
                fetchReports(),
                fetchSeasons(),
                fetchVarieties()
            ]);
            setReports(reportsData || []);
            setSeasons(seasonsData || []);
            setVarieties(varietiesData || []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load planting reports data. Please try again.');
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    // Statistics - Only count active (non-archived) reports
    const activeReports = reports.filter(r => !r.isArchived);
    const archivedReports = reports.filter(r => r.isArchived);
    
    const stats = {
        totalReports: activeReports.length,
        totalAreaPlanted: activeReports.reduce((sum, r) => sum + r.areaPlanted, 0).toFixed(2),
        harvestedReports: activeReports.filter(r => r.dateOfHarvest).length,
        averageYield: activeReports.filter(r => r.yieldMtPerHa).length > 0
            ? (activeReports.reduce((sum, r) => sum + (r.yieldMtPerHa || 0), 0) / activeReports.filter(r => r.yieldMtPerHa).length).toFixed(2)
            : '0.00'
    };

    // Filter reports based on view mode (active or archived)
    const reportsToDisplay = viewMode === 'active' ? activeReports : archivedReports;
    
    const filteredReports = reportsToDisplay.filter(report => {
        const matchesSearch = !searchTerm || 
            report.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.farmLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.rsbsaNumber && report.rsbsaNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCropType = !filterCropType || report.typeOfCrop === filterCropType;
        const matchesSeason = !filterSeason || report.croppingSeasonId === filterSeason;

        return matchesSearch && matchesCropType && matchesSeason;
    });

    const handleCreateReport = () => {
        setSelectedReport(null);
        setIsModalOpen(true);
    };

    const handleEditReport = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleSaveReport = async (reportData) => {
        try {
            if (selectedReport) {
                // Update existing report
                const updatedReport = await updateReport(selectedReport.id, reportData);
                setReports(prev => prev.map(r => 
                    r.id === selectedReport.id ? updatedReport : r
                ));
                toast.success('Report updated successfully');
            } else {
                // Create new report
                const newReport = await createReport(reportData);
                setReports(prev => [newReport, ...prev]);
                toast.success('Report created successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving report:', error);
            toast.error(error.message || 'Failed to save report');
            throw error; // Re-throw to let modal handle it if needed
        }
    };

    const handleArchiveReport = async (reportId) => {

        try {
            const archivedReport = await archiveReport(reportId);
            setReports(prev => prev.map(r => 
                r.id === reportId ? archivedReport : r
            ));
            setIsModalOpen(false);
            toast.success('Report archived successfully');
        } catch (error) {
            console.error('Error archiving report:', error);
            toast.error(error.message || 'Failed to archive report');
        }
    };

    const getCropTypeColor = (cropType) => {
        switch (cropType) {
            case 'Rice': return 'bg-green-100 text-green-800';
            case 'Corn': return 'bg-yellow-100 text-yellow-800';
            case 'High_Value_Crops': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadge = (report) => {
        if (report.dateOfHarvest) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Harvested</span>;
        }
        const expectedDate = report.dateOfExpectedHarvest ? new Date(report.dateOfExpectedHarvest) : null;
        const today = new Date();
        if (expectedDate && expectedDate > today) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Growing</span>;
        }
        if (expectedDate && expectedDate <= today) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Ready to Harvest</span>;
        }
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Pending</span>;
    };

    // Show management page if toggled
    if (showManageReferences) {
        return <ManageReferences onBack={() => setShowManageReferences(false)} />;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="mt-15 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-green-600" size={48} />
                    <p className="text-gray-600">Loading planting reports...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="mt-15 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                        <p className="font-bold mb-2">Error</p>
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={loadData}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-15 p-6 bg-gray-50 min-h-screen">{/* Header */}
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Planting Reports</h1>
                        <p className="text-gray-600 mt-1">Track and manage farmer planting and harvest data</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* View Mode Tabs */}
                        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200">
                            <button
                                onClick={() => setViewMode('active')}
                                className={`px-4 py-2 rounded-l-lg transition-colors ${
                                    viewMode === 'active'
                                        ? 'bg-green-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Active ({activeReports.length})
                            </button>
                            <button
                                onClick={() => setViewMode('archived')}
                                className={`px-4 py-2 rounded-r-lg transition-colors flex items-center space-x-1 ${
                                    viewMode === 'archived'
                                        ? 'bg-gray-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Archive size={16} />
                                <span>Archived ({archivedReports.length})</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowManageReferences(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            title="Manage Varieties & Seasons"
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </button>
                        <button
                            onClick={handleCreateReport}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                        >
                            <Plus size={20} />
                            <span>Create Report</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Reports</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalReports}</p>
                            </div>
                            <FileText className="text-blue-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Area Planted</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.totalAreaPlanted} ha</p>
                            </div>
                            <Calendar className="text-green-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Harvested</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.harvestedReports}</p>
                            </div>
                            <Users className="text-orange-500" size={32} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Average Yield</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.averageYield} mt/ha</p>
                            </div>
                            <TrendingUp className="text-purple-500" size={32} />
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by farmer name, location, or RSBSA..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filterCropType}
                                onChange={(e) => setFilterCropType(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                            >
                                <option value="">All Crop Types</option>
                                <option value="Rice">Rice</option>
                                <option value="Corn">Corn</option>
                                <option value="High_Value_Crops">High Value Crops</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={filterSeason}
                                onChange={(e) => setFilterSeason(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                            >
                                <option value="">All Seasons</option>
                                {seasons.map(season => (
                                    <option key={season.id} value={season.id}>
                                        {season.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Farmer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Crop Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Variety
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Area (ha)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Planting Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Yield (mt/ha)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                        <FileText className="mx-auto mb-2 text-gray-400" size={48} />
                                        <p className="text-lg">No reports found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {report.farmerName}
                                                </div>
                                                {report.rsbsaNumber && (
                                                    <div className="text-xs text-gray-500">
                                                        {report.rsbsaNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {report.farmLocation}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCropTypeColor(report.typeOfCrop)}`}>
                                                {report.typeOfCrop.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {report.variety.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {report.areaPlanted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(report.dateOfPlanting).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {report.yieldMtPerHa ? (
                                                <span className="font-semibold text-green-600">
                                                    {report.yieldMtPerHa}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-3">
                                                {viewMode === 'active' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditReport(report)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                     
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedReport(report);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        <Eye size={16} />
                                                        <span>View</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                {filteredReports.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to{' '}
                                <span className="font-medium">{filteredReports.length}</span> of{' '}
                                <span className="font-medium">{filteredReports.length}</span> results
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                                    Previous
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                report={selectedReport}
                onSave={handleSaveReport}
                onArchive={handleArchiveReport}
                isArchived={selectedReport?.isArchived || false}
                seasons={seasons}
                varieties={varieties}
            />
        </div>
    );
};

export default PlantingReports;
