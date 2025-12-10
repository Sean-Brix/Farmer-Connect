import { getSetting } from '../../../Services/systemSettingsService.js';

/**
 * Get EIC system settings for client-side validation
 * GET /api/eic/settings
 */
export default async function getSettings(req, res) {
  try {
    // Fetch all EIC-related system settings
    const settings = {
      eic_max_simultaneous_borrows: await getSetting('eic_max_simultaneous_borrows', 3),
      eic_max_quantity_per_request: await getSetting('eic_max_quantity_per_request', 5),
      eic_cooldown_days: await getSetting('eic_cooldown_days', 7),
      allow_weekend_pickups: await getSetting('allow_weekend_pickups', false),
      max_advance_booking_days: await getSetting('max_advance_booking_days', 30),
      eic_max_pickups_per_day: await getSetting('eic_max_pickups_per_day', 10),
    };

    res.json({
      success: true,
      settings,
      message: 'EIC settings retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error fetching EIC settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch EIC settings',
      message: error.message
    });
  }
}
