import {
  getSetting,
  getSettingsByCategory,
  getAllSettings,
  updateSetting,
  createSetting,
  deleteSetting,
  refreshCache,
  SettingValidators
} from '../../Services/systemSettingsService.js';

/**
 * Get all system settings grouped by category
 */
async function getSettings(req, res) {
  try {
    const { category } = req.query;
    
    let settings;
    if (category) {
      settings = await getSettingsByCategory(category);
      return res.json({
        success: true,
        category,
        settings
      });
    } else {
      settings = await getAllSettings();
      return res.json({
        success: true,
        settings
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
}

/**
 * Get a single setting by key
 */
async function getSingleSetting(req, res) {
  try {
    const { key } = req.params;
    const setting = await getSetting(key);
    
    if (setting === null) {
      return res.status(404).json({
        success: false,
        error: 'Setting not found'
      });
    }
    
    return res.json({
      success: true,
      setting
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch setting'
    });
  }
}

/**
 * Update a setting value
 */
async function updateSettingValue(req, res) {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const updatedBy = req.user?.id;
    
    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'Value is required'
      });
    }
    
    // Validate if validator exists for this key
    if (SettingValidators[key]) {
      try {
        SettingValidators[key](value);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }
    }
    
    const updated = await updateSetting(key, value, updatedBy);
    
    return res.json({
      success: true,
      message: 'Setting updated successfully',
      setting: updated
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update setting'
    });
  }
}

/**
 * Create a new setting
 */
async function createNewSetting(req, res) {
  try {
    const { key, value, description, category, dataType } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required'
      });
    }
    
    const created = await createSetting({
      key,
      value,
      description,
      category: category || 'general',
      dataType: dataType || 'string'
    });
    
    return res.status(201).json({
      success: true,
      message: 'Setting created successfully',
      setting: created
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'A setting with this key already exists'
      });
    }
    
    console.error('Error creating setting:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create setting'
    });
  }
}

/**
 * Delete a setting
 */
async function deleteSettingByKey(req, res) {
  try {
    const { key } = req.params;
    
    await deleteSetting(key);
    
    return res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete setting'
    });
  }
}

/**
 * Refresh settings cache
 */
async function refreshSettingsCache(req, res) {
  try {
    await refreshCache();
    
    return res.json({
      success: true,
      message: 'Settings cache refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to refresh cache'
    });
  }
}

export {
  getSettings,
  getSingleSetting,
  updateSettingValue,
  createNewSetting,
  deleteSettingByKey,
  refreshSettingsCache
};
