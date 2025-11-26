import { useState, useMemo } from 'react';
import { 
    BarChart3, 
    PieChart, 
    TrendingUp, 
    Users, 
    Sprout, 
    FileText,
    Calendar,
    MapPin,
    Award,
    Target,
    Activity
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const PlantingAnalytics = ({ reports = [], seasons = [], varieties = [] }) => {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('crop'); // 'crop', 'report', 'farmer'
    const [selectedCropType, setSelectedCropType] = useState('all');
    const [selectedSeason, setSelectedSeason] = useState('all');
    const [timeRange, setTimeRange] = useState('all'); // 'all', '6m', '1y'

    // Filter reports based on selections
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

    // Calculate comprehensive analytics
    const analytics = useMemo(() => {
        // Farmer Analytics
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

        // Crop Analytics
        const cropTypeDistribution = {};
        const varietyDistribution = {};
        const irrigationDistribution = {};
        const seedClassificationDistribution = {};
        const plantingMethodDistribution = {};

        filteredReports.forEach(r => {
            // Crop types
            cropTypeDistribution[r.typeOfCrop] = (cropTypeDistribution[r.typeOfCrop] || 0) + 1;
            
            // Varieties
            const variety = varieties.find(v => v.id === r.varietyId);
            if (variety) {
                varietyDistribution[variety.name] = (varietyDistribution[variety.name] || 0) + 1;
            }
            
            // Irrigation (for rice only)
            if (r.riceIrrigation) {
                irrigationDistribution[r.riceIrrigation] = (irrigationDistribution[r.riceIrrigation] || 0) + 1;
            }
            
            // Seed classification
            seedClassificationDistribution[r.seedClassification] = (seedClassificationDistribution[r.seedClassification] || 0) + 1;
            
            // Planting method
            plantingMethodDistribution[r.plantingMethod] = (plantingMethodDistribution[r.plantingMethod] || 0) + 1;
        });

        // Season Analytics
        const seasonDistribution = {};
        const seasonYield = {};
        const seasonArea = {};

        filteredReports.forEach(r => {
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
        });

        // Most productive season
        let mostProductiveSeason = { name: 'N/A', avgYield: 0 };
        Object.entries(seasonYield).forEach(([name, data]) => {
            const avg = data.total / data.count;
            if (avg > mostProductiveSeason.avgYield) {
                mostProductiveSeason = { name, avgYield: avg };
            }
        });

        // Area and Yield
        const totalArea = filteredReports.reduce((sum, r) => sum + r.areaPlanted, 0);
        const harvestedReports = filteredReports.filter(r => r.yieldMtPerHa);
        const averageYield = harvestedReports.length > 0
            ? harvestedReports.reduce((sum, r) => sum + r.yieldMtPerHa, 0) / harvestedReports.length
            : 0;

        // Insurance stats
        const insuredReports = filteredReports.filter(r => r.cropInsurance).length;
        const insuranceRate = filteredReports.length > 0 
            ? (insuredReports / filteredReports.length) * 100 
            : 0;

        // Location distribution
        const locationDistribution = {};
        filteredReports.forEach(r => {
            locationDistribution[r.farmLocation] = (locationDistribution[r.farmLocation] || 0) + 1;
        });

        return {
            // Farmer metrics
            totalFarmers: uniqueFarmers.size,
            farmersWithRSBSA: farmersWithRSBSA.size,
            clientsWithoutRSBSA: clientsWithoutRSBSA.size,
            
            // Crop metrics
            totalReports: filteredReports.length,
            totalArea,
            averageYield,
            harvestedReports: harvestedReports.length,
            pendingHarvest: filteredReports.length - harvestedReports.length,
            
            // Distributions
            cropTypeDistribution,
            varietyDistribution,
            irrigationDistribution,
            seedClassificationDistribution,
            plantingMethodDistribution,
            seasonDistribution,
            seasonArea,
            locationDistribution,
            
            // Season analytics
            mostProductiveSeason,
            seasonYield,
            
            // Insurance
            insuredReports,
            insuranceRate
        };
    }, [filteredReports, varieties, seasons]);

    const tabs = [
        { id: 'crop', label: 'Crop Analytics', icon: Sprout },
        { id: 'report', label: 'Report Analytics', icon: FileText },
        { id: 'farmer', label: 'Farmer Analytics', icon: Users }
    ];

    return (
        <div className={`min-h-screen py-4 sm:py-6 px-2 md:px-6 mt-8 sm:mt-16 ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        Planting Report Analytics
                    </h1>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Comprehensive insights into planting activities, crop performance, and farmer engagement
                    </p>
                </div>

                {/* Filters */}
                <div className={`mb-6 p-4 rounded-lg ${
                    isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
                }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select
                            value={selectedCropType}
                            onChange={(e) => setSelectedCropType(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
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
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Seasons</option>
                            {seasons.filter(s => s.isActive).map(season => (
                                <option key={season.id} value={season.id}>
                                    {season.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${
                                isDark 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Time</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                        </select>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center justify-center mb-8">
                    <div className={`flex items-center rounded-lg p-1 ${
                        isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
                    }`}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? isDark
                                                ? 'bg-green-600 text-white shadow-lg'
                                                : 'bg-green-600 text-white shadow-lg'
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

                {/* Tab Content */}
                {activeTab === 'crop' && (
                    <CropAnalytics analytics={analytics} isDark={isDark} />
                )}
                {activeTab === 'report' && (
                    <ReportAnalytics analytics={analytics} isDark={isDark} />
                )}
                {activeTab === 'farmer' && (
                    <FarmerAnalytics analytics={analytics} isDark={isDark} />
                )}
            </div>
        </div>
    );
};

// Crop-Centered Analytics Tab
const CropAnalytics = ({ analytics, isDark }) => {
    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Sprout}
                    label="Total Area Planted"
                    value={`${analytics.totalArea.toFixed(2)} ha`}
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Average Yield"
                    value={`${analytics.averageYield.toFixed(2)} mt/ha`}
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Award}
                    label="Best Season"
                    value={analytics.mostProductiveSeason.name}
                    subtitle={`${analytics.mostProductiveSeason.avgYield.toFixed(2)} mt/ha`}
                    isDark={isDark}
                    color="yellow"
                />
                <MetricCard
                    icon={Target}
                    label="Harvested"
                    value={`${analytics.harvestedReports}/${analytics.totalReports}`}
                    subtitle={`${((analytics.harvestedReports / analytics.totalReports) * 100 || 0).toFixed(1)}%`}
                    isDark={isDark}
                    color="purple"
                />
            </div>

            {/* Crop Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Crop Type Distribution" isDark={isDark}>
                    <DistributionChart 
                        data={analytics.cropTypeDistribution}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6', '#f59e0b']}
                    />
                </ChartCard>

                <ChartCard title="Variety Distribution (Top 5)" isDark={isDark}>
                    <DistributionChart 
                        data={Object.fromEntries(
                            Object.entries(analytics.varietyDistribution)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                        )}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']}
                    />
                </ChartCard>

                <ChartCard title="Seed Classification" isDark={isDark}>
                    <DistributionChart 
                        data={analytics.seedClassificationDistribution}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']}
                    />
                </ChartCard>

                <ChartCard title="Planting Methods" isDark={isDark}>
                    <DistributionChart 
                        data={analytics.plantingMethodDistribution}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6']}
                    />
                </ChartCard>
            </div>

            {/* Rice Irrigation (if applicable) */}
            {Object.keys(analytics.irrigationDistribution).length > 0 && (
                <ChartCard title="Rice Irrigation Types" isDark={isDark}>
                    <DistributionChart 
                        data={analytics.irrigationDistribution}
                        isDark={isDark}
                        colors={['#3b82f6', '#10b981']}
                    />
                </ChartCard>
            )}
        </div>
    );
};

// Report-Centered Analytics Tab
const ReportAnalytics = ({ analytics, isDark }) => {
    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={FileText}
                    label="Total Reports"
                    value={analytics.totalReports}
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Activity}
                    label="Harvested Reports"
                    value={analytics.harvestedReports}
                    subtitle={`${((analytics.harvestedReports / analytics.totalReports) * 100 || 0).toFixed(1)}% complete`}
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Calendar}
                    label="Pending Harvest"
                    value={analytics.pendingHarvest}
                    isDark={isDark}
                    color="yellow"
                />
                <MetricCard
                    icon={Award}
                    label="Insured Reports"
                    value={analytics.insuredReports}
                    subtitle={`${analytics.insuranceRate.toFixed(1)}% rate`}
                    isDark={isDark}
                    color="purple"
                />
            </div>

            {/* Season Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Reports by Season" isDark={isDark}>
                    <DistributionChart 
                        data={analytics.seasonDistribution}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']}
                    />
                </ChartCard>

                <ChartCard title="Area Planted by Season" isDark={isDark}>
                    <BarChart 
                        data={analytics.seasonArea}
                        isDark={isDark}
                        unit="ha"
                    />
                </ChartCard>

                <ChartCard title="Season Yield Performance" isDark={isDark}>
                    <YieldBarChart 
                        data={analytics.seasonYield}
                        isDark={isDark}
                    />
                </ChartCard>

                <ChartCard title="Location Distribution (Top 5)" isDark={isDark}>
                    <DistributionChart 
                        data={Object.fromEntries(
                            Object.entries(analytics.locationDistribution)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                        )}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']}
                    />
                </ChartCard>
            </div>
        </div>
    );
};

// Farmer-Centered Analytics Tab
const FarmerAnalytics = ({ analytics, isDark }) => {
    const farmerEngagement = analytics.totalFarmers > 0 
        ? ((analytics.farmersWithRSBSA / analytics.totalFarmers) * 100).toFixed(1)
        : 0;

    const avgReportsPerFarmer = analytics.totalFarmers > 0
        ? (analytics.totalReports / analytics.totalFarmers).toFixed(2)
        : 0;

    const avgAreaPerFarmer = analytics.totalFarmers > 0
        ? (analytics.totalArea / analytics.totalFarmers).toFixed(2)
        : 0;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Users}
                    label="Total Farmers"
                    value={analytics.totalFarmers}
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Award}
                    label="Registered Farmers"
                    value={analytics.farmersWithRSBSA}
                    subtitle="With RSBSA"
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Users}
                    label="Other Clients"
                    value={analytics.clientsWithoutRSBSA}
                    subtitle="Without RSBSA"
                    isDark={isDark}
                    color="yellow"
                />
                <MetricCard
                    icon={Activity}
                    label="RSBSA Coverage"
                    value={`${farmerEngagement}%`}
                    isDark={isDark}
                    color="purple"
                />
            </div>

            {/* Farmer Engagement Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Farmer Registration Status" isDark={isDark}>
                    <DistributionChart 
                        data={{
                            'With RSBSA': analytics.farmersWithRSBSA,
                            'Without RSBSA': analytics.clientsWithoutRSBSA
                        }}
                        isDark={isDark}
                        colors={['#10b981', '#f59e0b']}
                    />
                </ChartCard>

                <div className={`p-6 rounded-lg ${
                    isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
                }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        Farmer Activity
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Avg Reports/Farmer
                                </span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {avgReportsPerFarmer}
                                </span>
                            </div>
                            <ProgressBar 
                                value={Math.min((avgReportsPerFarmer / 5) * 100, 100)} 
                                color="blue" 
                                isDark={isDark} 
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Avg Area/Farmer
                                </span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {avgAreaPerFarmer} ha
                                </span>
                            </div>
                            <ProgressBar 
                                value={Math.min((avgAreaPerFarmer / 10) * 100, 100)} 
                                color="green" 
                                isDark={isDark} 
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Insurance Adoption
                                </span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {analytics.insuranceRate.toFixed(1)}%
                                </span>
                            </div>
                            <ProgressBar 
                                value={analytics.insuranceRate} 
                                color="purple" 
                                isDark={isDark} 
                            />
                        </div>
                    </div>
                </div>

                <ChartCard title="Top Locations (Farmers)" isDark={isDark}>
                    <DistributionChart 
                        data={Object.fromEntries(
                            Object.entries(analytics.locationDistribution)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                        )}
                        isDark={isDark}
                        colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']}
                    />
                </ChartCard>
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
        <div className={`p-6 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
        }`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        {label}
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className={`text-xs mt-1 ${
                            isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
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

const ChartCard = ({ title, children, isDark }) => {
    return (
        <div className={`p-6 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
        }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
            }`}>
                {title}
            </h3>
            {children}
        </div>
    );
};

const DistributionChart = ({ data, isDark, colors }) => {
    const entries = Object.entries(data);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    if (total === 0) {
        return (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No data available
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map(([key, value], index) => {
                const percentage = ((value / total) * 100).toFixed(1);
                const color = colors[index % colors.length];
                
                return (
                    <div key={key}>
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {key.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {value} ({percentage}%)
                            </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div
                                className="h-full transition-all duration-500"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: color
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const BarChart = ({ data, isDark, unit = '' }) => {
    const entries = Object.entries(data);
    const maxValue = Math.max(...entries.map(([, value]) => value));

    if (maxValue === 0) {
        return (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No data available
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map(([key, value]) => {
                const percentage = (value / maxValue) * 100;
                
                return (
                    <div key={key}>
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {key}
                            </span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {value.toFixed(2)} {unit}
                            </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const YieldBarChart = ({ data, isDark }) => {
    const entries = Object.entries(data).map(([name, { total, count }]) => ({
        name,
        avgYield: total / count
    }));
    
    const maxYield = Math.max(...entries.map(e => e.avgYield));

    if (maxYield === 0) {
        return (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                No yield data available
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map(({ name, avgYield }) => {
                const percentage = (avgYield / maxYield) * 100;
                
                return (
                    <div key={name}>
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {name}
                            </span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {avgYield.toFixed(2)} mt/ha
                            </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ProgressBar = ({ value, color, isDark }) => {
    const colors = {
        green: 'from-green-500 to-emerald-600',
        blue: 'from-blue-500 to-cyan-600',
        purple: 'from-purple-500 to-pink-600'
    };

    return (
        <div className={`h-2 rounded-full overflow-hidden ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
            <div
                className={`h-full bg-gradient-to-r ${colors[color]} transition-all duration-500`}
                style={{ width: `${Math.min(value, 100)}%` }}
            />
        </div>
    );
};

export default PlantingAnalytics;
