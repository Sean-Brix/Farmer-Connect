import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    TrendingUp, 
    Users, 
    Sprout, 
    Calendar,
    Award,
    Target,
    Activity,
    Loader,
    Package,
    Download,
    FileSpreadsheet,
    FileText
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { usePlantingReport } from '../../../contexts/PlantingReportContext';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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

    const loadData = useCallback(async () => {
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
    }, [fetchReports, fetchSeasons, fetchVarieties]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
        const stateDistribution = {};
        const stateByArea = {};
        const stateYields = {};

        filteredReports.forEach(r => {
            // State tracking
            const state = r.state || 'Unknown';
            stateDistribution[state] = (stateDistribution[state] || 0) + 1;
            stateByArea[state] = (stateByArea[state] || 0) + (r.areaPlanted || 0);
            
            if (r.yieldMtPerHa && state === 'Harvested') {
                if (!stateYields[state]) stateYields[state] = { total: 0, count: 0 };
                stateYields[state].total += r.yieldMtPerHa;
                stateYields[state].count += 1;
            }
            
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
            insuranceRate,
            stateDistribution,
            stateByArea,
            stateYields,
            distributedReports: stateDistribution['Distributed'] || 0,
            plantingReports: stateDistribution['Planting'] || 0,
            plantedReports: stateDistribution['Planted'] || 0,
            harvestedReportsCount: stateDistribution['Harvested'] || 0
        };
    }, [filteredReports, varieties, seasons]);

    const tabs = [
        { id: 'seeding', label: 'Seeding', icon: Sprout },
        { id: 'farmers', label: 'Farmers', icon: Users },
        { id: 'production', label: 'Production', icon: TrendingUp }
    ];

    const exportToExcel = useCallback(() => {
        try {
            const wb = XLSX.utils.book_new();
            
            // Helper function to auto-fit columns
            const autoFitColumns = (ws, data) => {
                const cols = [];
                const keys = Object.keys(data[0] || {});
                
                keys.forEach((key, idx) => {
                    const headerLength = key.length;
                    const maxDataLength = Math.max(
                        ...data.map(row => {
                            const value = String(row[key] || '');
                            return value.length;
                        }),
                        0
                    );
                    cols[idx] = { wch: Math.max(headerLength, maxDataLength) + 2 };
                });
                
                ws['!cols'] = cols;
            };
            
            // Helper function to set alignment and format numbers as text
            const setLeftAlign = (ws, rowCount, colCount) => {
                for (let R = 0; R < rowCount; R++) {
                    for (let C = 0; C < colCount; C++) {
                        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                        if (!ws[cellRef]) continue;
                        
                        // Convert numbers to text to force left alignment
                        if (typeof ws[cellRef].v === 'number') {
                            ws[cellRef].t = 's'; // Set type to string
                            ws[cellRef].v = String(ws[cellRef].v);
                        }
                        
                        if (!ws[cellRef].s) ws[cellRef].s = {};
                        ws[cellRef].s.alignment = { horizontal: 'left', vertical: 'center' };
                    }
                }
            };
            
            // Overview Sheet - Create first
            const overviewData = [
                ['PLANTING REPORTS ANALYTICS - OVERVIEW'],
                ['Generated:', new Date().toLocaleString()],
                [],
                ['SUMMARY STATISTICS'],
                ['Total Reports', filteredReports.length],
                ['Total Farmers', analytics.totalFarmers],
                ['Farmers with RSBSA', analytics.farmersWithRSBSA],
                ['Total Area (ha)', analytics.totalArea.toFixed(2)],
                ['Average Yield (mt/ha)', analytics.averageYield.toFixed(2)],
                [],
                ['STATE DISTRIBUTION'],
                ['Distributed', analytics.distributedReports, `${analytics.stateByArea['Distributed']?.toFixed(2) || 0} ha`],
                ['Planting', analytics.plantingReports, `${analytics.stateByArea['Planting']?.toFixed(2) || 0} ha`],
                ['Planted', analytics.plantedReports, `${analytics.stateByArea['Planted']?.toFixed(2) || 0} ha`],
                ['Harvested', analytics.harvestedReportsCount, `${analytics.stateByArea['Harvested']?.toFixed(2) || 0} ha`],
                [],
                ['CROP TYPE DISTRIBUTION'],
                ...Object.entries(analytics.cropTypeDistribution).map(([crop, count]) => [
                    crop.replace(/_/g, ' '), count
                ]),
                [],
                ['TOP VARIETIES'],
                ...Object.entries(analytics.varietyDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([variety, count]) => [variety, count]),
                [],
                ['SEASONAL PERFORMANCE'],
                ...Object.entries(analytics.seasonYield).map(([season, data]) => [
                    season,
                    `${data.count} reports`,
                    `${(data.total / data.count).toFixed(2)} mt/ha avg`,
                    `${analytics.seasonArea[season]?.toFixed(2) || 0} ha`
                ])
            ];
            
            const overviewWS = XLSX.utils.aoa_to_sheet(overviewData);
            overviewWS['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
            setLeftAlign(overviewWS, overviewData.length, 3);
            XLSX.utils.book_append_sheet(wb, overviewWS, 'Overview');
            
            // Separate reports by state
            const plantingReports = filteredReports.filter(r => r.state === 'Planting');
            const plantedReports = filteredReports.filter(r => r.state === 'Planted');
            const harvestedReports = filteredReports.filter(r => r.state === 'Harvested');
            
            // Planting Sheet
            if (plantingReports.length > 0) {
                const plantingData = plantingReports.map(r => ({
                    'Farmer Name': r.farmerName || '',
                    'Crop Type': (r.typeOfCrop || '').replace(/_/g, ' '),
                    'Variety': varieties.find(v => v.id === r.varietyId)?.name || '',
                    'RSBSA': r.rsbsaNumber || 'N/A',
                    'Farm Location': r.farmLocation || ''
                }));
                
                const plantingWS = XLSX.utils.json_to_sheet(plantingData);
                autoFitColumns(plantingWS, plantingData);
                setLeftAlign(plantingWS, plantingData.length + 1, 5);
                XLSX.utils.book_append_sheet(wb, plantingWS, 'Planting');
            } else {
                const noDataWS = XLSX.utils.aoa_to_sheet([['No Planting Reports']]);
                noDataWS['!cols'] = [{ wch: 30 }];
                XLSX.utils.book_append_sheet(wb, noDataWS, 'Planting');
            }
            
            // Planted Sheet
            if (plantedReports.length > 0) {
                const plantedData = plantedReports.map(r => ({
                    'Farmer Name': r.farmerName || '',
                    'Crop Type': (r.typeOfCrop || '').replace(/_/g, ' '),
                    'Variety': varieties.find(v => v.id === r.varietyId)?.name || '',
                    'RSBSA': r.rsbsaNumber || 'N/A',
                    'Farm Location': r.farmLocation || '',
                    'Cropping Season': seasons.find(s => s.id === r.croppingSeasonId)?.name || '',
                    'Area Planted (ha)': r.areaPlanted || 0,
                    'Seed Classification': r.seedClassification || '',
                    'Crop Insurance': r.cropInsurance ? 'Yes' : 'No',
                    'Date of Planting': r.dateOfPlanting ? new Date(r.dateOfPlanting).toLocaleDateString() : '',
                    'Planting Method': r.plantingMethod || '',
                    'Irrigation': r.irrigation || '',
                    'Expected Harvest Date': r.estimatedHarvestDate ? new Date(r.estimatedHarvestDate).toLocaleDateString() : ''
                }));
                
                const plantedWS = XLSX.utils.json_to_sheet(plantedData);
                autoFitColumns(plantedWS, plantedData);
                setLeftAlign(plantedWS, plantedData.length + 1, 13);
                XLSX.utils.book_append_sheet(wb, plantedWS, 'Planted');
            } else {
                const noDataWS = XLSX.utils.aoa_to_sheet([['No Planted Reports']]);
                noDataWS['!cols'] = [{ wch: 30 }];
                XLSX.utils.book_append_sheet(wb, noDataWS, 'Planted');
            }
            
            // Harvested Sheet
            if (harvestedReports.length > 0) {
                const harvestedData = harvestedReports.map(r => ({
                    'Farmer Name': r.farmerName || '',
                    'Crop Type': (r.typeOfCrop || '').replace(/_/g, ' '),
                    'Variety': varieties.find(v => v.id === r.varietyId)?.name || '',
                    'RSBSA': r.rsbsaNumber || 'N/A',
                    'Farm Location': r.farmLocation || '',
                    'Cropping Season': seasons.find(s => s.id === r.croppingSeasonId)?.name || '',
                    'Area Planted (ha)': r.areaPlanted || 0,
                    'Seed Classification': r.seedClassification || '',
                    'Crop Insurance': r.cropInsurance ? 'Yes' : 'No',
                    'Date of Planting': r.dateOfPlanting ? new Date(r.dateOfPlanting).toLocaleDateString() : '',
                    'Planting Method': r.plantingMethod || '',
                    'Irrigation': r.irrigation || '',
                    'Expected Harvest Date': r.estimatedHarvestDate ? new Date(r.estimatedHarvestDate).toLocaleDateString() : '',
                    'Harvest Area': r.harvestArea || 0,
                    'Number of Bags': r.numberOfBags || 0,
                    'Weight per Bag (kg)': r.weightPerBag || 0,
                    'Yield (Mt/Ha)': r.yieldMtPerHa || 0
                }));
                
                const harvestedWS = XLSX.utils.json_to_sheet(harvestedData);
                autoFitColumns(harvestedWS, harvestedData);
                setLeftAlign(harvestedWS, harvestedData.length + 1, 17);
                XLSX.utils.book_append_sheet(wb, harvestedWS, 'Harvested');
            } else {
                const noDataWS = XLSX.utils.aoa_to_sheet([['No Harvested Reports']]);
                noDataWS['!cols'] = [{ wch: 30 }];
                XLSX.utils.book_append_sheet(wb, noDataWS, 'Harvested');
            }
            
            // Generate filename with timestamp
            const filename = `Planting_Reports_Analytics_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, filename);
            
            toast.success('Excel report exported successfully!');
        } catch (error) {
            console.error('Excel export error:', error);
            toast.error('Failed to export Excel report');
        }
    }, [filteredReports, analytics, varieties, seasons]);

    const exportToPDF = useCallback(() => {
        try {
            const doc = new jsPDF('landscape', 'mm', 'a4'); // Landscape for better table display
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPos = 15;
            
            // Title
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('Planting Reports Analytics - All Reports', pageWidth / 2, yPos, { align: 'center' });
            yPos += 8;
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            
            // Prepare all reports data for table
            const tableData = filteredReports.map(r => [
                r.farmerName || '',
                (r.typeOfCrop || '').replace(/_/g, ' '),
                varieties.find(v => v.id === r.varietyId)?.name || '',
                r.rsbsaNumber || 'N/A',
                r.farmLocation || '',
                seasons.find(s => s.id === r.croppingSeasonId)?.name || '',
                r.areaPlanted?.toFixed(2) || '0',
                r.dateOfPlanting ? new Date(r.dateOfPlanting).toLocaleDateString() : '',
                r.plantingMethod || '',
                r.state || ''
            ]);
            
            const headers = [
                'Farmer Name',
                'Crop Type',
                'Variety',
                'RSBSA',
                'Farm Location',
                'Season',
                'Area (ha)',
                'Date Planted',
                'Method',
                'State'
            ];
            
            // Calculate column widths to use full page width
            const margin = 10;
            const availableWidth = pageWidth - (2 * margin);
            const colWidths = [
                availableWidth * 0.14,  // Farmer Name - 14%
                availableWidth * 0.11,  // Crop Type - 11%
                availableWidth * 0.11,  // Variety - 11%
                availableWidth * 0.10,  // RSBSA - 10%
                availableWidth * 0.13,  // Farm Location - 13%
                availableWidth * 0.10,  // Season - 10%
                availableWidth * 0.08,  // Area (ha) - 8%
                availableWidth * 0.10,  // Date Planted - 10%
                availableWidth * 0.09,  // Method - 9%
                availableWidth * 0.04   // State - 4%
            ];
            const startX = margin;
            let currentY = yPos;
            
            // Helper function to draw table
            const drawTable = (data, startY) => {
                let y = startY;
                
                // Draw headers
                doc.setFillColor(59, 130, 246); // Blue background
                doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 8, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(8);
                doc.setFont(undefined, 'bold');
                
                let x = startX + 2;
                headers.forEach((header, idx) => {
                    doc.text(header, x, y + 5.5);
                    x += colWidths[idx];
                });
                
                y += 8;
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');
                
                // Draw data rows
                data.forEach((row, rowIdx) => {
                    // Check if we need a new page
                    if (y > pageHeight - 30) {
                        doc.addPage();
                        y = 15;
                        
                        // Redraw headers on new page
                        doc.setFillColor(59, 130, 246);
                        doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 8, 'F');
                        doc.setTextColor(255, 255, 255);
                        doc.setFont(undefined, 'bold');
                        
                        let headerX = startX + 2;
                        headers.forEach((header, idx) => {
                            doc.text(header, headerX, y + 5.5);
                            headerX += colWidths[idx];
                        });
                        
                        y += 8;
                        doc.setTextColor(0, 0, 0);
                        doc.setFont(undefined, 'normal');
                    }
                    
                    // Alternating row colors
                    if (rowIdx % 2 === 0) {
                        doc.setFillColor(249, 250, 251);
                        doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 7, 'F');
                    }
                    
                    // Draw cell borders
                    doc.setDrawColor(229, 231, 235);
                    doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 7);
                    
                    // Draw cell data
                    let cellX = startX + 2;
                    row.forEach((cell, cellIdx) => {
                        const cellText = String(cell || '');
                        const maxWidth = colWidths[cellIdx] - 4;
                        
                        // Truncate text if too long
                        const lines = doc.splitTextToSize(cellText, maxWidth);
                        doc.text(lines[0], cellX, y + 5);
                        
                        cellX += colWidths[cellIdx];
                    });
                    
                    y += 7;
                });
                
                return y;
            };
            
            // Draw the main table
            const finalY = drawTable(tableData, currentY);
            
            // Add summary section
            let summaryY = finalY + 10;
            
            // Check if we need a new page for summary
            if (summaryY > pageHeight - 40) {
                doc.addPage();
                summaryY = 15;
            }
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Summary Statistics', startX, summaryY);
            summaryY += 8;
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            
            const summaryStats = [
                `Total Reports: ${filteredReports.length}`,
                `Total Farmers: ${analytics.totalFarmers}`,
                `Farmers with RSBSA: ${analytics.farmersWithRSBSA}`,
                `Total Area: ${analytics.totalArea.toFixed(2)} ha`,
                `Average Yield: ${analytics.averageYield.toFixed(2)} mt/ha`
            ];
            
            const col1X = startX;
            const col2X = startX + 70;
            const col3X = startX + 140;
            
            summaryStats.forEach((stat, idx) => {
                const colNum = idx % 3;
                const x = colNum === 0 ? col1X : colNum === 1 ? col2X : col3X;
                
                if (colNum === 0 && idx > 0) summaryY += 6;
                
                doc.text(stat, x, summaryY);
            });
            
            summaryY += 10;
            
            // State distribution summary
            doc.setFont(undefined, 'bold');
            doc.text('State Distribution:', startX, summaryY);
            summaryY += 6;
            
            doc.setFont(undefined, 'normal');
            const stateStats = [
                `Distributed: ${analytics.distributedReports} (${analytics.stateByArea['Distributed']?.toFixed(2) || 0} ha)`,
                `Planting: ${analytics.plantingReports} (${analytics.stateByArea['Planting']?.toFixed(2) || 0} ha)`,
                `Planted: ${analytics.plantedReports} (${analytics.stateByArea['Planted']?.toFixed(2) || 0} ha)`,
                `Harvested: ${analytics.harvestedReportsCount} (${analytics.stateByArea['Harvested']?.toFixed(2) || 0} ha)`
            ];
            
            stateStats.forEach((stat, idx) => {
                const colNum = idx % 2;
                const x = colNum === 0 ? col1X : col2X;
                
                if (colNum === 0 && idx > 0) summaryY += 6;
                
                doc.text(stat, x, summaryY);
            });
            
            // Footer on each page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont(undefined, 'normal');
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 8,
                    { align: 'center' }
                );
            }
            
            const filename = `Planting_Reports_Analytics_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            toast.success('PDF report exported successfully!');
        } catch (error) {
            console.error('PDF export error:', error);
            toast.error('Failed to export PDF report');
        }
    }, [filteredReports, analytics, varieties, seasons]);

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
                    <div className="flex justify-between items-center mb-2">
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Planting Report Analytics
                        </h1>
                        <div className="flex gap-3">
                            <button
                                onClick={exportToExcel}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                    isDark 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                } shadow-md hover:shadow-lg hover:scale-105`}
                            >
                                <FileSpreadsheet size={20} />
                                <span className="font-medium">Export Excel</span>
                            </button>
                            <button
                                onClick={exportToPDF}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                    isDark 
                                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                } shadow-md hover:shadow-lg hover:scale-105`}
                            >
                                <FileText size={20} />
                                <span className="font-medium">Export PDF</span>
                            </button>
                        </div>
                    </div>
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
                    <FarmersAnalytics analytics={analytics} isDark={isDark} filteredReports={filteredReports} />
                )}
                {activeTab === 'production' && (
                    <ProductionAnalytics analytics={analytics} isDark={isDark} reports={filteredReports} />
                )}
            </div>
        </div>
    );
}

const OverviewAnalytics = ({ analytics, isDark, filteredReports }) => {
    const stateColors = {
        'Distributed': '#3B82F6',
        'Planting': '#8B5CF6',
        'Planted': '#10B981',
        'Harvested': '#F59E0B'
    };

    const stateIcons = {
        'Distributed': '📦',
        'Planting': '🌱',
        'Planted': '🌾',
        'Harvested': '✅'
    };

    return (
        <div className="space-y-6">
            {/* State Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'} border-l-4 border-blue-500`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{stateIcons['Distributed']}</span>
                        <Activity className="text-blue-500" size={24} />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Distributed</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {analytics.distributedReports}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {analytics.stateByArea['Distributed']?.toFixed(2) || 0} ha
                    </p>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'} border-l-4 border-purple-500`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{stateIcons['Planting']}</span>
                        <Sprout className="text-purple-500" size={24} />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planting</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {analytics.plantingReports}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {analytics.stateByArea['Planting']?.toFixed(2) || 0} ha
                    </p>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'} border-l-4 border-green-500`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{stateIcons['Planted']}</span>
                        <Target className="text-green-500" size={24} />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planted</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {analytics.plantedReports}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {analytics.stateByArea['Planted']?.toFixed(2) || 0} ha
                    </p>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'} border-l-4 border-yellow-500`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{stateIcons['Harvested']}</span>
                        <Award className="text-yellow-500" size={24} />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Harvested</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {analytics.harvestedReportsCount}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {analytics.stateByArea['Harvested']?.toFixed(2) || 0} ha
                    </p>
                </div>
            </div>

            {/* State Distribution Chart */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Report State Distribution
                </h3>
                <div className="space-y-3">
                    {Object.entries(analytics.stateDistribution).map(([state, count]) => {
                        const percentage = ((count / analytics.totalReports) * 100).toFixed(1);
                        return (
                            <div key={state}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <span>{stateIcons[state] || '📋'}</span>
                                        {state}
                                    </span>
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {count} ({percentage}%)
                                    </span>
                                </div>
                                <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: stateColors[state] || '#6B7280'
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress Funnel */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Planting Progress Funnel
                </h3>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className={`p-4 rounded-lg bg-blue-500 text-white font-semibold text-center`}>
                                    Distributed: {analytics.distributedReports}
                                </div>
                            </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl">↓</div>
                    </div>
                    
                    <div className="relative ml-8">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className={`p-4 rounded-lg bg-purple-500 text-white font-semibold text-center`}>
                                    Planting: {analytics.plantingReports}
                                </div>
                            </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl">↓</div>
                    </div>

                    <div className="relative ml-16">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className={`p-4 rounded-lg bg-green-500 text-white font-semibold text-center`}>
                                    Planted: {analytics.plantedReports}
                                </div>
                            </div>
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl">↓</div>
                    </div>

                    <div className="relative ml-24">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className={`p-4 rounded-lg bg-yellow-500 text-white font-semibold text-center`}>
                                    Harvested: {analytics.harvestedReportsCount}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {analytics.totalReports > 0 
                                    ? ((analytics.harvestedReportsCount / analytics.totalReports) * 100).toFixed(1)
                                    : 0}%
                            </p>
                        </div>
                        <div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {analytics.distributedReports + analytics.plantingReports + analytics.plantedReports}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

const FarmersAnalytics = ({ analytics, isDark, filteredReports }) => {
    const farmerEngagement = analytics.totalFarmers > 0 
        ? ((analytics.farmersWithRSBSA / analytics.totalFarmers) * 100).toFixed(1)
        : 0;

    // Calculate seed distribution metrics
    const seedDistributionData = useMemo(() => {
        const distributedReports = filteredReports.filter(r => r.state === 'Distributed');
        const totalDistributed = distributedReports.length;
        const totalAreaDistributed = distributedReports.reduce((sum, r) => sum + (r.areaPlanted || 0), 0);
        
        // Monthly distribution tracking
        const monthlyDistribution = {};
        const cropDistribution = {};
        const farmerDistribution = {};
        
        distributedReports.forEach(r => {
            const date = new Date(r.distributedAt || r.dateOfPlanting);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            // Monthly counts
            if (!monthlyDistribution[monthKey]) {
                monthlyDistribution[monthKey] = { count: 0, area: 0, date };
            }
            monthlyDistribution[monthKey].count += 1;
            monthlyDistribution[monthKey].area += r.areaPlanted || 0;
            
            // Crop type distribution
            const crop = r.typeOfCrop || 'Unknown';
            if (!cropDistribution[crop]) {
                cropDistribution[crop] = { count: 0, area: 0 };
            }
            cropDistribution[crop].count += 1;
            cropDistribution[crop].area += r.areaPlanted || 0;
            
            // Farmer distribution
            const farmerKey = r.rsbsaNumber || `${r.farmerName}-${r.farmLocation}`;
            if (!farmerDistribution[farmerKey]) {
                farmerDistribution[farmerKey] = {
                    name: r.farmerName,
                    count: 0,
                    area: 0,
                    hasRSBSA: !!r.rsbsaNumber
                };
            }
            farmerDistribution[farmerKey].count += 1;
            farmerDistribution[farmerKey].area += r.areaPlanted || 0;
        });
        
        // Sort monthly data by date
        const sortedMonthly = Object.entries(monthlyDistribution)
            .sort(([, a], [, b]) => a.date - b.date)
            .slice(-12); // Last 12 months
        
        // Top farmers by distribution count
        const topFarmers = Object.values(farmerDistribution)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        return {
            totalDistributed,
            totalAreaDistributed,
            monthlyDistribution: sortedMonthly,
            cropDistribution,
            topFarmers
        };
    }, [filteredReports]);

    return (
        <div className="space-y-6">
            {/* Seed Distribution Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Package}
                    label="Seeds Distributed"
                    value={seedDistributionData.totalDistributed}
                    subtitle={`${seedDistributionData.totalAreaDistributed.toFixed(1)} ha coverage`}
                    isDark={isDark}
                    color="green"
                />
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

            {/* Monthly Distribution Chart */}
            <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Monthly Seed Distribution (Last 12 Months)
                </h3>
                <MonthlyDistributionChart 
                    data={seedDistributionData.monthlyDistribution}
                    isDark={isDark}
                />
            </div>

            {/* Crop Type Distribution & Top Farmers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Seeds by Crop Type
                    </h3>
                    <SeedCropDistributionChart 
                        data={seedDistributionData.cropDistribution}
                        isDark={isDark}
                    />
                </div>

                <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Top Farmers by Distribution
                    </h3>
                    <TopFarmersDistributionList 
                        farmers={seedDistributionData.topFarmers}
                        isDark={isDark}
                    />
                </div>
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
            {/* State-based metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={Activity}
                    label="Distributed"
                    value={analytics.distributedReports}
                    subtitle={`${analytics.stateByArea['Distributed']?.toFixed(2) || 0} ha`}
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Sprout}
                    label="Planting"
                    value={analytics.plantingReports}
                    subtitle={`${analytics.stateByArea['Planting']?.toFixed(2) || 0} ha`}
                    isDark={isDark}
                    color="purple"
                />
                <MetricCard
                    icon={Target}
                    label="Planted"
                    value={analytics.plantedReports}
                    subtitle={`${analytics.stateByArea['Planted']?.toFixed(2) || 0} ha`}
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Award}
                    label="Harvested"
                    value={analytics.harvestedReportsCount}
                    subtitle={`${analytics.stateByArea['Harvested']?.toFixed(2) || 0} ha`}
                    isDark={isDark}
                    color="yellow"
                />
            </div>

            {/* Production Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    icon={TrendingUp}
                    label="Avg Yield"
                    value={`${analytics.averageYield.toFixed(2)} mt/ha`}
                    subtitle={`${analytics.harvestedReports} reports`}
                    isDark={isDark}
                    color="green"
                />
                <MetricCard
                    icon={Calendar}
                    label="Total Area"
                    value={`${analytics.totalArea.toFixed(1)} ha`}
                    subtitle="All reports"
                    isDark={isDark}
                    color="blue"
                />
                <MetricCard
                    icon={Award}
                    label="Best Season"
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
            <div className="relative pb-20" style={{ 
                minHeight: '300px', 
                maxHeight: '400px', 
                overflowY: 'auto',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none'  /* IE and Edge */
            }}>
                <style>{`
                    /* Hide scrollbar for Chrome, Safari and Opera */
                    .relative.pb-20::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {reportLines.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No reports found for selected filters
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {reportLines.map((line) => (
                            <div
                                key={line.id}
                                className="relative h-6 cursor-pointer group"
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

                                {/* Tooltip on hover - positioned below the bar */}
                                {hoveredReport === line.id && (
                                    <div
                                        className={`absolute z-50 px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap pointer-events-none ${
                                            isDark ? 'bg-gray-700 text-white border border-gray-600' : 'bg-white text-gray-900 border border-gray-200'
                                        }`}
                                        style={{
                                            left: `${Math.min(Math.max(line.startPercent + line.width / 2, 10), 85)}%`,
                                            top: '28px',
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

// Monthly Distribution Chart Component
const MonthlyDistributionChart = ({ data, isDark }) => {
    if (!data || data.length === 0) {
        return (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No distribution data available
            </div>
        );
    }

    const maxCount = Math.max(...data.map(([, d]) => d.count));
    const maxArea = Math.max(...data.map(([, d]) => d.area));

    return (
        <div className="space-y-4">
            <div className="flex gap-4 justify-center text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Distribution Count</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Area (ha)</span>
                </div>
            </div>
            <div className="space-y-3">
                {data.map(([month, stats]) => {
                    const countPercent = (stats.count / maxCount) * 100;
                    const areaPercent = (stats.area / maxArea) * 100;

                    return (
                        <div key={month} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {month}
                                </span>
                                <div className="flex gap-3 text-xs">
                                    <span className={isDark ? 'text-green-400' : 'text-green-600'}>
                                        {stats.count} distributions
                                    </span>
                                    <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                                        {stats.area.toFixed(1)} ha
                                    </span>
                                </div>
                            </div>
                            <div className="relative h-8 rounded-lg overflow-hidden">
                                <div className={`absolute inset-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                        className="h-1/2 bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                                        style={{ width: `${countPercent}%` }}
                                    />
                                    <div
                                        className="h-1/2 bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-300"
                                        style={{ width: `${areaPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Seed Crop Distribution Chart Component
const SeedCropDistributionChart = ({ data, isDark }) => {
    const cropColors = {
        'Rice': '#10b981',
        'Corn': '#3b82f6',
        'High_Value_Crops': '#f59e0b'
    };

    const totalCount = Object.values(data).reduce((sum, d) => sum + d.count, 0);
    const sortedData = Object.entries(data).sort(([, a], [, b]) => b.count - a.count);

    return (
        <div className="space-y-4">
            {sortedData.map(([crop, stats]) => {
                const percentage = totalCount > 0 ? (stats.count / totalCount) * 100 : 0;
                const color = cropColors[crop] || '#6b7280';

                return (
                    <div key={crop} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {crop.replace(/_/g, ' ')}
                            </span>
                            <div className="flex gap-3 text-xs">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    {stats.count} distributions
                                </span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    {stats.area.toFixed(1)} ha
                                </span>
                            </div>
                        </div>
                        <div className="relative h-6 rounded-full overflow-hidden">
                            <div className={`absolute inset-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                    className="h-full transition-all duration-300 flex items-center px-2"
                                    style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: color
                                    }}
                                >
                                    {percentage > 15 && (
                                        <span className="text-white text-xs font-medium">
                                            {percentage.toFixed(1)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Top Farmers Distribution List Component
const TopFarmersDistributionList = ({ farmers, isDark }) => {
    if (!farmers || farmers.length === 0) {
        return (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No farmer data available
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {farmers.map((farmer, idx) => (
                <div 
                    key={idx}
                    className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {farmer.name}
                                </span>
                                {farmer.hasRSBSA && (
                                    <Award className="w-3 h-3 text-green-500 flex-shrink-0" />
                                )}
                            </div>
                            <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {farmer.area.toFixed(2)} ha distributed
                            </div>
                        </div>
                        <div className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${
                            isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                        }`}>
                            {farmer.count}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlantingReportAnalytics;
