import { PrismaClient } from '../../../prisma/generated/client.js';
import auditLogger from '../../../Services/auditLogger.js';
const prisma = new PrismaClient();

async function setStatus(req, res) {
    try {
        const { transactionId, status } = req.body;
        const userId = req.user.id; // From JWT token

        // Validate required fields
        if (!transactionId || !status) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'transactionId and status are required',
            });
        }

        // Get user details to check access level
        const user = await prisma.account.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                access: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found',
            });
        }

        // Find the transaction
        const transaction = await prisma.itemTransaction.findUnique({
            where: {
                id: transactionId,
            },
            include: {
                itemStack: {
                    include: {
                        item: true,
                    },
                },
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        if (!transaction) {
            return res.status(404).json({
                error: 'Transaction not found',
                message: 'Item transaction not found',
            });
        }

        // Define valid statuses for Distribution (no return-related statuses)
        const validStatuses = [
            'Pending',
            'Approved',
            'Rejected',
            'No_Pickup',
            'Cancelled',
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status',
                message: `Status must be one of: ${validStatuses.join(', ')}`,
            });
        }

        // Check permissions based on user access level
        if (user.access === 'User') {
            // Regular users can only cancel their own requests
            if (transaction.accountId !== userId) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You can only modify your own requests',
                });
            }

            if (status !== 'Cancelled') {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'Regular users can only cancel their requests',
                });
            }

            // Users can only cancel pending or approved requests
            if (!['Pending', 'Approved'].includes(transaction.status)) {
                return res.status(400).json({
                    error: 'Invalid operation',
                    message: 'You can only cancel pending or approved requests',
                });
            }
        } else if (user.access === 'Admin' || user.access === 'Super_Admin') {
            // Admins can set any status, but let's add some business logic validation

            // Prevent changing already completed transactions
            if (['No_Pickup'].includes(transaction.status)) {
                return res.status(400).json({
                    error: 'Invalid operation',
                    message: 'Cannot modify completed transactions',
                });
            }

            // Prevent changing cancelled transactions
            if (transaction.status === 'Cancelled') {
                return res.status(400).json({
                    error: 'Invalid operation',
                    message: 'Cannot modify cancelled transactions',
                });
            }
        } else {
            return res.status(403).json({
                error: 'Access denied',
                message: 'Insufficient permissions',
            });
        }

        // Prepare update data
        const updateData = {
            status: status,
            updatedAt: new Date(),
        };

        // If admin is updating the status, record who did it
        if (user.access === 'Admin' || user.access === 'Super_Admin') {
            updateData.adminId = userId;
        }

        // Handle stack quantity adjustments based on status change
        let stackQuantityChange = 0;
        const currentStatus = transaction.status;
        const newStatus = status;

        // Distribution-specific logic:
        // Approved - Subtract (items are distributed out)
        // Rejected - None (request denied, no items moved)
        // Cancelled - (Approved? Add back) (Pending? None)
        // No_Pickup - Add back (items not picked up, return to stock)

        if (newStatus === 'Approved') {
            // Subtract quantity when approved (items are distributed out)
            stackQuantityChange = -transaction.quantity;
        } else if (newStatus === 'Rejected') {
            // No change for rejected
            stackQuantityChange = 0;
        } else if (newStatus === 'No_Pickup') {
            // Add quantity back when no pickup (items return to stock)
            stackQuantityChange = transaction.quantity;
        } else if (newStatus === 'Cancelled') {
            // Handle cancellation logic
            if (currentStatus === 'Approved') {
                // If cancelling an approved transaction, add quantity back
                stackQuantityChange = transaction.quantity;
            } else if (currentStatus === 'Pending') {
                // If cancelling a pending transaction, no quantity change needed
                stackQuantityChange = 0;
            } else {
                // For other statuses, no change
                stackQuantityChange = 0;
            }
        }

        // Update the transaction and stack quantity in a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Update the transaction status
            const updatedTransaction = await prisma.itemTransaction.update({
                where: {
                    id: transactionId,
                },
                data: updateData,
                include: {
                    itemStack: {
                        include: {
                            item: true,
                        },
                    },
                    account: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });

            // Log the distribution request status change only for admin actions
            if (user.access === 'Admin' || user.access === 'Super_Admin') {
                const auditAction =
                    status === 'Approved'
                        ? 'DISTRIBUTION_REQUEST_APPROVE'
                        : 'DISTRIBUTION_REQUEST_REJECT';
                const isApproval = status === 'Approved';

                await auditLogger.log({
                    adminId: userId,
                    action: auditAction,
                    targetType: 'Distribution',
                    targetId: updatedTransaction.id,
                    targetName: updatedTransaction.itemStack.item.name,
                    details: `${
                        isApproval ? 'Approved' : 'Rejected'
                    } distribution request for ${
                        updatedTransaction.itemStack.item.name
                    }`,
                    metadata: {
                        action: isApproval
                            ? 'request_approved'
                            : 'request_rejected',
                        itemName: updatedTransaction.itemStack.item.name,
                        requestedQuantity: updatedTransaction.quantity,
                        availableStock: transaction.itemStack.quantity,
                        requestorInfo: `${updatedTransaction.account.firstName} ${updatedTransaction.account.lastName}`,
                        previousStatus: currentStatus,
                        newStatus: newStatus,
                        rejectionReason: !isApproval
                            ? 'Admin rejection'
                            : undefined,
                    },
                    req: req,
                });
            }

            // Update stack quantity if there's a change
            if (stackQuantityChange !== 0) {
                const currentStackQuantity = transaction.itemStack.quantity;
                const newStackQuantity =
                    currentStackQuantity + stackQuantityChange;

                // Ensure quantity doesn't go negative
                if (newStackQuantity < 0) {
                    throw new Error(
                        `Insufficient stock. Current quantity: ${currentStackQuantity}, Requested: ${Math.abs(
                            stackQuantityChange
                        )}`
                    );
                }

                await prisma.itemStack.update({
                    where: {
                        id: transaction.itemStackId,
                    },
                    data: {
                        quantity: newStackQuantity,
                        updatedAt: new Date(),
                    },
                });
            }

            return updatedTransaction;
        });

        return res.status(200).json({
            success: true,
            message: 'Distribution transaction status updated successfully',
            transaction: {
                id: result.id,
                itemName: result.itemStack.item.name,
                requestor: `${result.account.firstName} ${result.account.lastName}`,
                quantity: result.quantity,
                status: result.status,
                pickupDate: result.pickupDate,
                returnDate: null, // Always null for distribution items
                requestNote: result.requestNote,
                updatedBy: result.admin
                    ? `${result.admin.firstName} ${result.admin.lastName}`
                    : 'User',
                updatedAt: result.updatedAt,
                stackQuantityChange: stackQuantityChange, // Include the quantity change for debugging
            },
        });
    } catch (error) {
        console.error('Error updating distribution transaction status:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Resource not found',
                message: 'Transaction not found',
            });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A conflict occurred while updating the transaction',
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message:
                'Failed to update transaction status. Please try again later.',
        });
    }
}

export default setStatus;
