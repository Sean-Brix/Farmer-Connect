import { useState, useMemo, useEffect } from 'react';
import { 
    TrendingUp, 
    Users, 
    Sprout, 
    Calendar,
    Award,
    Target,
    Activity,
    Loader
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { usePlantingReport } from '../../../contexts/PlantingReportContext';
import { toast } from 'react-hot-toast';

function PlantingReportAnalytics() {
    const { isDark } = useTheme();
    const { fetchReports, fetchSeasons, fetchVarieties } = usePlantingReport();

    const [activeTab, setActiveTab] = useState('seeding');
    const [selectedCropType, setSelectedCropType] = useState('all');
    const [selectedSeason, setSelectedSeason] = useState('all');
    const [timeRange, setTimeRange] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [varieties, setVarieties] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [reportsData, seasonsData, varietiesData] = await Promise.all([
                fetchReports(),
                fetchSeasons(),
                fetchVarieties()
            ]);
            setReports(reportsData || []);
            setSeasons(seasonsData || []);
            setVarieties(varietiesData || []);
        } catch (error) {
            console.error('Error loading planting report data:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredReports = useMemo(() => {
        let filtered = reports.filter(r => !r.isArchived);

        if (selectedCropType !== 'all') {
            filtered = filtered.filter(r => r.typeOfCrop === selectedCropType);
        }

        if (selectedSeason !== 'all') {
            filtered = filtered.filter(r => r.croppingSeasonId === selectedSeason);
        }

        if (timeRange !== 'all') {
            const now = new Date();
            const cutoff = new Date();
            if (timeRange === '6m') cutoff.setMonth(now.getMonth() - 6);
            if (timeRange === '1y') cutoff.setFullYear(now.getFullYear() - 1);
            filtered = filtered.filter(r => new Date(r.dateOfPlanting) >= cutoff);
        }

        return filtered;
    }, [reports, selectedCropType, selectedSeason, timeRange]);

    const analytics = useMemo(() => {
        const uniqueFarmers = new Set();
        const farmersWithRSBSA = new Set();
        const clientsWithoutRSBSA = new Set();

        filteredReports.forEach(r => {
            const key = r.rsbsaNumber || `no-rsbsa-${r.farmerName}-${r.farmLocation}`;
            uniqueFarmers.add(key);
            
            if (r.rsbsaNumber) {
                farmersWithRSBSA.add(r.rsbsaNumber);
            } else {
                clientsWithoutRSBSA.add(`${r.farmerName}-${r.farmLocation}`);
            }
        });

        const cropTypeDistribution = {};
        const varietyDistribution = {};
        const plantingMethodDistribution = {};
        const seasonDistribution = {};
        const seasonYield = {};
        const seasonArea = {};
        const locationDistribution = {};

        filteredReports.forEach(r => {
            cropTypeDistribution[r.typeOfCrop] = (cropTypeDistribution[r.typeOfCrop] || 0) + 1;
            
            const variety = varieties.find(v => v.id === r.varietyId);
            if (variety) {
                varietyDistribution[variety.name] = (varietyDistribution[variety.name] || 0) + 1;
            }
            
            plantingMethodDistribution[r.plantingMethod] = (plantingMethodDistribution[r.plantingMethod] || 0) + 1;
            
            const season = seasons.find(s => s.id === r.croppingSeasonId);
            const seasonName = season?.name || 'Unknown';
            
            seasonDistribution[seasonName] = (seasonDistribution[seasonName] || 0) + 1;
            seasonArea[seasonName] = (seasonArea[seasonName] || 0) + r.areaPlanted;
            
            if (r.yieldMtPerHa) {
                if (!seasonYield[seasonName]) {
                    seasonYield[seasonName] = { total: 0, count: 0 };
                }
                seasonYield[seasonName].total += r.yieldMtPerHa;
                seasonYield[seasonName].count += 1;
            }

            locationDistribution[r.farmLocation] = (locationDistribution[r.farmLocation] || 0) + 1;
        });

        let mostProductiveSeason = { name: 'N/A', avgYield: 0 };
        Object.entries(seasonYield).forEach(([name, data]) => {
            const avg = data.total / data.count;
            if (avg > mostProductiveSeason.avgYield) {
                mostProductiveSeason = { name, avgYield: avg };
            }
        });

        const totalArea = filteredReports.reduce((sum, r) => sum + r.areaPlanted, 0);
        const harvestedReports = filteredReports.filter(r => r.yieldMtPerHa);
        const averageYield = harvestedReports.length > 0
            ? harvestedReports.reduce((sum, r) => sum + r.yieldMtPerHa, 0) / harvestedReports.length
            : 0;

        const insuredReports = filteredReports.filter(r => r.cropInsurance).length;
        const insuranceRate = filteredReports.length > 0 
            ? (insuredReports / filteredReports.length) * 100 
            : 0;

        return {
            totalFarmers: uniqueFarmers.size,
            farmersWithRSBSA: farmersWithRSBSA.size,
            clientsWithoutRSBSA: clientsWithoutRSBSA.size,
            totalReports: filteredReports.length,
            totalArea,
            averageYield,
            harvestedReports: harvestedReports.length,
            pendingHarvest: filteredReports.length - harvestedReports.length,
            cropTypeDistribution,
            varietyDistribution,
            plantingMethodDistribution,
            seasonDistribution,
            seasonArea,
            locationDistribution,
            mostProductiveSeason,
            seasonYield,
            insuredReports,
            insuranceRate
        };
    }, [filteredReports, varieties, seasons]);

    const tabs = [
        { id: 'seeding', label: 'Seeding', icon: Sprout },
        { id: 'farmers', label: 'Farmers', icon: Users },
        { id: 'production', label: 'Production', icon: TrendingUp }
    ];

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${
                isDark ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-4 text-green-600" size={48} />
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading analytics...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-4 sm:py-6 px-2 md:px-6 mt-8 sm:mt-16 ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Planting Report Analytics
                    </h1>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Interactive insights into seeding, farmers, and production performance
                    </p>
                </div>

                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select
                            value={selectedCropType}
                            onChange={(e) => setSelectedCropType(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Crop Types</option>
                            <option value="Rice">Rice</option>
                            <option value="Corn">Corn</option>
                            <option value="High_Value_Crops">High Value Crops</option>
                        </select>

                        <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Seasons</option>
                            {seasons.filter(s => s.isActive).map(season => (
                                <option key={season.id} value={season.id}>{season.name}</option>
                            ))}
                        </select>

                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Time</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-center mb-8">
                    <div className={`flex items-center rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-green-600 text-white shadow-lg'
                                            : isDark
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {activeTab === 'seeding' && (
                    <SeedingAnalytics analytics={analytics} isDark={isDark} varieties={varieties} seasons={seasons} filteredReports={filteredReports} />
                )}
                {activeTab === 'farmers' && (
                    <FarmersAnalytics analytics={analytics} isDark={isDark} />
                )}
                {activeTab === 'production' && (
                    <ProductionAnalytics analytics={analytics} isDark={isDark} reports={filteredReports} />
                )}
            </div>
        </div>
    );
}

const SeedingAnalytics = ({ analytics, isDark, varieties, seasons, filteredReports }) => {
    const [selectedCrop, setSelectedCrop] = useState('all');
    const [hoveredBar, setHoveredBar] = useState(null);

    // Get variety data with crop type info
    const varietyData = useMemo(() => {
        return Object.entries(analytics.varietyDistribution)
            .map(([name, count]) => {
                const variety = varieties.find(v => v.name === name);
                return {
                    name,
                    count,
                    cropType: variety?.cropType || 'Unknown'
                };
            })
            .filter(v => selectedCrop === 'all' || v.cropType === selectedCrop)
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [analytics.varietyDistribution, varieties, selectedCrop]);

    // Combine crop type and season data
    const cropSeasonData = useMemo(() => {
        const data = {};
        filteredReports.forEach(r => {
            const season = seasons.find(s => s.id === r.croppingSeasonId);
            const seasonName = season?.name || 'Unknown';
            const cropType = r.typeOfCrop;

            if (!data[cropType]) data[cropType] = {};
            data[cropType][seasonName] = (data[cropType][seasonName] || 0) + 1;
        });
        return data;
    }, [filteredReports, seasons]);

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Sprout}
                    label="Crop Types"
                    value={Object.keys(analytics.cropTypeDistribution).length}
                    subtitle={`${analytics.totalReports} reports`}
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Award}
                    label="Varieties"
                    value={Object.keys(analytics.varietyDistribution).length}
                    subtitle="Active varieties"
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Calendar}
                    label="Seasons"
                    value={Object.keys(analytics.seasonDistribution).length}
                    subtitle={analytics.mostProductiveSeason.name}
                    isDark={isDark}
                    color="purple"
                />
                <MetricCard
                    icon={Target}
                    label="Total Area"
                    value={`${analytics.totalArea.toFixed(1)} ha`}
                    subtitle={`${(analytics.totalArea / analytics.totalReports || 0).toFixed(2)} ha/report`}
                    isDark={isDark}
                    color="yellow"
                />
            </div>

            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Crop Distribution with Season Breakdown */}
                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Crop Distribution by Season
                    </h3>
                    <CropSeasonStackedChart data={cropSeasonData} isDark={isDark} />
                </div>

                {/* Variety Distribution */}
                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Top Varieties
                        </h3>
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className={`px-3 py-1 rounded-lg text-sm border ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Crops</option>
                            <option value="Rice">Rice</option>
                            <option value="Corn">Corn</option>
                            <option value="High_Value_Crops">High Value</option>
                        </select>
                    </div>
                    <InteractiveBarChart data={varietyData} isDark={isDark} hoveredBar={hoveredBar} setHoveredBar={setHoveredBar} />
                </div>
            </div>

            {/* Season Timeline */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Seasonal Performance
                </h3>
                <SeasonPerformanceChart 
                    seasonData={analytics.seasonDistribution}
                    areaData={analytics.seasonArea}
                    yieldData={analytics.seasonYield}
                    isDark={isDark}
                />
            </div>
        </div>
    );
};

const FarmersAnalytics = ({ analytics, isDark }) => {
    const farmerEngagement = analytics.totalFarmers > 0 
        ? ((analytics.farmersWithRSBSA / analytics.totalFarmers) * 100).toFixed(1)
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    label="Total Farmers"
                    value={analytics.totalFarmers}
                    subtitle={`${farmerEngagement}% registered`}
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Award}
                    label="With RSBSA"
                    value={analytics.farmersWithRSBSA}
                    subtitle="Registered farmers"
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Users}
                    label="Without RSBSA"
                    value={analytics.clientsWithoutRSBSA}
                    subtitle="Other clients"
                    isDark={isDark}
                    color="yellow"
                />
                <MetricCard
                    icon={Activity}
                    label="Methods Used"
                    value={Object.keys(analytics.plantingMethodDistribution).length}
                    subtitle="Planting methods"
                    isDark={isDark}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Farmer Registration vs Planting Methods
                    </h3>
                    <FarmerMethodComparisonChart 
                        farmersWithRSBSA={analytics.farmersWithRSBSA}
                        clientsWithoutRSBSA={analytics.clientsWithoutRSBSA}
                        methodData={analytics.plantingMethodDistribution}
                        isDark={isDark}
                    />
                </div>

                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Engagement Metrics
                    </h3>
                    <FarmerEngagementBars
                        totalFarmers={analytics.totalFarmers}
                        totalReports={analytics.totalReports}
                        totalArea={analytics.totalArea}
                        insuranceRate={analytics.insuranceRate}
                        isDark={isDark}
                    />
                </div>
            </div>
        </div>
    );
};

const ProductionAnalytics = ({ analytics, isDark, reports }) => {
    const [selectedCropFilter, setSelectedCropFilter] = useState('all');
    const [timeRangeMonths, setTimeRangeMonths] = useState(6);
    
    const { timelineReports, startDate, endDate } = useMemo(() => {
        const reportsWithDates = reports
            .filter(r => r.dateOfPlanting && r.dateOfExpectedHarvest)
            .map(r => ({
                ...r,
                plantDate: new Date(r.dateOfPlanting),
                harvestDate: new Date(r.dateOfExpectedHarvest)
            }));

        if (reportsWithDates.length === 0) {
            return {
                timelineReports: [],
                startDate: new Date(),
                endDate: new Date()
            };
        }

        const filteredReports = reportsWithDates.filter(r => {
            const cropMatch = selectedCropFilter === 'all' || r.typeOfCrop === selectedCropFilter;
            return cropMatch;
        });

        // Find earliest planting date and latest harvest date
        const allDates = filteredReports.flatMap(r => [r.plantDate, r.harvestDate]);
        const minDate = new Date(Math.min(...allDates));
        const maxDate = new Date(Math.max(...allDates));

        // Adjust based on selected time range
        let adjustedStart = new Date(minDate);
        let adjustedEnd = new Date(minDate);
        adjustedEnd.setMonth(adjustedEnd.getMonth() + timeRangeMonths);

        // If the time range doesn't cover all reports, use actual max date
        if (adjustedEnd < maxDate && timeRangeMonths === 12) {
            adjustedEnd = maxDate;
        }

        // Filter reports that fall within the adjusted range
        const rangeFilteredReports = filteredReports.filter(r => {
            return r.plantDate >= adjustedStart && r.plantDate <= adjustedEnd;
        });

        return {
            timelineReports: rangeFilteredReports,
            startDate: adjustedStart,
            endDate: adjustedEnd
        };
    }, [reports, selectedCropFilter, timeRangeMonths]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={TrendingUp}
                    label="Avg Yield"
                    value={`${analytics.averageYield.toFixed(2)} mt/ha`}
                    subtitle={`${analytics.harvestedReports} harvested`}
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Sprout}
                    label="Harvest Area"
                    value={`${analytics.totalArea.toFixed(1)} ha`}
                    subtitle="Total planted"
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Calendar}
                    label="Completion"
                    value={`${((analytics.harvestedReports / analytics.totalReports) * 100 || 0).toFixed(1)}%`}
                    subtitle={`${analytics.pendingHarvest} pending`}
                    isDark={isDark}
                    color="yellow"
                />
                <MetricCard
                    icon={Award}
                    label="Best Yield"
                    value={`${analytics.mostProductiveSeason.avgYield.toFixed(2)} mt/ha`}
                    subtitle={analytics.mostProductiveSeason.name}
                    isDark={isDark}
                    color="purple"
                />
            </div>

            {/* Main Timeline Chart - 2 columns */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Planting to Harvest Timeline
                    </h3>
                    <div className="flex gap-2">
                        <select
                            value={timeRangeMonths}
                            onChange={(e) => setTimeRangeMonths(Number(e.target.value))}
                            className={`px-3 py-1 rounded-lg text-sm border ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value={6}>6 Months</option>
                            <option value={12}>12 Months</option>
                            <option value={18}>18 Months</option>
                            <option value={24}>24 Months</option>
                        </select>
                        <select
                            value={selectedCropFilter}
                            onChange={(e) => setSelectedCropFilter(e.target.value)}
                            className={`px-3 py-1 rounded-lg text-sm border ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Crops</option>
                            <option value="Rice">Rice</option>
                            <option value="Corn">Corn</option>
                            <option value="High_Value_Crops">High Value</option>
                        </select>
                    </div>
                </div>
                <PlantHarvestTimelineChart 
                    timelineReports={timelineReports} 
                    startDate={startDate}
                    endDate={endDate}
                    isDark={isDark} 
                />
            </div>

            {/* Secondary Charts - 1 column each */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Yield vs Area Analysis
                    </h3>
                    <YieldAreaBubbleChart reports={reports} isDark={isDark} />
                </div>

                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Production Performance by Season
                    </h3>
                    <ProductionOverviewChart
                        seasonYield={analytics.seasonYield}
                        seasonArea={analytics.seasonArea}
                        isDark={isDark}
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Components
const MetricCard = ({ icon: Icon, label, value, subtitle, isDark, color }) => {
    const colors = {
        green: 'from-green-500 to-emerald-600',
        blue: 'from-blue-500 to-cyan-600',
        yellow: 'from-yellow-500 to-orange-600',
        purple: 'from-purple-500 to-pink-600'
    };

    return (
        <div className={`p-6 rounded-lg transition-all duration-200 hover:scale-105 ${
            isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
        }`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {label}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

// Interactive Crop-Season Stacked Chart
const CropSeasonStackedChart = ({ data, isDark }) => {
    const [hoveredCrop, setHoveredCrop] = useState(null);
    
    const crops = Object.keys(data);
    const allSeasons = [...new Set(crops.flatMap(crop => Object.keys(data[crop])))];
    const maxValue = Math.max(...crops.map(crop => 
        Object.values(data[crop]).reduce((sum, val) => sum + val, 0)
    ));

    const cropColors = {
        'Rice': '#10b981',
        'Corn': '#3b82f6',
        'High_Value_Crops': '#f59e0b'
    };

    return (
        <div className="space-y-3">
            {crops.map((crop) => {
                const total = Object.values(data[crop]).reduce((sum, val) => sum + val, 0);
                const percentage = (total / maxValue) * 100;

                return (
                    <div 
                        key={crop}
                        onMouseEnter={() => setHoveredCrop(crop)}
                        onMouseLeave={() => setHoveredCrop(null)}
                        className="cursor-pointer"
                    >
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {crop.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {total} reports
                            </span>
                        </div>
                        <div className={`h-8 rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div className="h-full flex">
                                {allSeasons.map((season, idx) => {
                                    const seasonCount = data[crop][season] || 0;
                                    const seasonPercentage = (seasonCount / total) * 100;
                                    
                                    return seasonCount > 0 ? (
                                        <div
                                            key={season}
                                            className="h-full flex items-center justify-center text-xs font-medium text-white transition-all duration-300"
                                            style={{
                                                width: `${(seasonCount / maxValue) * 100}%`,
                                                backgroundColor: cropColors[crop],
                                                opacity: hoveredCrop === crop ? 1 : 0.7
                                            }}
                                            title={`${season}: ${seasonCount}`}
                                        >
                                            {seasonPercentage > 15 && season}
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                        {hoveredCrop === crop && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                                {allSeasons.map(season => {
                                    const count = data[crop][season] || 0;
                                    return count > 0 ? (
                                        <span key={season} className={`text-xs px-2 py-1 rounded ${
                                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {season}: {count}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Interactive Bar Chart for Varieties
const InteractiveBarChart = ({ data, isDark, hoveredBar, setHoveredBar }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    
    const cropColors = {
        'Rice': '#10b981',
        'Corn': '#3b82f6',
        'High_Value_Crops': '#f59e0b',
        'Unknown': '#6b7280'
    };

    return (
        <div className="space-y-2">
            {data.map((item, idx) => {
                const percentage = (item.count / maxValue) * 100;
                const isHovered = hoveredBar === idx;

                return (
                    <div 
                        key={item.name}
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="cursor-pointer"
                    >
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} ${
                                isHovered ? 'font-semibold' : ''
                            }`}>
                                {item.name}
                            </span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.count}
                            </span>
                        </div>
                        <div className={`h-6 rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className="h-full transition-all duration-300 flex items-center px-2 text-white text-xs font-medium"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: cropColors[item.cropType],
                                    transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                {isHovered && item.cropType}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Season Performance Chart (Combined Line & Bar)
const SeasonPerformanceChart = ({ seasonData, areaData, yieldData, isDark }) => {
    const seasons = Object.keys(seasonData);
    const maxCount = Math.max(...Object.values(seasonData));
    const maxArea = Math.max(...Object.values(areaData));

    return (
        <div className="space-y-4">
            {seasons.map(season => {
                const count = seasonData[season];
                const area = areaData[season];
                const yieldInfo = yieldData[season];
                const avgYield = yieldInfo ? (yieldInfo.total / yieldInfo.count).toFixed(2) : '0.00';

                return (
                    <div key={season} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {season}
                            </span>
                            <div className="flex gap-4 text-sm">
                                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {count} reports
                                </span>
                                <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {area.toFixed(1)} ha
                                </span>
                                <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                    {avgYield} mt/ha
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className={`flex-1 h-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg transition-all duration-300"
                                    style={{ width: `${(count / maxCount) * 100}%` }}
                                />
                            </div>
                            <div className={`flex-1 h-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg transition-all duration-300"
                                    style={{ width: `${(area / maxArea) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Farmer-Method Comparison Chart
const FarmerMethodComparisonChart = ({ farmersWithRSBSA, clientsWithoutRSBSA, methodData, isDark }) => {
    const total = farmersWithRSBSA + clientsWithoutRSBSA;
    const rsbsaPercentage = (farmersWithRSBSA / total) * 100;
    const methods = Object.entries(methodData);

    return (
        <div className="space-y-6">
            {/* Registration Status */}
            <div>
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Farmer Registration
                </p>
                <div className="flex h-8 rounded-lg overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${rsbsaPercentage}%` }}
                    >
                        {rsbsaPercentage > 20 && `${farmersWithRSBSA} RSBSA`}
                    </div>
                    <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-white text-sm font-medium"
                        style={{ width: `${100 - rsbsaPercentage}%` }}
                    >
                        {(100 - rsbsaPercentage) > 20 && `${clientsWithoutRSBSA} Others`}
                    </div>
                </div>
            </div>

            {/* Planting Methods */}
            <div className="space-y-2">
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Planting Methods
                </p>
                {methods.map(([method, count]) => {
                    const percentage = (count / total) * 100;
                    return (
                        <div key={method}>
                            <div className="flex justify-between mb-1">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {method.replace(/_/g, ' ')}
                                </span>
                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {count} ({percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className={`h-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Farmer Engagement Bars
const FarmerEngagementBars = ({ totalFarmers, totalReports, totalArea, insuranceRate, isDark }) => {
    const avgReportsPerFarmer = totalFarmers > 0 ? (totalReports / totalFarmers).toFixed(2) : 0;
    const avgAreaPerFarmer = totalFarmers > 0 ? (totalArea / totalFarmers).toFixed(2) : 0;

    const metrics = [
        { label: 'Avg Reports/Farmer', value: avgReportsPerFarmer, max: 5, color: 'from-blue-500 to-cyan-600' },
        { label: 'Avg Area/Farmer (ha)', value: avgAreaPerFarmer, max: 10, color: 'from-green-500 to-emerald-600' },
        { label: 'Insurance Adoption (%)', value: insuranceRate, max: 100, color: 'from-purple-500 to-pink-600' }
    ];

    return (
        <div className="space-y-4">
            {metrics.map((metric) => {
                const percentage = Math.min((metric.value / metric.max) * 100, 100);
                
                return (
                    <div key={metric.label}>
                        <div className="flex justify-between mb-2">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {metric.label}
                            </span>
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {metric.label.includes('%') ? `${metric.value.toFixed(1)}%` : metric.value}
                            </span>
                        </div>
                        <div className={`h-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className={`h-full bg-gradient-to-r ${metric.color} rounded-lg transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Yield-Area Bubble Chart
const YieldAreaBubbleChart = ({ reports, isDark }) => {
    const harvestedReports = reports.filter(r => r.yieldMtPerHa && r.harvestArea);
    const maxArea = Math.max(...harvestedReports.map(r => r.harvestArea));
    const maxYield = Math.max(...harvestedReports.map(r => r.yieldMtPerHa));

    // Group into ranges for better visualization
    const ranges = [
        { area: '0-1 ha', yield: '0-10 mt/ha', count: 0, avgYield: 0, total: 0 },
        { area: '1-2 ha', yield: '10-15 mt/ha', count: 0, avgYield: 0, total: 0 },
        { area: '2-3 ha', yield: '15-20 mt/ha', count: 0, avgYield: 0, total: 0 },
        { area: '3+ ha', yield: '20+ mt/ha', count: 0, avgYield: 0, total: 0 }
    ];

    harvestedReports.forEach(r => {
        const area = r.harvestArea;
        const yld = r.yieldMtPerHa;
        
        if (area <= 1 && yld <= 10) {
            ranges[0].count++;
            ranges[0].total += yld;
        } else if (area <= 2 && yld <= 15) {
            ranges[1].count++;
            ranges[1].total += yld;
        } else if (area <= 3 && yld <= 20) {
            ranges[2].count++;
            ranges[2].total += yld;
        } else {
            ranges[3].count++;
            ranges[3].total += yld;
        }
    });

    ranges.forEach(r => {
        r.avgYield = r.count > 0 ? r.total / r.count : 0;
    });

    const maxCount = Math.max(...ranges.map(r => r.count));

    return (
        <div className="space-y-3">
            {ranges.filter(r => r.count > 0).map((range, idx) => {
                const size = (range.count / maxCount) * 100;
                
                return (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {range.area}
                                </span>
                                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {range.count} reports
                                </span>
                            </div>
                            <div className={`h-12 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}>
                                <div
                                    className="absolute left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                    style={{ width: `${size}%` }}
                                >
                                    {size > 30 && `${range.avgYield.toFixed(1)} mt/ha avg`}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Plant-Harvest Timeline Chart (Dynamic Date Range)
const PlantHarvestTimelineChart = ({ timelineReports, startDate, endDate, isDark }) => {
    const [hoveredReport, setHoveredReport] = useState(null);
    
    const cropColors = {
        'Rice': '#10b981',
        'Corn': '#3b82f6',
        'High_Value_Crops': '#f59e0b'
    };

    // Generate month labels based on actual date range
    const monthLabels = useMemo(() => {
        if (!startDate || !endDate) return [];
        
        const labels = [];
        const current = new Date(startDate);
        const end = new Date(endDate);
        
        while (current <= end) {
            labels.push({
                label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                date: new Date(current)
            });
            current.setMonth(current.getMonth() + 1);
        }
        
        return labels;
    }, [startDate, endDate]);

    // Calculate position for each report based on actual date range
    const getDatePosition = (date) => {
        const totalDuration = endDate - startDate;
        const dateOffset = date - startDate;
        return (dateOffset / totalDuration) * 100;
    };

    const reportLines = useMemo(() => {
        return timelineReports.map((report, idx) => {
            const startPos = getDatePosition(report.plantDate);
            const endPos = getDatePosition(report.harvestDate);
            
            const startPercent = Math.max(0, startPos);
            const endPercent = Math.min(100, endPos);
            const width = endPercent - startPercent;
            
            return {
                id: idx,
                report,
                startPercent,
                width: Math.max(0, width),
                color: cropColors[report.typeOfCrop] || '#6b7280'
            };
        }).sort((a, b) => a.startPercent - b.startPercent);
    }, [timelineReports, startDate, endDate]);

    return (
        <div className="space-y-4">
            {/* Timeline Header */}
            <div className="grid px-2 border-b-2 pb-2" style={{ 
                gridTemplateColumns: `repeat(${monthLabels.length}, 1fr)`,
                borderColor: isDark ? '#4b5563' : '#d1d5db' 
            }}>
                {monthLabels.map((month, idx) => (
                    <div key={idx} className="text-center border-r-2 last:border-r-0" style={{
                        borderColor: isDark ? '#374151' : '#e5e7eb'
                    }}>
                        <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {month.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Timeline Lines */}
            <div className="relative" style={{ minHeight: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                {reportLines.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No reports found for selected filters
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {reportLines.map((line) => (
                            <div
                                key={line.id}
                                className="relative h-6 cursor-pointer"
                                onMouseEnter={() => setHoveredReport(line.id)}
                                onMouseLeave={() => setHoveredReport(null)}
                            >
                                {/* Background grid lines */}
                                <div className="absolute inset-0 grid" style={{
                                    gridTemplateColumns: `repeat(${monthLabels.length}, 1fr)`
                                }}>
                                    {monthLabels.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="border-r-2 last:border-r-0"
                                            style={{
                                                borderColor: isDark ? '#374151' : '#e5e7eb'
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Timeline Bar */}
                                <div
                                    className="absolute h-5 rounded-full transition-all duration-200 flex items-center px-2"
                                    style={{
                                        left: `${line.startPercent}%`,
                                        width: `${line.width}%`,
                                        backgroundColor: line.color,
                                        opacity: hoveredReport === line.id ? 1 : 0.8,
                                        transform: hoveredReport === line.id ? 'scale(1.05)' : 'scale(1)',
                                        zIndex: hoveredReport === line.id ? 10 : 1
                                    }}
                                >
                                    {hoveredReport === line.id && line.width > 15 && (
                                        <span className="text-white text-xs font-medium truncate">
                                            {line.report.farmerName}
                                        </span>
                                    )}
                                </div>

                                {/* Tooltip on hover */}
                                {hoveredReport === line.id && (
                                    <div
                                        className={`absolute top-8 z-20 px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap ${
                                            isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
                                        }`}
                                        style={{
                                            left: `${Math.min(line.startPercent + line.width / 2, 80)}%`,
                                            transform: 'translateX(-50%)'
                                        }}
                                    >
                                        <div className="font-semibold mb-1">{line.report.farmerName}</div>
                                        <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                            {line.report.typeOfCrop.replace(/_/g, ' ')}
                                        </div>
                                        <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                            Planted: {line.report.plantDate.toLocaleDateString()}
                                        </div>
                                        <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                            Harvest: {line.report.harvestDate.toLocaleDateString()}
                                        </div>
                                        <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                            Area: {line.report.areaPlanted} ha
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 pt-2 border-t" style={{ 
                borderColor: isDark ? '#374151' : '#e5e7eb' 
            }}>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rice</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Corn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }} />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>High Value</span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className={`grid grid-cols-3 gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {reportLines.length}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Reports
                    </div>
                </div>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {reportLines.length > 0 
                            ? Math.round(reportLines.reduce((sum, l) => {
                                const duration = (l.report.harvestDate - l.report.plantDate) / (1000 * 60 * 60 * 24 * 30);
                                return sum + duration;
                            }, 0) / reportLines.length)
                            : 0}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Avg Duration (months)
                    </div>
                </div>
                <div className="text-center">
                    <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Starting From
                    </div>
                </div>
            </div>
        </div>
    );
};

// Production Overview Chart
const ProductionOverviewChart = ({ seasonYield, seasonArea, isDark }) => {
    const seasons = Object.keys(seasonYield);
    const maxYield = Math.max(...seasons.map(s => seasonYield[s].total / seasonYield[s].count));
    const maxArea = Math.max(...Object.values(seasonArea));

    return (
        <div className="space-y-4">
            {seasons.map(season => {
                const avgYield = seasonYield[season].total / seasonYield[season].count;
                const area = seasonArea[season];
                const yieldPercentage = (avgYield / maxYield) * 100;
                const areaPercentage = (area / maxArea) * 100;

                return (
                    <div key={season}>
                        <div className="flex justify-between mb-2">
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {season}
                            </span>
                            <div className="flex gap-3 text-sm">
                                <span className={`${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                    Yield: {avgYield.toFixed(2)} mt/ha
                                </span>
                                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    Area: {area.toFixed(1)} ha
                                </span>
                            </div>
                        </div>
                        <div className="relative h-10 rounded-lg overflow-hidden">
                            <div className={`absolute inset-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-1/2 bg-gradient-to-r from-green-500 to-emerald-600"
                                    style={{ width: `${yieldPercentage}%` }}
                                />
                                <div
                                    className="h-1/2 bg-gradient-to-r from-blue-500 to-cyan-600"
                                    style={{ width: `${areaPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PlantingReportAnalytics;
