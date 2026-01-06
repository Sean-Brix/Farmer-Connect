// PrismaClient import removed - using centralized db
import prisma from '../../../config/database.js';
import auditLogger from '../../../Services/auditLogger.js';
import { recordDistribution, removeFromWaitlist } from '../../../Services/distributionQuotaService.js';
import { createNotification } from '../../../Services/notificationService.js';
import { transferBetweenStacks } from '../../../Utils/stackTransfer.js';
// Using centralized prisma instance

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
                surname: true,
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
                        item: {
                            include: {
                                seedVariety: true, // Include seed variety for planting deadline calculation
                            },
                        },
                    },
                },
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
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

        // Define valid statuses for Distribution (aligned with planting report states)
        const validStatuses = [
            'Pending',
            'Approved',
            'Picked_Up',
            'late_pickup',
            'Planted',
            'Harvested',
            'Rejected',
            'No_Pickup',
            'Cancelled',
            'Archived',
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status',
                message: `Status must be one of: ${validStatuses.join(', ')}`,
            });
        }

        // Modification #3: Status transition validation (aligned with planting reports)
        const validTransitions = {
            Pending: ['Approved', 'Rejected', 'Cancelled'],
            Approved: ['Picked_Up', 'late_pickup', 'No_Pickup', 'Cancelled'],
            Picked_Up: ['Planted'],
            late_pickup: ['Planted'],
            Planted: ['Harvested'],
            Harvested: ['Archived'],
            Rejected: [],
            No_Pickup: [],
            Cancelled: [],
            Archived: []
        };

        const allowedTransitions = validTransitions[transaction.status] || [];
        if (status && !allowedTransitions.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status transition',
                message: `Cannot change from "${transaction.status}" to "${status}"`,
                allowedTransitions
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

        // Modification #2: Smart pickup detection (reuse EIC pattern)
        if (transaction.status === 'Approved' && ['Picked_Up', 'late_pickup'].includes(status)) {
            const now = new Date();
            const pickupDate = new Date(transaction.pickupDate);
            
            updateData.actual_pickup = now;
            
            // Calculate planting report deadline based on seed variety's planting window
            const seedVariety = transaction.itemStack?.item?.seedVariety;
            const plantingWindowDays = seedVariety?.plantingWindow || 30; // Default 30 days if not specified
            
            if (now > pickupDate) {
                // LATE PICKUP
                const daysLate = Math.ceil((now - pickupDate) / (1000 * 60 * 60 * 24));
                updateData.status = 'late_pickup';
                
                // Calculate planting deadline from actual pickup date
                const plantingDeadline = new Date(now);
                plantingDeadline.setDate(plantingDeadline.getDate() + plantingWindowDays);
                updateData.plantingReportDeadline = plantingDeadline;
                
                console.log(`⏰ Late pickup: ${daysLate} days. Planting deadline set to ${plantingDeadline} (${plantingWindowDays} days from now)`);
            } else {
                // ON-TIME PICKUP
                updateData.status = 'Picked_Up';
                
                // Calculate planting deadline from actual pickup date
                const plantingDeadline = new Date(now);
                plantingDeadline.setDate(plantingDeadline.getDate() + plantingWindowDays);
                updateData.plantingReportDeadline = plantingDeadline;
                
                console.log(`✅ On-time pickup. Planting deadline set to ${plantingDeadline} (${plantingWindowDays} days from now)`);
            }
            
            // Log pickup event
            console.log(`📦 Seeds picked up: ${transaction.itemStack.item.name} (${transaction.quantity} ${transaction.itemStack.item.unit})`);
            if (seedVariety) {
                console.log(`🌱 Seed variety: ${seedVariety.name} (${seedVariety.cropType})`);
            }
        }

        // Handle stack quantity adjustments based on status change
        let stackQuantityChange = 0;
        const currentStatus = transaction.status;
        const newStatus = status;

        // Distribution-specific logic with Reserved stack:
        // Approved - Transfer from Distributed to Reserved
        // Picked_Up - Deduct from Reserved
        // Rejected - No change
        // Cancelled - Transfer from Reserved back to Distributed (if was Approved)
        // No_Pickup - Transfer from Reserved back to Distributed

        if (newStatus === 'Approved') {
            // Transfer from Distributed to Reserved
            await transferBetweenStacks(
                prisma,
                transaction.itemStack.item.id,
                'Distributed',
                'Reserved',
                transaction.quantity
            );
        } else if (newStatus === 'Picked_Up' || newStatus === 'late_pickup') {
            // Deduct from Reserved stack ONLY (don't touch Distributed stack)
            // Find Reserved stack to deduct from
            const reservedStack = await prisma.itemStack.findFirst({
                where: {
                    itemId: transaction.itemStack.item.id,
                    status: 'Reserved'
                }
            });
            if (reservedStack) {
                await prisma.itemStack.update({
                    where: { id: reservedStack.id },
                    data: { quantity: reservedStack.quantity - transaction.quantity }
                });
            }
            // Don't set stackQuantityChange - we already handled Reserved stack above
            stackQuantityChange = 0;
        } else if (newStatus === 'Rejected') {
            // No change for rejected
            stackQuantityChange = 0;
        } else if (newStatus === 'No_Pickup') {
            // Transfer from Reserved back to Distributed
            await transferBetweenStacks(
                prisma,
                transaction.itemStack.item.id,
                'Reserved',
                'Distributed',
                transaction.quantity
            );
        } else if (newStatus === 'Cancelled') {
            // Handle cancellation logic
            if (currentStatus === 'Approved') {
                // Transfer from Reserved back to Distributed
                await transferBetweenStacks(
                    prisma,
                    transaction.itemStack.item.id,
                    'Reserved',
                    'Distributed',
                    transaction.quantity
                );
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
                            item: {
                                include: {
                                    seedVariety: true,
                                },
                            },
                        },
                    },
                    account: {
                        select: {
                            id: true,
                            firstName: true,
                            surname: true,
                            email: true,
                            client_profile: true,
                        },
                    },
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            surname: true,
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
                        requestorInfo: `${updatedTransaction.account.firstName} ${updatedTransaction.account.surname}`,
                        previousStatus: currentStatus,
                        newStatus: newStatus,
                        rejectionReason: !isApproval
                            ? 'Admin rejection'
                            : undefined,
                    },
                    req: req,
                });
            }

            // Record distribution history when approved
            if (status === 'Approved') {
                await recordDistribution(
                    updatedTransaction.accountId,
                    updatedTransaction.itemStackId,
                    updatedTransaction.quantity,
                    updatedTransaction.id
                );

                // Remove from waitlist if user was on it
                try {
                    await removeFromWaitlist(
                        updatedTransaction.accountId,
                        updatedTransaction.itemStackId
                    );
                } catch (error) {
                    // Ignore if user wasn't on waitlist
                    console.error('Note: User was not on waitlist:', error.message);
                }
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

            // Auto-create planting report on pickup if none exists
            let createdReport = null;
            const shouldCreateReport = ['Picked_Up', 'late_pickup'].includes(updateData.status);
            if (shouldCreateReport && !updatedTransaction.plantingReportId) {
                const seedVariety = updatedTransaction.itemStack.item.seedVariety;
                const varietyId = updatedTransaction.itemStack.item.seedVarietyId;

                if (varietyId && updatedTransaction.farmLocation && updatedTransaction.areaPlanted) {
                    try {
                        createdReport = await prisma.plantingReport.create({
                            data: {
                                farmerName: `${updatedTransaction.account.firstName} ${updatedTransaction.account.surname}`.trim(),
                                farmLocation: updatedTransaction.farmLocation,
                                rsbsaNumber: updatedTransaction.account.client_profile?.rsbsaNumber ?? null,
                                croppingSeasonId: null,
                                areaPlanted: updatedTransaction.areaPlanted,
                                seedClassification: 'Inbred_Certified',
                                typeOfCrop: seedVariety?.cropType || 'Rice',
                                riceIrrigation: null,
                                varietyId,
                                dateOfPlanting: null,
                                plantingMethod: updatedTransaction.plantingMethod || null,
                                cropInsurance: false,
                                harvestArea: null,
                                numberOfBags: null,
                                weightPerBag: null,
                                yieldMtPerHa: null,
                                dateOfExpectedHarvest: null,
                                distributionRequestId: updatedTransaction.id,
                                distributionItemId: updatedTransaction.itemStack.item.id,
                                distributionQuantity: updatedTransaction.quantity,
                                distributionUnit: updatedTransaction.itemStack.item.unit,
                                distributionPickupDate: updatedTransaction.actual_pickup || updatedTransaction.pickupDate,
                                requestNote: updatedTransaction.requestNote,
                                plantingReportDeadline: updatedTransaction.plantingReportDeadline,
                                state: 'Planting', // All reports start in Planting state
                                lastUpdatedBy: userId,
                            },
                        });

                        await prisma.itemTransaction.update({
                            where: { id: updatedTransaction.id },
                            data: { plantingReportId: createdReport.id },
                        });

                        updatedTransaction.plantingReportId = createdReport.id;
                        console.log(`✅ Auto-created planting report ${createdReport.id} for distribution request ${updatedTransaction.id}`);
                    } catch (createError) {
                        console.error('⚠️ Failed to auto-create planting report:', createError);
                    }
                } else {
                    console.warn(`⚠️ Skipping planting report auto-create: missing required fields (varietyId: ${varietyId}, farmLocation: ${updatedTransaction.farmLocation}, areaPlanted: ${updatedTransaction.areaPlanted})`);
                }
            }

            return { updatedTransaction, createdReport };
        });

        const updatedTransaction = result.updatedTransaction;
        const createdReport = result.createdReport;

        // Send notification to farmer about planting deadline (outside transaction)
        if (['Picked_Up', 'late_pickup'].includes(updatedTransaction.status) && updatedTransaction.plantingReportDeadline) {
            const seedVariety = updatedTransaction.itemStack?.item?.seedVariety;
            const plantingWindowDays = seedVariety?.plantingWindow || 30;
            const deadlineDate = new Date(updatedTransaction.plantingReportDeadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            await createNotification({
                accountId: updatedTransaction.accountId,
                type: 'distribution_picked_up',
                title: '🌱 Seeds Picked Up - Planting Deadline',
                message: `You have picked up ${updatedTransaction.itemStack.item.name} (${updatedTransaction.quantity} ${updatedTransaction.itemStack.item.unit}). Please plant within ${plantingWindowDays} days (by ${deadlineDate}) and submit a planting report.`,
                relatedId: updatedTransaction.id
            }).catch(err => {
                console.error('Failed to send pickup notification:', err);
                // Don't fail the request if notification fails
            });
            
            console.log(`📬 Sent planting deadline notification to user ${updatedTransaction.accountId}`);
        }

        return res.status(200).json({
            success: true,
            message: 'Distribution transaction status updated successfully',
            transaction: {
                id: updatedTransaction.id,
                itemName: updatedTransaction.itemStack.item.name,
                requestor: `${updatedTransaction.account.firstName} ${updatedTransaction.account.surname}`,
                quantity: updatedTransaction.quantity,
                status: updatedTransaction.status,
                pickupDate: updatedTransaction.pickupDate,
                returnDate: null, // Always null for distribution items
                requestNote: updatedTransaction.requestNote,
                updatedBy: updatedTransaction.admin
                    ? `${updatedTransaction.admin.firstName} ${updatedTransaction.admin.surname}`
                    : 'User',
                updatedAt: updatedTransaction.updatedAt,
                plantingReportId: updatedTransaction.plantingReportId,
                plantingReportDeadline: updatedTransaction.plantingReportDeadline,
                plantingReportCreated: createdReport?.id || null,
                farmLocation: updatedTransaction.farmLocation,
                areaPlanted: updatedTransaction.areaPlanted,
                plantingMethod: updatedTransaction.plantingMethod,
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
