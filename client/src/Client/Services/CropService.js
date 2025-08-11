// CropService.js - Philippines Crop Management Service
export class CropService {
  // Philippines crop database with varieties, growth stages, and yields
  // Based on Department of Agriculture (DA) and Philippine Rice Research Institute (PhilRice) data
  static philippinesCrops = {
    'Rice': {
      varieties: [
        { 
          name: 'NSIC Rc222 (PSB Rc18)', 
          season: 'Wet/Dry', 
          maturityDays: 105, 
          avgYield: 4500, 
          description: 'High-yielding, early maturing, resistant to tungro',
          resistance: 'Tungro, BPH, GLH',
          features: 'Early maturing, good grain quality'
        },
        { 
          name: 'NSIC Rc216 (PSB Rc10)', 
          season: 'Wet/Dry', 
          maturityDays: 110, 
          avgYield: 5200, 
          description: 'Medium maturing, high yield potential, good eating quality',
          resistance: 'BPH, GLH, Blast',
          features: 'High milling recovery, premium quality'
        },
        { 
          name: 'NSIC Rc238', 
          season: 'Wet/Dry', 
          maturityDays: 115, 
          avgYield: 6000, 
          description: 'Aromatic rice, premium quality, good for export',
          resistance: 'BPH, Tungro',
          features: 'Aromatic, export quality, high market value'
        },
        { 
          name: 'NSIC Rc160 (PSB Rc14)', 
          season: 'Wet/Dry', 
          maturityDays: 120, 
          avgYield: 5800, 
          description: 'High-yielding, good milling recovery, pest resistant',
          resistance: 'BPH, GLH, Blast, Tungro',
          features: 'Multi-pest resistant, good milling quality'
        },
        { 
          name: 'IR64', 
          season: 'Wet/Dry', 
          maturityDays: 115, 
          avgYield: 4800, 
          description: 'Traditional variety, widely adapted, good cooking quality',
          resistance: 'BPH, GLH',
          features: 'Widely adapted, stable yield'
        },
        { 
          name: 'C4-63G', 
          season: 'Wet/Dry', 
          maturityDays: 110, 
          avgYield: 5000, 
          description: 'Hybrid variety, high yield potential, early maturing',
          resistance: 'BPH, Tungro, Blast',
          features: 'Hybrid vigor, uniform maturity'
        },
        { 
          name: 'Dinorado', 
          season: 'Wet/Dry', 
          maturityDays: 125, 
          avgYield: 4200, 
          description: 'Traditional aromatic variety, premium quality, red rice',
          resistance: 'Moderate blast resistance',
          features: 'Red pericarp, aromatic, premium market'
        },
        { 
          name: 'NSIC Rc440 (Mestizo 20)', 
          season: 'Wet/Dry', 
          maturityDays: 112, 
          avgYield: 5500, 
          description: 'High-yielding inbred variety with excellent grain quality',
          resistance: 'BPH, GLH, Tungro, Blast',
          features: 'Superior grain quality, good eating quality'
        },
        { 
          name: 'NSIC Rc480 (Mestizo 38)', 
          season: 'Wet/Dry', 
          maturityDays: 118, 
          avgYield: 5900, 
          description: 'Premium quality rice with high yield potential',
          resistance: 'Multiple pest resistance',
          features: 'Premium eating quality, export potential'
        }
      ],
      seasons: {
        wet: { 
          start: 'June', 
          end: 'October', 
          optimal: true, 
          conditions: 'Rainfed cultivation, higher pest pressure, good for traditional varieties' 
        },
        dry: { 
          start: 'December', 
          end: 'April', 
          optimal: true, 
          conditions: 'Irrigated cultivation, better grain quality, lower pest incidence' 
        },
        offseason: { 
          start: 'May', 
          end: 'July', 
          optimal: false, 
          conditions: 'Limited irrigation, higher input costs, good prices' 
        }
      },
      growthStages: [
        { stage: 'Seedling', days: '0-21', bbch: '10-19', description: 'Germination to 3-leaf stage' },
        { stage: 'Tillering', days: '22-55', bbch: '20-29', description: 'Active tillering phase' },
        { stage: 'Panicle Initiation', days: '56-75', bbch: '30-39', description: 'Stem elongation begins' },
        { stage: 'Booting', days: '76-90', bbch: '40-49', description: 'Panicle development' },
        { stage: 'Heading', days: '91-105', bbch: '50-59', description: 'Panicle emergence' },
        { stage: 'Flowering', days: '106-115', bbch: '60-69', description: 'Anthesis and pollination' },
        { stage: 'Grain Filling', days: '116-130', bbch: '70-79', description: 'Milk to dough stage' },
        { stage: 'Maturity', days: '131-140', bbch: '80-89', description: 'Hard dough to harvest' }
      ]
    },
    'Corn': {
      varieties: [
        { 
          name: 'Pioneer 30G40', 
          season: 'Wet/Dry', 
          maturityDays: 115, 
          avgYield: 8500, 
          description: 'Hybrid yellow corn, high yield, good standability',
          resistance: 'Downy mildew, Borer',
          features: 'Excellent standability, uniform ears'
        },
        { 
          name: 'Dekalb 818', 
          season: 'Wet/Dry', 
          maturityDays: 120, 
          avgYield: 9200, 
          description: 'Premium hybrid, excellent grain quality, disease resistant',
          resistance: 'Downy mildew, Leaf blight, Borer',
          features: 'Premium grain quality, wide adaptability'
        },
        { 
          name: 'IPB Var 6', 
          season: 'Wet/Dry', 
          maturityDays: 110, 
          avgYield: 7800, 
          description: 'Open-pollinated variety, good adaptation, lower cost',
          resistance: 'Moderate disease resistance',
          features: 'Cost-effective, can save seeds'
        },
        { 
          name: 'Bioseed 9681', 
          season: 'Wet/Dry', 
          maturityDays: 125, 
          avgYield: 8800, 
          description: 'Late maturing hybrid, high yield potential',
          resistance: 'Downy mildew, Borer, Leaf spot',
          features: 'High yield potential, good husk cover'
        },
        { 
          name: 'NK 6410', 
          season: 'Dry', 
          maturityDays: 108, 
          avgYield: 8200, 
          description: 'Early hybrid, suitable for multiple cropping',
          resistance: 'Downy mildew, Early borer',
          features: 'Early maturity, multiple cropping suitability'
        },
        { 
          name: 'Pioneer 30G68', 
          season: 'Wet/Dry', 
          maturityDays: 118, 
          avgYield: 9000, 
          description: 'High-yielding yellow hybrid with excellent kernel quality',
          resistance: 'Downy mildew, Borer, Leaf diseases',
          features: 'Excellent kernel quality, good dry down'
        },
        { 
          name: 'SL 1103', 
          season: 'Wet/Dry', 
          maturityDays: 112, 
          avgYield: 8300, 
          description: 'Medium maturing hybrid with good stress tolerance',
          resistance: 'Downy mildew, Drought tolerance',
          features: 'Stress tolerant, consistent performance'
        },
        { 
          name: 'Bayer NK 7328', 
          season: 'Wet/Dry', 
          maturityDays: 122, 
          avgYield: 9500, 
          description: 'Premium late-season hybrid with exceptional yield',
          resistance: 'Multiple disease resistance',
          features: 'Top yield potential, premium quality'
        }
      ],
      seasons: {
        wet: { 
          start: 'May', 
          end: 'September', 
          optimal: true, 
          conditions: 'Rainfed possible, adequate moisture, pest management required' 
        },
        dry: { 
          start: 'November', 
          end: 'March', 
          optimal: true, 
          conditions: 'Irrigated, better grain quality, lower disease pressure' 
        },
        year_round: { 
          start: 'January', 
          end: 'December', 
          optimal: false, 
          conditions: 'With proper irrigation and management, multiple harvests possible' 
        }
      },
      growthStages: [
        { stage: 'Emergence', days: '0-10', bbch: '10-19', description: 'Seedling emergence and establishment' },
        { stage: 'Vegetative', days: '11-45', bbch: '20-39', description: 'Leaf development and stem elongation' },
        { stage: 'Tasseling', days: '46-65', bbch: '50-59', description: 'Tassel emergence and pollen shed' },
        { stage: 'Silking', days: '66-75', bbch: '60-69', description: 'Silk emergence and pollination' },
        { stage: 'Grain Filling', days: '76-100', bbch: '70-79', description: 'Kernel development' },
        { stage: 'Maturity', days: '101-120', bbch: '80-89', description: 'Physiological maturity' }
      ]
    },
    'Tomato': {
      varieties: [
        { 
          name: 'Diamante Max', 
          season: 'Dry', 
          maturityDays: 75, 
          avgYield: 45000, 
          description: 'Determinate hybrid, processing type, disease resistant' 
        },
        { 
          name: 'Hercules', 
          season: 'Dry', 
          maturityDays: 80, 
          avgYield: 50000, 
          description: 'Indeterminate hybrid, fresh market, high yield' 
        },
        { 
          name: 'Apollo', 
          season: 'Dry', 
          maturityDays: 70, 
          avgYield: 42000, 
          description: 'Early maturing, compact plant, good for containers' 
        },
        { 
          name: 'Improved Pope', 
          season: 'Dry', 
          maturityDays: 85, 
          avgYield: 38000, 
          description: 'Open-pollinated, traditional variety, good adaptation' 
        }
      ],
      seasons: {
        dry: { start: 'October', end: 'March', optimal: true },
        wet: { start: 'June', end: 'September', optimal: false }
      },
      growthStages: [
        { stage: 'Seedling', days: '0-21', bbch: '10-19', description: 'Germination to transplanting' },
        { stage: 'Vegetative', days: '22-45', bbch: '20-39', description: 'Stem and leaf development' },
        { stage: 'Flowering', days: '46-60', bbch: '60-69', description: 'First flower clusters' },
        { stage: 'Fruit Development', days: '61-75', bbch: '70-79', description: 'Fruit set and enlargement' },
        { stage: 'Maturity', days: '76-90', bbch: '80-89', description: 'Harvest period' }
      ]
    },
    'Eggplant': {
      varieties: [
        { 
          name: 'Morga', 
          season: 'Dry', 
          maturityDays: 75, 
          avgYield: 25000, 
          description: 'Long purple variety, good market acceptance' 
        },
        { 
          name: 'Mara', 
          season: 'Dry', 
          maturityDays: 70, 
          avgYield: 28000, 
          description: 'Early maturing, disease resistant, high yielding' 
        },
        { 
          name: 'EG203', 
          season: 'Dry', 
          maturityDays: 80, 
          avgYield: 30000, 
          description: 'Hybrid variety, excellent fruit quality' 
        }
      ],
      seasons: {
        dry: { start: 'October', end: 'March', optimal: true },
        wet: { start: 'June', end: 'September', optimal: false }
      },
      growthStages: [
        { stage: 'Seedling', days: '0-21', bbch: '10-19', description: 'Nursery stage' },
        { stage: 'Vegetative', days: '22-50', bbch: '20-39', description: 'Vegetative growth after transplanting' },
        { stage: 'Flowering', days: '51-65', bbch: '60-69', description: 'First flowers appear' },
        { stage: 'Fruiting', days: '66-90', bbch: '70-89', description: 'Continuous harvest period' }
      ]
    },
    'Cabbage': {
      varieties: [
        { 
          name: 'Scorpio', 
          season: 'Dry', 
          maturityDays: 65, 
          avgYield: 35000, 
          description: 'Heat tolerant, compact heads, good storage' 
        },
        { 
          name: 'Green Coronet', 
          season: 'Dry', 
          maturityDays: 70, 
          avgYield: 40000, 
          description: 'Large heads, excellent quality, disease resistant' 
        },
        { 
          name: 'Hybrid 606', 
          season: 'Dry', 
          maturityDays: 60, 
          avgYield: 32000, 
          description: 'Early maturing, uniform heads, good yield' 
        }
      ],
      seasons: {
        dry: { start: 'October', end: 'February', optimal: true },
        wet: { start: 'June', end: 'August', optimal: false }
      },
      growthStages: [
        { stage: 'Seedling', days: '0-21', bbch: '10-19', description: 'Nursery to transplanting' },
        { stage: 'Rosette', days: '22-35', bbch: '20-39', description: 'Leaf rosette formation' },
        { stage: 'Head Formation', days: '36-55', bbch: '40-49', description: 'Head initiation and development' },
        { stage: 'Maturity', days: '56-70', bbch: '80-89', description: 'Harvest ready' }
      ]
    },
    'Lettuce': {
      varieties: [
        { 
          name: 'Black Seeded Simpson', 
          season: 'Dry', 
          maturityDays: 45, 
          avgYield: 15000, 
          description: 'Leaf lettuce, heat tolerant, quick growing' 
        },
        { 
          name: 'Great Lakes', 
          season: 'Dry', 
          maturityDays: 55, 
          avgYield: 20000, 
          description: 'Head lettuce, crisp texture, good for salads' 
        },
        { 
          name: 'Buttercrunch', 
          season: 'Dry', 
          maturityDays: 50, 
          avgYield: 18000, 
          description: 'Butterhead type, tender leaves, good flavor' 
        }
      ],
      seasons: {
        dry: { start: 'October', end: 'February', optimal: true },
        wet: { start: 'June', end: 'August', optimal: false }
      },
      growthStages: [
        { stage: 'Germination', days: '0-7', bbch: '00-09', description: 'Seed germination' },
        { stage: 'Seedling', days: '8-21', bbch: '10-19', description: 'Early leaf development' },
        { stage: 'Vegetative', days: '22-40', bbch: '20-39', description: 'Rosette formation' },
        { stage: 'Maturity', days: '41-55', bbch: '40-49', description: 'Harvest stage' }
      ]
    },
    'Onion': {
      varieties: [
        { 
          name: 'Red Pinoy', 
          season: 'Dry', 
          maturityDays: 90, 
          avgYield: 18000, 
          description: 'Red variety, good storage, strong flavor' 
        },
        { 
          name: 'Yellow Granex', 
          season: 'Dry', 
          maturityDays: 95, 
          avgYield: 22000, 
          description: 'Sweet onion, large bulbs, good for fresh market' 
        },
        { 
          name: 'White Bermuda', 
          season: 'Dry', 
          maturityDays: 85, 
          avgYield: 20000, 
          description: 'Mild flavor, white bulbs, early maturing' 
        }
      ],
      seasons: {
        dry: { start: 'October', end: 'March', optimal: true },
        wet: { start: 'June', end: 'September', optimal: false }
      },
      growthStages: [
        { stage: 'Seedling', days: '0-30', bbch: '10-19', description: 'Transplant establishment' },
        { stage: 'Vegetative', days: '31-60', bbch: '20-39', description: 'Leaf development' },
        { stage: 'Bulbing', days: '61-85', bbch: '40-49', description: 'Bulb initiation and enlargement' },
        { stage: 'Maturity', days: '86-100', bbch: '80-89', description: 'Harvest ready' }
      ]
    },
    'Garlic': {
      varieties: [
        { 
          name: 'Ilocos White', 
          season: 'Dry', 
          maturityDays: 120, 
          avgYield: 8000, 
          description: 'Traditional variety, white bulbs, good adaptation' 
        },
        { 
          name: 'Batanes Purple', 
          season: 'Dry', 
          maturityDays: 130, 
          avgYield: 7500, 
          description: 'Purple variety, strong flavor, cold tolerant' 
        },
        { 
          name: 'Mindanao White', 
          season: 'Dry', 
          maturityDays: 110, 
          avgYield: 8500, 
          description: 'Adapted to warm climate, early maturing' 
        }
      ],
      seasons: {
        dry: { start: 'October', end: 'April', optimal: true },
        wet: { start: 'June', end: 'September', optimal: false }
      },
      growthStages: [
        { stage: 'Sprouting', days: '0-15', bbch: '00-09', description: 'Clove sprouting' },
        { stage: 'Vegetative', days: '16-60', bbch: '10-39', description: 'Leaf and root development' },
        { stage: 'Bulbing', days: '61-100', bbch: '40-49', description: 'Bulb formation' },
        { stage: 'Maturity', days: '101-130', bbch: '80-89', description: 'Harvest stage' }
      ]
    }
  };

  // Get crop varieties for a specific crop type
  static getCropVarieties(cropType) {
    return this.philippinesCrops[cropType]?.varieties || [];
  }

  // Get growth stages for a specific crop type
  static getGrowthStages(cropType) {
    return this.philippinesCrops[cropType]?.growthStages || [];
  }

  // Get optimal seasons for a crop type
  static getOptimalSeasons(cropType) {
    return this.philippinesCrops[cropType]?.seasons || {};
  }

  // Calculate expected harvest yield based on area and variety
  static calculateExpectedYield(cropType, variety, area) {
    const varieties = this.getCropVarieties(cropType);
    const selectedVariety = varieties.find(v => v.name === variety);
    
    if (!selectedVariety) return 0;
    
    // Convert area from hectares to square meters if needed, then calculate yield
    const yieldPerHectare = selectedVariety.avgYield;
    return Math.round(yieldPerHectare * area);
  }

  // Get expected harvest date based on planting date and variety
  static getExpectedHarvestDate(cropType, variety, plantingDate) {
    const varieties = this.getCropVarieties(cropType);
    const selectedVariety = varieties.find(v => v.name === variety);
    
    if (!selectedVariety) return null;
    
    const planting = new Date(plantingDate);
    const harvest = new Date(planting);
    harvest.setDate(harvest.getDate() + selectedVariety.maturityDays);
    
    return harvest.toISOString().split('T')[0];
  }

  // Check if current season is optimal for the crop
  static isOptimalSeason(cropType, currentMonth = null) {
    const month = currentMonth || new Date().toLocaleString('default', { month: 'long' });
    const seasons = this.getOptimalSeasons(cropType);
    
    for (const [seasonType, seasonInfo] of Object.entries(seasons)) {
      if (seasonInfo.optimal && this.isMonthInSeason(month, seasonInfo.start, seasonInfo.end)) {
        return { optimal: true, season: seasonType, info: seasonInfo };
      }
    }
    
    return { optimal: false, season: null, info: null };
  }

  // Check if a month falls within a season range
  static isMonthInSeason(month, startMonth, endMonth) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthIndex = months.indexOf(month);
    const startIndex = months.indexOf(startMonth);
    const endIndex = months.indexOf(endMonth);
    
    if (startIndex <= endIndex) {
      return monthIndex >= startIndex && monthIndex <= endIndex;
    } else {
      // Season spans across year (e.g., December to April)
      return monthIndex >= startIndex || monthIndex <= endIndex;
    }
  }

  // Get current growth stage based on planting date
  static getCurrentGrowthStage(cropType, plantingDate) {
    const stages = this.getGrowthStages(cropType);
    if (!stages.length) return null;

    const planting = new Date(plantingDate);
    const current = new Date();
    const daysFromPlanting = Math.floor((current - planting) / (1000 * 60 * 60 * 24));

    for (const stage of stages) {
      const [startDay, endDay] = stage.days.split('-').map(d => parseInt(d));
      if (daysFromPlanting >= startDay && daysFromPlanting <= endDay) {
        return {
          ...stage,
          daysFromPlanting,
          progress: Math.round(((daysFromPlanting - startDay) / (endDay - startDay)) * 100)
        };
      }
    }

    // If beyond all stages, return the last stage
    const lastStage = stages[stages.length - 1];
    return {
      ...lastStage,
      daysFromPlanting,
      progress: 100
    };
  }

  // Check if monthly report is due for a crop
  static isReportDue(crop) {
    if (!crop.plantingDate) return false;
    
    const plantingDate = new Date(crop.plantingDate);
    const currentDate = new Date();
    const lastReportDate = crop.lastReportDate ? new Date(crop.lastReportDate) : plantingDate;
    
    // Calculate days since last report
    const daysSinceLastReport = Math.floor((currentDate - lastReportDate) / (1000 * 60 * 60 * 24));
    
    // Report is due every 30 days (monthly)
    return daysSinceLastReport >= 30;
  }

  // Get variety information
  static getVarietyInfo(cropType, varietyName) {
    const varieties = this.getCropVarieties(cropType);
    return varieties.find(v => v.name === varietyName);
  }

  // Get all available crop types
  static getAllCropTypes() {
    return Object.keys(this.philippinesCrops);
  }

  // Validate crop registration data
  static validateCropRegistration(data) {
    const errors = [];
    
    if (!data.cropType) errors.push('Crop type is required');
    if (!data.variety) errors.push('Variety is required');
    if (!data.area || data.area <= 0) errors.push('Valid area is required');
    if (!data.plantingDate) errors.push('Planting date is required');
    if (!data.location) errors.push('Location is required');
    
    // Check if variety exists for the crop type
    if (data.cropType && data.variety) {
      const varieties = this.getCropVarieties(data.cropType);
      if (!varieties.find(v => v.name === data.variety)) {
        errors.push('Selected variety is not available for this crop type');
      }
    }
    
    // Check if planting date is not in the future beyond reasonable limits
    if (data.plantingDate) {
      const plantingDate = new Date(data.plantingDate);
      const maxFutureDate = new Date();
      maxFutureDate.setDate(maxFutureDate.getDate() + 30); // Allow up to 30 days in future
      
      if (plantingDate > maxFutureDate) {
        errors.push('Planting date cannot be more than 30 days in the future');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get season recommendations
  static getSeasonRecommendations() {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const recommendations = [];
    
    Object.entries(this.philippinesCrops).forEach(([cropType, info]) => {
      const seasonCheck = this.isOptimalSeason(cropType, currentMonth);
      if (seasonCheck.optimal) {
        recommendations.push({
          cropType,
          season: seasonCheck.season,
          varieties: info.varieties.slice(0, 3), // Top 3 varieties
          seasonality: info.seasonality
        });
      }
    });

    return recommendations;
  }

  // Format yield for display
  static formatYield(yieldValue, unit = 'kg') {
    if (yieldValue >= 1000) {
      return `${(yieldValue / 1000).toFixed(1)}t`;
    }
    return `${yieldValue.toLocaleString()} ${unit}`;
  }

  // Calculate progress percentage
  static calculateProgress(plantingDate, harvestDate) {
    const start = new Date(plantingDate);
    const end = new Date(harvestDate);
    const current = new Date();

    if (current < start) return 0;
    if (current > end) return 100;

    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const elapsedDays = (current - start) / (1000 * 60 * 60 * 24);

    return Math.round((elapsedDays / totalDays) * 100);
  }
}

export default CropService;
