import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, ArrowLeft, Loader, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import VarietyModal from './VarietyModal';
import SeasonModal from './SeasonModal';
import { usePlantingReport } from '../../../contexts/PlantingReportContext';
import { seasonService, varietyService } from '../../../Services/plantingReportService';

const ManageReferences = ({ onBack }) => {
    const {
        fetchVarieties,
        createVariety,
        updateVariety,
        deleteVariety,
        toggleVarietyActive,
        fetchSeasons,
        createSeason,
        updateSeason,
        deleteSeason,
        toggleSeasonActive,
        loadingVarieties,
        loadingSeasons
    } = usePlantingReport();

    const [varieties, setVarieties] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [activeTab, setActiveTab] = useState('varieties'); // 'varieties' or 'seasons'
    const [isVarietyModalOpen, setIsVarietyModalOpen] = useState(false);
    const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
    const [editingVariety, setEditingVariety] = useState(null);
    const [editingSeason, setEditingSeason] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Delete confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'variety'|'season', id, name, affectedReports: [] }
    const [loadingAffected, setLoadingAffected] = useState(false);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [varietiesData, seasonsData] = await Promise.all([
                fetchVarieties(true), // Force refresh
                fetchSeasons(true)     // Force refresh
            ]);
            setVarieties(varietiesData || []);
            setSeasons(seasonsData || []);
        } catch (err) {
            console.error('Error loading reference data:', err);
            setError('Failed to load reference data. Please try again.');
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveVariety = async (varietyData) => {
        try {
            if (editingVariety) {
                // Update existing variety
                const updated = await updateVariety(editingVariety.id, varietyData);
                setVarieties(prev => prev.map(v => 
                    v.id === editingVariety.id ? updated : v
                ));
                toast.success('Variety updated successfully');
                setEditingVariety(null);
            } else {
                // Add new variety
                const newVariety = await createVariety(varietyData);
                setVarieties(prev => [...prev, newVariety]);
                toast.success('Variety created successfully');
            }
            setIsVarietyModalOpen(false);
        } catch (error) {
            console.error('Error saving variety:', error);
            toast.error(error.message || 'Failed to save variety');
            throw error;
        }
    };

    const handleSaveSeason = async (seasonData) => {
        try {
            if (editingSeason) {
                // Update existing season
                const updated = await updateSeason(editingSeason.id, seasonData);
                setSeasons(prev => prev.map(s => 
                    s.id === editingSeason.id ? updated : s
                ));
                toast.success('Season updated successfully');
                setEditingSeason(null);
            } else {
                // Add new season
                const newSeason = await createSeason(seasonData);
                setSeasons(prev => [...prev, newSeason]);
                toast.success('Season created successfully');
            }
            setIsSeasonModalOpen(false);
        } catch (error) {
            console.error('Error saving season:', error);
            toast.error(error.message || 'Failed to save season');
            throw error;
        }
    };

    const handleEditVariety = (variety) => {
        setEditingVariety(variety);
        setIsVarietyModalOpen(true);
    };

    const handleEditSeason = (season) => {
        setEditingSeason(season);
        setIsSeasonModalOpen(true);
    };

    const handleToggleVarietyStatus = async (id) => {
        try {
            const variety = varieties.find(v => v.id === id);
            if (!variety) return;
            
            const updated = await toggleVarietyActive(id, !variety.isActive);
            setVarieties(prev => prev.map(v => v.id === id ? updated : v));
            toast.success(`Variety ${updated.isActive ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error toggling variety status:', error);
            toast.error('Failed to update variety status');
        }
    };

    const handleToggleSeasonStatus = async (id) => {
        try {
            const season = seasons.find(s => s.id === id);
            if (!season) return;
            
            const updated = await toggleSeasonActive(id, !season.isActive);
            setSeasons(prev => prev.map(s => s.id === id ? updated : s));
            toast.success(`Season ${updated.isActive ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error toggling season status:', error);
            toast.error('Failed to update season status');
        }
    };

    const handleDeleteVariety = async (variety) => {
        setLoadingAffected(true);
        try {
            // Fetch affected reports
            const affectedReports = await varietyService.getReportsByVariety(variety.id);
            
            setDeleteTarget({
                type: 'variety',
                id: variety.id,
                name: variety.name,
                affectedReports: affectedReports || []
            });
            setShowDeleteConfirm(true);
        } catch (error) {
            console.error('Error fetching affected reports:', error);
            toast.error('Failed to check affected reports');
        } finally {
            setLoadingAffected(false);
        }
    };

    const handleDeleteSeason = async (season) => {
        setLoadingAffected(true);
        try {
            // Fetch affected reports
            const affectedReports = await seasonService.getReportsBySeason(season.id);
            
            setDeleteTarget({
                type: 'season',
                id: season.id,
                name: season.name,
                affectedReports: affectedReports || []
            });
            setShowDeleteConfirm(true);
        } catch (error) {
            console.error('Error fetching affected reports:', error);
            toast.error('Failed to check affected reports');
        } finally {
            setLoadingAffected(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            const cascade = deleteTarget.affectedReports.length > 0;
            
            if (deleteTarget.type === 'variety') {
                await deleteVariety(deleteTarget.id, cascade);
                setVarieties(prev => prev.filter(v => v.id !== deleteTarget.id));
                toast.success(
                    cascade 
                        ? `Variety and ${deleteTarget.affectedReports.length} report(s) deleted successfully`
                        : 'Variety deleted successfully'
                );
            } else {
                await deleteSeason(deleteTarget.id, cascade);
                setSeasons(prev => prev.filter(s => s.id !== deleteTarget.id));
                toast.success(
                    cascade 
                        ? `Season and ${deleteTarget.affectedReports.length} report(s) deleted successfully`
                        : 'Season deleted successfully'
                );
            }
            
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error(error.message || `Failed to delete ${deleteTarget.type}`);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
    };

    const getCropTypeColor = (cropType) => {
        switch (cropType) {
            case 'Rice': return 'bg-green-100 text-green-800';
            case 'Corn': return 'bg-yellow-100 text-yellow-800';
            case 'High_Value_Crops': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="mt-15 p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-green-600" size={48} />
                    <p className="text-gray-600">Loading reference data...</p>
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
        <div className="mt-15 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Back to Reports"
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Reports</span>
                            </button>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Manage Varieties & Seasons</h1>
                            <p className="text-gray-600 mt-1">Configure seed varieties and cropping seasons</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('varieties')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'varieties'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Seed Varieties ({varieties.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('seasons')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'seasons'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Cropping Seasons ({seasons.length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Varieties Tab */}
            {activeTab === 'varieties' && (
                <div>
                    {/* Add Button */}
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setIsVarietyModalOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add New Variety</span>
                        </button>
                    </div>

                    {/* Varieties Table */}
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Variety Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Crop Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Direct Seeded DAS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transplanted DAS
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {varieties.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                No varieties added yet. Click "Add New Variety" to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        varieties.map((variety) => (
                                            <tr
                                                key={variety.id}
                                                className={`hover:bg-gray-50 transition-colors ${
                                                    !variety.isActive ? 'opacity-60' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleVarietyStatus(variety.id)}
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                            variety.isActive
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                        title={variety.isActive ? 'Click to deactivate' : 'Click to activate'}
                                                    >
                                                        {variety.isActive ? (
                                                            <>
                                                                <Check size={12} className="mr-1" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X size={12} className="mr-1" />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{variety.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCropTypeColor(variety.cropType)}`}>
                                                        {variety.cropType.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{variety.directSeededDAS || '-'} days</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{variety.transplantedDAS || '-'} days</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 max-w-xs truncate" title={variety.description}>
                                                        {variety.description || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleEditVariety(variety)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Edit variety"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteVariety(variety)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete variety"
                                                            disabled={loadingAffected}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Seasons Tab */}
            {activeTab === 'seasons' && (
                <div>
                    {/* Add Button */}
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setIsSeasonModalOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Add New Season</span>
                        </button>
                    </div>

                    {/* Seasons Table */}
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Season Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {seasons.map((season) => (
                                    <tr key={season.id} className={!season.isActive ? 'opacity-60' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{season.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{season.description || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {new Date(season.startDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {new Date(season.endDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {season.isActive ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-2">
                                                <button
                                                    onClick={() => handleToggleSeasonStatus(season.id)}
                                                    className={`p-1 rounded transition-colors ${
                                                        season.isActive
                                                            ? 'text-green-600 hover:bg-green-50'
                                                            : 'text-gray-400 hover:bg-gray-50'
                                                    }`}
                                                    title={season.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {season.isActive ? <Check size={18} /> : <X size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleEditSeason(season)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit season"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSeason(season)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete season"
                                                    disabled={loadingAffected}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {seasons.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No seasons added yet. Click "Add New Season" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            <VarietyModal
                isOpen={isVarietyModalOpen}
                onClose={() => {
                    setIsVarietyModalOpen(false);
                    setEditingVariety(null);
                }}
                onSave={handleSaveVariety}
                variety={editingVariety}
            />

            <SeasonModal
                isOpen={isSeasonModalOpen}
                onClose={() => {
                    setIsSeasonModalOpen(false);
                    setEditingSeason(null);
                }}
                onSave={handleSaveSeason}
                season={editingSeason}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                        onClick={handleCancelDelete}
                    ></div>
                    <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden z-10">
                        <div className="p-6">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Delete {deleteTarget.type === 'variety' ? 'Variety' : 'Season'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        You are about to delete: <span className="font-semibold">{deleteTarget.name}</span>
                                    </p>
                                </div>
                            </div>

                            {deleteTarget.affectedReports.length > 0 ? (
                                <div className="mb-4">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm font-semibold text-red-800 mb-2">
                                            ⚠️ Warning: This will delete {deleteTarget.affectedReports.length} planting report{deleteTarget.affectedReports.length > 1 ? 's' : ''}
                                        </p>
                                        <p className="text-sm text-red-700">
                                            The following reports use this {deleteTarget.type} and will be permanently deleted:
                                        </p>
                                    </div>

                                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Farmer Name
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Location
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Crop Type
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                        Planting Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {deleteTarget.affectedReports.map((report) => (
                                                    <tr key={report.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-sm text-gray-900">
                                                            {report.farmerName}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">
                                                            {report.farmLocation}
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                                report.typeOfCrop === 'Rice' ? 'bg-green-100 text-green-800' :
                                                                report.typeOfCrop === 'Corn' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-purple-100 text-purple-800'
                                                            }`}>
                                                                {report.typeOfCrop}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">
                                                            {new Date(report.dateOfPlanting).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-sm text-gray-700">
                                            <strong>This action cannot be undone.</strong> All selected reports will be permanently deleted from the database.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        No reports are using this {deleteTarget.type}. It can be safely deleted.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                                >
                                    {deleteTarget.affectedReports.length > 0 
                                        ? `Delete ${deleteTarget.type === 'variety' ? 'Variety' : 'Season'} & ${deleteTarget.affectedReports.length} Report${deleteTarget.affectedReports.length > 1 ? 's' : ''}`
                                        : `Delete ${deleteTarget.type === 'variety' ? 'Variety' : 'Season'}`
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageReferences;
