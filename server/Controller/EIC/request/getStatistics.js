import prisma from '../../../config/database.js';

/**
 * GET /api/eic/request/statistics
 * 
 * Returns archive statistics for dashboard display
 * Calculates:
 * - Total archived items
 * - Breakdown by status
 * - Late return rate
 * - No pickup rate
 * - Average days overdue
 */
export default async function getStatistics(req, res) {
  try {
    // Get all archived requests (completed states) - ONLY for EIC stacks
    // late_return is NOW archived - means item has been returned late
    const archivedStatuses = ['Rejected', 'Returned', 'late_return', 'No_Return', 'No_Pickup', 'Cancelled'];
    
    const archivedRequests = await prisma.itemTransaction.findMany({
      where: {
        status: {
          in: archivedStatuses
        },
        itemStack: {
          status: 'EIC' // Only count EIC (Equipment in Circulation) transactions
        }
      },
      select: {
        id: true,
        status: true,
        pickupDate: true,
        returnDate: true,
        actual_pickup: true,
        actual_return: true,
        statusChangedAt: true,
        createdAt: true
      }
    });

    const total = archivedRequests.length;

    // Count by status
    const byStatus = archivedStatuses.reduce((acc, status) => {
      acc[status] = archivedRequests.filter(req => req.status === status).length;
      return acc;
    }, {});

    // TEST 2.2: Statistics API
    console.log(`
${'='.repeat(60)}
📋 TEST 2.2: STATISTICS API (ARCHIVE DATA)
${'='.repeat(60)}
Total archived: ${total}
Breakdown by status:
${JSON.stringify(byStatus, null, 2)}
Archived statuses used: ${archivedStatuses.join(', ')}
Sample IDs: ${archivedRequests.slice(0, 5).map(r => r.id).join(', ')}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 2.2
${'='.repeat(60)}
`);

    // Calculate late return rate
    const returnedRequests = archivedRequests.filter(req => 
      req.status === 'Returned' || req.status === 'late_return' || req.status === 'No_Return'
    );
    const lateReturns = returnedRequests.filter(req => {
      // Items with status 'late_return' are already counted as late
      if (req.status === 'late_return') return true;
      
      // For 'Returned' status, check if actual_return was after due date
      if (req.status === 'Returned' && req.actual_return && req.returnDate) {
        const dueDate = req.adjustedReturnDate || req.returnDate;
        const actualReturn = new Date(req.actual_return);
        const returnDeadline = new Date(dueDate);
        return actualReturn > returnDeadline;
      }
      
      return false;
    });
    const lateReturnRate = returnedRequests.length > 0 
      ? (lateReturns.length / returnedRequests.length) 
      : 0;

    // Calculate no pickup rate
    const approvedRequests = archivedRequests.filter(req => 
      req.status === 'No_Pickup' || req.status === 'Returned' || req.status === 'late_return' || req.status === 'No_Return'
    );
    const noPickups = archivedRequests.filter(req => req.status === 'No_Pickup');
    const noPickupRate = approvedRequests.length > 0 
      ? (noPickups.length / approvedRequests.length) 
      : 0;

    // Calculate average days overdue (for late returns and no returns)
    const overdueRequests = archivedRequests.filter(req => {
      if (req.status !== 'late_return' && req.status !== 'No_Return' && req.status !== 'Returned') {
        return false;
      }
      if (!req.returnDate) return false;
      const returnDate = new Date(req.returnDate);
      const actualReturn = req.actual_return ? new Date(req.actual_return) : new Date(req.statusChangedAt);
      return actualReturn > returnDate;
    });

    let totalDaysOverdue = 0;
    overdueRequests.forEach(req => {
      const returnDate = new Date(req.returnDate);
      const actualReturn = req.actual_return ? new Date(req.actual_return) : new Date(req.statusChangedAt);
      const diffTime = Math.abs(actualReturn - returnDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDaysOverdue += diffDays;
    });

    const avgDaysOverdue = overdueRequests.length > 0 
      ? (totalDaysOverdue / overdueRequests.length) 
      : 0;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentlyArchived = archivedRequests.filter(req => {
      const changedAt = new Date(req.statusChangedAt || req.createdAt);
      return changedAt >= thirtyDaysAgo;
    }).length;

    return res.status(200).json({
      success: true,
      statistics: {
        total,
        byStatus,
        lateReturnRate: parseFloat(lateReturnRate.toFixed(3)),
        noPickupRate: parseFloat(noPickupRate.toFixed(3)),
        avgDaysOverdue: parseFloat(avgDaysOverdue.toFixed(1)),
        recentActivity: {
          last30Days: recentlyArchived
        }
      }
    });

  } catch (error) {
    console.error('Error fetching EIC statistics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
}
