import { PrismaClient } from '../../../prisma/generated/client.js';
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
                ['Returned', 'No_Return', 'late_return', 'No_Pickup'].includes(
                    transaction.status
                )
            ) {
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

        // Update the transaction
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

        // Log the status change
        console.log(
            `Transaction ${transactionId} status changed to ${status} by ${user.firstName} ${user.lastName} (${user.access})`
        );

        return res.status(200).json({
            success: true,
            message: 'Transaction status updated successfully',
            transaction: {
                id: updatedTransaction.id,
                itemName: updatedTransaction.itemStack.item.name,
                requestor: `${updatedTransaction.account.firstName} ${updatedTransaction.account.lastName}`,
                quantity: updatedTransaction.quantity,
                status: updatedTransaction.status,
                pickupDate: updatedTransaction.pickupDate,
                returnDate: updatedTransaction.returnDate,
                requestNote: updatedTransaction.requestNote,
                updatedBy: updatedTransaction.admin
                    ? `${updatedTransaction.admin.firstName} ${updatedTransaction.admin.lastName}`
                    : 'User',
                updatedAt: updatedTransaction.updatedAt,
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
