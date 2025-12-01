import prisma from '../../../config/database.js';

/**
 * POST /api/eic/request/bulk-action
 * 
 * Perform bulk actions on multiple requests
 * Supports: approve, reject, delete
 * 
 * Body:
 * - action: 'approve' | 'reject' | 'delete'
 * - requestIds: string[] (array of request IDs)
 * - reason?: string (optional reason for rejection)
 */
export default async function bulkAction(req, res) {
  try {
    const { action, requestIds, reason } = req.body;
    const adminId = req.user.id;

    // Validation
    if (!action || !requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Action and requestIds array are required'
      });
    }

    const validActions = ['approve', 'reject', 'delete'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`
      });
    }

    let result;
    const timestamp = new Date();

    switch (action) {
      case 'approve':
        // Update status to Approved and set admin
        result = await prisma.itemTransaction.updateMany({
          where: {
            id: { in: requestIds },
            status: 'Pending', // Only approve pending requests
            itemStack: { status: 'EIC' }
          },
          data: {
            status: 'Approved',
            adminId: adminId,
            statusChangedAt: timestamp,
            statusChangeReason: 'Bulk approved'
          }
        });
        break;

      case 'reject':
        // Update status to Rejected
        result = await prisma.itemTransaction.updateMany({
          where: {
            id: { in: requestIds },
            status: 'Pending', // Only reject pending requests
            itemStack: { status: 'EIC' }
          },
          data: {
            status: 'Rejected',
            adminId: adminId,
            statusChangedAt: timestamp,
            statusChangeReason: reason || 'Bulk rejected'
          }
        });
        break;

      case 'delete':
        // Delete requests (only Pending, Rejected, Cancelled)
        result = await prisma.itemTransaction.deleteMany({
          where: {
            id: { in: requestIds },
            status: { in: ['Pending', 'Rejected', 'Cancelled'] },
            itemStack: { status: 'EIC' }
          }
        });
        break;
    }

    return res.status(200).json({
      success: true,
      message: `Successfully performed ${action} on ${result.count} request(s)`,
      count: result.count
    });

  } catch (error) {
    console.error('❌ [Bulk Action Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to perform bulk action',
      error: error.message
    });
  }
}
