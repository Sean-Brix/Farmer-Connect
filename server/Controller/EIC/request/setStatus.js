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

        // Define valid statuses
        const validStatuses = [
            'Pending',
            'Approved',
            'Rejected',
            'Returned',
            'No_Return',
            'late_return',
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
            if (
                [
                    'Returned',
                    'No_Return',
                    'late_return',
                    'No_Pickup',
                    'Rejected',
                ].includes(transaction.status)
            ) {
                return res.status(400).json({
                    error: 'Invalid operation',
                    message: 'Cannot modify completed or rejected transactions',
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

        if (newStatus === 'Approved') {
            // Subtract quantity when approved (items are taken out of circulation)
            stackQuantityChange = -transaction.quantity;
        } else if (newStatus === 'Rejected') {
            // No change for rejected
            stackQuantityChange = 0;
        } else if (
            ['Returned', 'late_return', 'No_Pickup'].includes(newStatus)
        ) {
            // Add quantity back when returned, late return, or no pickup
            stackQuantityChange = transaction.quantity;
        } else if (newStatus === 'No_Return') {
            // No change for no return (items are permanently lost)
            stackQuantityChange = 0;
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

        // Log the EIC request status change
        const auditAction =
            status === 'Approved'
                ? 'EIC_REQUEST_APPROVE'
                : status === 'Rejected'
                ? 'EIC_REQUEST_REJECT'
                : status === 'No_Pickup'
                ? 'EIC_REQUEST_NO_PICKUP'
                : 'EIC_STATUS_CHANGE';

        await auditLogger.log({
            adminId: req.user?.id,
            action: auditAction,
            targetType: 'EIC_Request',
            targetId: result.id,
            targetName: `${result.itemStack.item.name} (${result.account.firstName} ${result.account.lastName})`,
            details: `Changed EIC request status to ${status} for ${result.itemStack.item.name} requested by ${result.account.firstName} ${result.account.lastName}`,
            metadata: {
                action: 'eic_request_status_changed',
                requestId: result.id,
                itemName: result.itemStack.item.name,
                requestorName: `${result.account.firstName} ${result.account.lastName}`,
                requestorId: result.account.id,
                quantity: result.quantity,
                previousStatus: transaction.status,
                newStatus: status,
                itemStackId: result.itemStackId,
                inventoryItemId: result.itemStack.item.id,
            },
            req: req,
        });

        return res.status(200).json({
            success: true,
            message: 'Transaction status updated successfully',
            transaction: {
                id: result.id,
                itemName: result.itemStack.item.name,
                requestor: `${result.account.firstName} ${result.account.lastName}`,
                quantity: result.quantity,
                status: result.status,
                pickupDate: result.pickupDate,
                returnDate: result.returnDate,
                requestNote: result.requestNote,
                updatedBy: result.admin
                    ? `${result.admin.firstName} ${result.admin.lastName}`
                    : 'User',
                updatedAt: result.updatedAt,
                stackQuantityChange: stackQuantityChange, // Include the quantity change for debugging
            },
        });
    } catch (error) {
        console.error('Error updating transaction status:', error);

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
