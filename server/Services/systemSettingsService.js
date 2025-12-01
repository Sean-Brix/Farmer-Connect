import prisma from '../config/database.js';

// In-memory cache for settings to avoid repeated database queries
const settingsCache = new Map();
let cacheInitialized = false;

/**
 * Initialize settings cache by loading all settings from database
 */
async function initializeCache() {
  if (cacheInitialized) return;
  
  try {
    const settings = await prisma.systemSettings.findMany();
    settings.forEach(setting => {
      settingsCache.set(setting.key, setting);
    });
    cacheInitialized = true;
    console.log(`✅ System settings cache initialized (${settings.length} settings)`);
  } catch (error) {
    console.error('❌ Error initializing settings cache:', error);
  }
}

/**
 * Get a single setting value by key
 * @param {string} key - Setting key
 * @param {any} defaultValue - Default value if setting not found
 * @returns {Promise<any>} Parsed setting value
 */
export async function getSetting(key, defaultValue = null) {
  if (!cacheInitialized) {
    await initializeCache();
  }
  
  const setting = settingsCache.get(key);
  if (!setting) {
    return defaultValue;
  }
  
  return parseSettingValue(setting);
}

/**
 * Get all settings for a specific category
 * @param {string} category - Category name ('eic', 'distribution', 'notification', 'general')
 * @returns {Promise<Array>} Array of settings
 */
export async function getSettingsByCategory(category) {
  if (!cacheInitialized) {
    await initializeCache();
  }
  
  return Array.from(settingsCache.values())
    .filter(setting => setting.category === category)
    .map(setting => ({
      ...setting,
      parsedValue: parseSettingValue(setting)
    }));
}

/**
 * Get all settings grouped by category
 * @returns {Promise<Object>} Settings grouped by category
 */
export async function getAllSettings() {
  if (!cacheInitialized) {
    await initializeCache();
  }
  
  const settings = Array.from(settingsCache.values());
  const grouped = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push({
      ...setting,
      parsedValue: parseSettingValue(setting)
    });
    return acc;
  }, {});
  
  return grouped;
}

/**
 * Update a setting value
 * @param {string} key - Setting key
 * @param {any} value - New value
 * @param {string} updatedBy - User ID who made the update
 * @returns {Promise<Object>} Updated setting
 */
export async function updateSetting(key, value, updatedBy = null) {
  try {
    const stringValue = String(value);
    
    const updated = await prisma.systemSettings.update({
      where: { key },
      data: {
        value: stringValue,
        updatedBy,
        updatedAt: new Date()
      }
    });
    
    // Update cache
    settingsCache.set(key, updated);
    
    return {
      ...updated,
      parsedValue: parseSettingValue(updated)
    };
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
}

/**
 * Create a new setting
 * @param {Object} settingData - Setting data
 * @returns {Promise<Object>} Created setting
 */
export async function createSetting(settingData) {
  try {
    const created = await prisma.systemSettings.create({
      data: {
        ...settingData,
        value: String(settingData.value)
      }
    });
    
    // Update cache
    settingsCache.set(created.key, created);
    
    return {
      ...created,
      parsedValue: parseSettingValue(created)
    };
  } catch (error) {
    console.error('Error creating setting:', error);
    throw error;
  }
}

/**
 * Delete a setting
 * @param {string} key - Setting key
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSetting(key) {
  try {
    await prisma.systemSettings.delete({
      where: { key }
    });
    
    // Remove from cache
    settingsCache.delete(key);
    
    return true;
  } catch (error) {
    console.error(`Error deleting setting ${key}:`, error);
    throw error;
  }
}

/**
 * Refresh cache from database
 */
export async function refreshCache() {
  settingsCache.clear();
  cacheInitialized = false;
  await initializeCache();
}

/**
 * Parse setting value based on dataType
 * @param {Object} setting - Setting object
 * @returns {any} Parsed value
 */
function parseSettingValue(setting) {
  const { value, dataType } = setting;
  
  switch (dataType) {
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return value === 'true' || value === '1';
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
}

// Validation helpers
export const SettingValidators = {
  /**
   * Validate EIC max simultaneous borrows
   */
  eic_max_simultaneous_borrows: (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 10) {
      throw new Error('Max simultaneous borrows must be between 1 and 10');
    }
    return num;
  },
  
  /**
   * Validate max quantity per request
   */
  eic_max_quantity_per_request: (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 100) {
      throw new Error('Max quantity per request must be between 1 and 100');
    }
    return num;
  },
  
  /**
   * Validate cooldown days
   */
  eic_cooldown_days: (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 365) {
      throw new Error('Cooldown days must be between 0 and 365');
    }
    return num;
  },
  
  /**
   * Validate distribution max requests per month
   */
  distribution_max_requests_per_month: (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 30) {
      throw new Error('Max requests per month must be between 1 and 30');
    }
    return num;
  }
};

export default {
  getSetting,
  getSettingsByCategory,
  getAllSettings,
  updateSetting,
  createSetting,
  deleteSetting,
  refreshCache,
  SettingValidators
};
