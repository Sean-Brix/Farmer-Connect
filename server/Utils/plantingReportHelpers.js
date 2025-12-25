/**
 * PlantingReport Helper Functions
 *
 * Utility functions for PlantingReport feature:
 * - Auto-calculations (yield, expected harvest)
 * - State transition logic
 * - Audit trail management
 * - Query builders
 * - Pagination
 */

import prisma from '../config/database.js';
import { validateYieldSanity, validateHarvestArea } from '../validation/plantingReportValidation.js';

// ==================== AUTO-CALCULATION HELPERS ====================

/**
 * Calculate Yield (Mt/Ha)
 *
 * Formula: yield = (harvestArea * numberOfBags * weightPerBag) / 1000
 * Performs sanity checks based on crop type.
 */
export function calculateYield(harvestArea, numberOfBags, weightPerBag, cropType) {
  const area = Number(harvestArea);
  const bags = Number(numberOfBags);
  const bagWeight = Number(weightPerBag);

  if (!area || !bags || !bagWeight) {
    return { yield: null, warning: 'Missing harvest data', valid: false };
  }

  if (area <= 0 || bags <= 0 || bagWeight <= 0) {
    return { yield: null, warning: 'Invalid harvest values (must be positive)', valid: false };
  }

  const totalWeightKg = bags * bagWeight;
  const totalWeightMt = totalWeightKg / 1000;
  const yieldMtPerHa = totalWeightMt / area;
  const yieldRounded = Math.round(yieldMtPerHa * 100) / 100;

  const sanityCheck = validateYieldSanity(cropType, yieldRounded);

  return {
    yield: yieldRounded,
    warning: sanityCheck.warning,
    valid: sanityCheck.valid
  };
}

/**
 * Calculate Expected Harvest Date
 * Uses DAS values from variety based on planting method (Transplanting vs Direct_Seeded).
 * Only applies to Rice varieties; returns null otherwise.
 */
export async function calculateExpectedHarvest(varietyId, dateOfPlanting, plantingMethod) {
  try {
    if (!dateOfPlanting || !varietyId) {
      return null;
    }

    const variety = await prisma.seedVariety.findUnique({
      where: { id: varietyId },
      select: { directSeededDAS: true, transplantedDAS: true, cropType: true }
    });

    if (!variety) {
      console.warn(`Variety ${varietyId} not found for harvest calculation`);
      return null;
    }

    if (variety.cropType !== 'Rice') {
      return null;
    }

    const methodIsTransplanting = plantingMethod === 'Transplanting';
    const das = methodIsTransplanting ? variety.transplantedDAS : variety.directSeededDAS;

    if (!das || das <= 0) {
      console.warn(`Invalid DAS (${das}) for variety ${varietyId}`);
      return null;
    }

    const plantingDate = new Date(dateOfPlanting);
    const expectedDate = new Date(plantingDate);
    expectedDate.setDate(plantingDate.getDate() + das);

    return expectedDate;
  } catch (error) {
    console.error('Error calculating expected harvest:', error);
    return null;
  }
}

// ==================== STATE TRANSITION HELPERS ====================

/**
 * Validate State Transition Data
 * Ensures required fields for Request_Report→Planted and Planted→Completed.
 */
export function validateStateTransitionData(report, targetState, updateData) {
  const errors = [];

  if (targetState === 'Planted') {
    if (report.state !== 'Request_Report') {
      errors.push(`Cannot transition to Planted from ${report.state} state`);
    }

    if (!updateData.dateOfPlanting) {
      errors.push('Date of planting is required');
    }

    if (!updateData.plantingMethod) {
      errors.push('Planting method is required');
    }

    if (report.typeOfCrop === 'Rice' && !updateData.riceIrrigation) {
      errors.push('Rice irrigation type is required for Rice crops');
    }
  } else if (targetState === 'Completed') {
    if (report.state !== 'Planted') {
      errors.push(`Cannot transition to Completed from ${report.state} state`);
    }

    if (!updateData.harvestArea) {
      errors.push('Harvest area is required');
    } else {
      const harvestCheck = validateHarvestArea(report.areaPlanted, updateData.harvestArea);
      if (!harvestCheck.valid) {
        errors.push(harvestCheck.error);
      }
    }

    if (!updateData.numberOfBags) {
      errors.push('Number of bags is required');
    }

    if (!updateData.weightPerBag) {
      errors.push('Weight per bag is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Update State History
 */
export function updateStateHistory(currentHistory, fromState, toState, userId, reason = null) {
  const history = currentHistory || [];
  const newEntry = {
    from: fromState,
    to: toState,
    timestamp: new Date().toISOString(),
    by: userId,
    reason: reason || 'Manual state transition'
  };
  return [...history, newEntry];
}

// ==================== QUERY BUILDERS ====================

export function buildReportQuery(filters = {}) {
  const where = {
    isDeleted: false
  };

  if (filters.state) {
    where.state = filters.state;
  }

  if (filters.isArchived !== undefined) {
    where.isArchived = filters.isArchived;
  }

  if (filters.distributionLinked !== undefined) {
    where.distributionRequestId = filters.distributionLinked ? { not: null } : null;
  }

  if (filters.distributionRequestId) {
    where.distributionRequestId = filters.distributionRequestId;
  }

  if (filters.typeOfCrop) {
    where.typeOfCrop = filters.typeOfCrop;
  }

  if (filters.varietyId) {
    where.varietyId = filters.varietyId;
  }

  if (filters.croppingSeasonId) {
    where.croppingSeasonId = filters.croppingSeasonId;
  }

  if (filters.search) {
    where.OR = [
      { farmerName: { contains: filters.search, mode: 'insensitive' } },
      { farmLocation: { contains: filters.search, mode: 'insensitive' } },
      { rsbsaNumber: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.createdAt.lte = new Date(filters.dateTo);
    }
  }

  return where;
}

export function buildDeletedReportsQuery(filters = {}) {
  const where = {
    isDeleted: true
  };

  if (filters.state) {
    where.state = filters.state;
  }

  if (filters.deletedBy) {
    where.deletedBy = filters.deletedBy;
  }

  if (filters.deletedFrom || filters.deletedTo) {
    where.deletedAt = {};
    if (filters.deletedFrom) {
      where.deletedAt.gte = new Date(filters.deletedFrom);
    }
    if (filters.deletedTo) {
      where.deletedAt.lte = new Date(filters.deletedTo);
    }
  }

  return where;
}

// ==================== PAGINATION HELPERS ====================

export function calculatePagination(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

export function getPaginationParams(query) {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 25;

  if (page < 1) page = 1;
  if (limit < 10) limit = 10;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// ==================== DATE HELPERS ====================

export function daysUntilPermanentDelete(deletedAt) {
  if (!deletedAt) return null;

  const deleted = new Date(deletedAt);
  const deadline = new Date(deleted);
  deadline.setDate(deleted.getDate() + 30);

  const now = new Date();
  const diffMs = deadline - now;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(date, format = 'short') {
  if (!date) return null;

  const d = new Date(date);
  if (format === 'ISO') return d.toISOString();
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return d.toISOString().split('T')[0];
}

// ==================== AUDIT TRAIL HELPERS ====================

export function createAuditEntry(action, userId, details = {}) {
  return {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  };
}

export function getStateDisplayName(state) {
  const stateNames = {
    Request_Report: 'Request Report',
    Planted: 'Planted',
    Completed: 'Completed'
  };
  return stateNames[state] || state;
}

// ==================== BULK OPERATION HELPERS ====================

export async function validateBulkArchive(reportIds) {
  const reports = await prisma.plantingReport.findMany({
    where: { id: { in: reportIds }, isDeleted: false },
    select: { id: true, state: true, isArchived: true, farmerName: true }
  });

  const errors = [];
  const eligibleIds = [];

  reports.forEach((report) => {
    if (report.isArchived) {
      errors.push(`${report.farmerName} (ID: ${report.id}) is already archived`);
    } else if (report.state !== 'Completed') {
      errors.push(`${report.farmerName} (ID: ${report.id}) is not in Completed state (current: ${report.state})`);
    } else {
      eligibleIds.push(report.id);
    }
  });

  const foundIds = reports.map((r) => r.id);
  const missingIds = reportIds.filter((id) => !foundIds.includes(id));
  missingIds.forEach((id) => {
    errors.push(`Report ${id} not found or already deleted`);
  });

  return { valid: errors.length === 0, errors, eligibleIds };
}

export async function validateBulkDelete(reportIds) {
  const reports = await prisma.plantingReport.findMany({
    where: { id: { in: reportIds }, isDeleted: false },
    select: { id: true, farmerName: true, state: true }
  });

  const eligibleIds = reports.map((r) => r.id);
  const foundIds = reports.map((r) => r.id);
  const missingIds = reportIds.filter((id) => !foundIds.includes(id));
  const errors = missingIds.map((id) => `Report ${id} not found or already deleted`);

  return { valid: errors.length === 0, errors, eligibleIds };
}

// ==================== EXPORTS ====================

export default {
  calculateYield,
  calculateExpectedHarvest,
  validateStateTransitionData,
  updateStateHistory,
  buildReportQuery,
  buildDeletedReportsQuery,
  calculatePagination,
  getPaginationParams,
  daysUntilPermanentDelete,
  formatDate,
  createAuditEntry,
  getStateDisplayName,
  validateBulkArchive,
  validateBulkDelete
};
