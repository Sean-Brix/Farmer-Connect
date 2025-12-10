/**
 * Validation Helper Functions for EIC Requests
 * Client-side validation before form submission
 */

/**
 * Validate quantity against item and system limits
 */
export const validateQuantity = (quantity, item, systemSettings) => {
  const errors = [];

  // Check if quantity is a valid number
  if (!quantity || quantity < 1) {
    errors.push('Quantity must be at least 1');
    return errors;
  }

  // Check against available stock
  if (quantity > item.quantity) {
    errors.push(`Only ${item.quantity} units available`);
  }

  // Check against item-specific limit
  if (item.max_quantity_per_request && quantity > item.max_quantity_per_request) {
    errors.push(`Maximum ${item.max_quantity_per_request} units per request for this item`);
  }

  // Check against global system limit
  if (systemSettings?.eic_max_quantity_per_request && quantity > systemSettings.eic_max_quantity_per_request) {
    errors.push(`Maximum ${systemSettings.eic_max_quantity_per_request} units allowed per request`);
  }

  return errors;
};

/**
 * Validate pickup and return dates
 */
export const validateDates = (pickupDate, returnDate, item, systemSettings) => {
  const errors = {
    pickupDate: [],
    returnDate: []
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickup = new Date(pickupDate);
  const returnDt = new Date(returnDate);

  // Validate pickup date
  if (!pickupDate) {
    errors.pickupDate.push('Pickup date is required');
  } else {
    // Check if pickup date is in the past
    if (pickup < today) {
      errors.pickupDate.push('Pickup date cannot be in the past');
    }

    // Check weekend pickups
    if (systemSettings?.allow_weekend_pickups === false) {
      const pickupDay = pickup.getDay();
      if (pickupDay === 0 || pickupDay === 6) {
        errors.pickupDate.push('Weekend pickups are not allowed');
      }
    }

    // Check advance booking limit
    if (systemSettings?.max_advance_booking_days) {
      const daysInAdvance = Math.ceil((pickup - today) / (1000 * 60 * 60 * 24));
      if (daysInAdvance > systemSettings.max_advance_booking_days) {
        errors.pickupDate.push(`Can only book ${systemSettings.max_advance_booking_days} days in advance`);
      }
    }
  }

  // Validate return date
  if (!returnDate) {
    errors.returnDate.push('Return date is required');
  } else if (pickupDate) {
    // Check if return date is after pickup date
    if (returnDt <= pickup) {
      errors.returnDate.push('Return date must be after pickup date');
    }

    // Check against item date_limit
    if (item.date_limit) {
      const borrowDays = Math.ceil((returnDt - pickup) / (1000 * 60 * 60 * 24));
      if (borrowDays > item.date_limit) {
        errors.returnDate.push(`Maximum ${item.date_limit} days borrowing period`);
      }
    }
  }

  return errors;
};

/**
 * Check if user has active request for this item
 */
export const validateDuplicateRequest = (userRequests, itemId) => {
  if (!userRequests || !itemId) {
    return { isDuplicate: false, message: '' };
  }

  const hasActive = userRequests.some(
    r => r.itemId === itemId && ['Pending', 'Approved'].includes(r.status)
  );

  return {
    isDuplicate: hasActive,
    message: hasActive ? 'You already have an active request for this item' : ''
  };
};

/**
 * Check if user is in cooldown period
 */
export const checkCooldownPeriod = (userRequests, systemSettings) => {
  if (!userRequests || !systemSettings?.eic_cooldown_days) {
    return { inCooldown: false, daysRemaining: 0, message: '' };
  }

  const recentReturn = userRequests
    .filter(r => r.status === 'Returned')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  if (!recentReturn) {
    return { inCooldown: false, daysRemaining: 0, message: '' };
  }

  const daysSinceReturn = calculateDaysSince(recentReturn.updatedAt);
  const daysRemaining = systemSettings.eic_cooldown_days - daysSinceReturn;

  if (daysRemaining > 0) {
    return {
      inCooldown: true,
      daysRemaining,
      message: `You must wait ${daysRemaining} more day(s) before making a new request`
    };
  }

  return { inCooldown: false, daysRemaining: 0, message: '' };
};

/**
 * Check if user has reached max active requests
 */
export const checkMaxActiveRequests = (userRequests, systemSettings) => {
  if (!userRequests || !systemSettings?.eic_max_simultaneous_borrows) {
    return { atLimit: false, current: 0, limit: 0, message: '' };
  }

  const activeCount = userRequests.filter(
    r => ['Pending', 'Approved'].includes(r.status)
  ).length;

  const limit = systemSettings.eic_max_simultaneous_borrows;
  const atLimit = activeCount >= limit;

  return {
    atLimit,
    current: activeCount,
    limit,
    message: atLimit ? `You have reached the maximum of ${limit} active requests` : ''
  };
};

/**
 * Validate request note
 */
export const validateRequestNote = (note) => {
  const errors = [];

  if (note && note.length > 500) {
    errors.push('Request note must be 500 characters or less');
  }

  return errors;
};

/**
 * Comprehensive form validation
 */
export const validateRequestForm = (formData, item, userRequests, systemSettings) => {
  const errors = {
    quantity: [],
    pickupDate: [],
    returnDate: [],
    request_note: [],
    general: []
  };

  // Validate quantity
  errors.quantity = validateQuantity(formData.quantity, item, systemSettings);

  // Validate dates
  const dateErrors = validateDates(formData.pickupDate, formData.returnDate, item, systemSettings);
  errors.pickupDate = dateErrors.pickupDate;
  errors.returnDate = dateErrors.returnDate;

  // Validate request note
  errors.request_note = validateRequestNote(formData.request_note);

  // Check for duplicate request
  const duplicateCheck = validateDuplicateRequest(userRequests, item.id);
  if (duplicateCheck.isDuplicate) {
    errors.general.push(duplicateCheck.message);
  }

  // Cooldown period check removed - users can request anytime even after returning items

  // Check max active requests
  const maxActiveCheck = checkMaxActiveRequests(userRequests, systemSettings);
  if (maxActiveCheck.atLimit) {
    errors.general.push(maxActiveCheck.message);
  }

  // Check if there are any errors
  const hasErrors = 
    errors.quantity.length > 0 ||
    errors.pickupDate.length > 0 ||
    errors.returnDate.length > 0 ||
    errors.request_note.length > 0 ||
    errors.general.length > 0;

  return { errors, hasErrors };
};

// Helper function
const calculateDaysSince = (date) => {
  if (!date) return 0;
  const pastDate = new Date(date);
  const today = new Date();
  const diffTime = today - pastDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
