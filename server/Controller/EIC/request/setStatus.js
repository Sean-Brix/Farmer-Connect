// PrismaClient import removed - using centralized db
import prisma from '../../../config/database.js';
import auditLogger from '../../../Services/auditLogger.js';
import { notifyRequestStatus } from '../../../Services/notificationService.js';
import { transferBetweenStacks } from '../../../Utils/stackTransfer.js';
// Using centralized prisma instance

async function setStatus(req, res) {
    try {
        const { transactionId, status, reason } = req.body;
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
                        item: true,
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

        // Define valid statuses
        const validStatuses = [
            'Pending',
            'Approved',
            'Borrowed',
            'late_pickup',
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
            // Note: late_return is intentionally NOT in this list - it can transition to Returned
            if (
                [
                    'Returned',
                    'No_Return',
                    'No_Pickup',
                    'Rejected',
                ].includes(transaction.status)
            ) {
                return res.status(400).json({
                    error: 'Invalid operation',
                    message: 'Cannot modify completed or rejected transactions',
                });
            }

            // Allow late_return to transition to Returned (marking overdue items as returned)
            if (transaction.status === 'late_return' && status !== 'Returned' && status !== 'No_Return') {
                return res.status(400).json({
                    error: 'Invalid operation',
                    message: 'Late return items can only be marked as Returned or No Return',
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

        // Validate status transitions
        const validTransitions = {
            Pending: ['Approved', 'Rejected', 'Cancelled'],
            Approved: ['Borrowed', 'late_pickup', 'No_Pickup', 'Cancelled'],
            Borrowed: ['Returned', 'late_return', 'No_Return', 'Cancelled'],
            late_pickup: ['Returned', 'late_return', 'No_Return', 'Cancelled'],
            // Terminal statuses cannot transition
            Returned: [],
            late_return: ['Returned', 'No_Return'], // Can correct late returns
            Rejected: [],
            No_Return: [],
            No_Pickup: [],
            Cancelled: []
        };

        const allowedTransitions = validTransitions[transaction.status] || [];
        if (!allowedTransitions.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status transition',
                message: `Cannot change status from ${transaction.status} to ${status}. Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`,
            });
        }

        // Prepare update data
        const updateData = {
            status: status,
            updatedAt: new Date(),
            statusChangedAt: new Date(),
            previousStatus: transaction.status,
        };

        // Add reason if provided
        if (reason) {
            updateData.statusChangeReason = reason;
        }

        // Set adminId for all admin actions
        if (user.access === 'Admin' || user.access === 'Super_Admin') {
            updateData.adminId = userId;
        }

        // SMART PICKUP DETECTION: Determine Borrowed vs late_pickup
        if (transaction.status === 'Approved' && (status === 'Borrowed' || status === 'late_pickup')) {
            const now = new Date();
            const pickupDate = new Date(transaction.pickupDate);
            const returnDate = transaction.returnDate ? new Date(transaction.returnDate) : null;
            
            updateData.actual_pickup = now;
            
            // Auto-determine status based on timing
            if (now > pickupDate) {
                // Late pickup
                const daysLate = Math.ceil((now - pickupDate) / (1000 * 60 * 60 * 24));
                updateData.status = 'late_pickup';
                
                // Calculate adjusted return date: give user the full borrowing period
                if (returnDate) {
                    const borrowDuration = returnDate - pickupDate; // Original duration in milliseconds
                    updateData.adjustedReturnDate = new Date(now.getTime() + borrowDuration);
                    
                    console.log(`\n${'='.repeat(60)}\n📋 TEST 3.2: LATE PICKUP DETECTION\n${'='.repeat(60)}\nTransaction ID: ${transactionId}\nItem: ${transaction.itemStack.item.name}\nUser: ${transaction.account.firstName} ${transaction.account.surname}\nEmail: ${transaction.account.email || 'N/A'}\nScheduled Pickup: ${pickupDate.toLocaleString()}\nActual Pickup: ${now.toLocaleString()}\nDays Late: ${daysLate}\nStatus: late_pickup\nOriginal Return: ${returnDate.toLocaleString()}\nAdjusted Return: ${updateData.adjustedReturnDate.toLocaleString()}\nBorrow Duration: ${Math.ceil(borrowDuration / (1000 * 60 * 60 * 24))} days\nCurrent Stock: ${transaction.itemStack.quantity}\nQuantity Requested: ${transaction.quantity}\nStock Will Be: ${transaction.itemStack.quantity - transaction.quantity}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST 3.2\n${'='.repeat(60)}\n`);
                }
            } else {
                // On-time pickup
                updateData.status = 'Borrowed';
                console.log(`\n${'='.repeat(60)}\n📋 TEST 3.1: ON-TIME PICKUP DETECTION\n${'='.repeat(60)}\nTransaction ID: ${transactionId}\nItem: ${transaction.itemStack.item.name}\nUser: ${transaction.account.firstName} ${transaction.account.surname}\nEmail: ${transaction.account.email || 'N/A'}\nScheduled Pickup: ${pickupDate.toLocaleString()}\nActual Pickup: ${now.toLocaleString()}\nStatus: Borrowed\nReturn Due: ${returnDate ? returnDate.toLocaleString() : 'N/A'}\nCurrent Stock: ${transaction.itemStack.quantity}\nQuantity Requested: ${transaction.quantity}\nStock Will Be: ${transaction.itemStack.quantity - transaction.quantity}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST 3.1\n${'='.repeat(60)}\n`);
            }
            
            // ============ TEST 3.2 DEBUG - VERIFY UPDATE DATA ============
            console.log('[TEST 3.2 DEBUG] updateData object before database:', {
                transactionId: transactionId,
                status: updateData.status,
                adjustedReturnDate: updateData.adjustedReturnDate ? updateData.adjustedReturnDate.toISOString() : null,
                actual_pickup: updateData.actual_pickup ? updateData.actual_pickup.toISOString() : null,
                pickupDate: transaction.pickupDate.toISOString(),
                returnDate: transaction.returnDate ? transaction.returnDate.toISOString() : null,
                willUpdateDB: true
            });
            // ===========================================================
        }

        // SMART RETURN DETECTION: Determine Returned vs late_return
        if (['Borrowed', 'late_pickup'].includes(transaction.status) && (status === 'Returned' || status === 'late_return')) {
            const now = new Date();
            const dueDate = transaction.adjustedReturnDate 
                ? new Date(transaction.adjustedReturnDate)
                : transaction.returnDate 
                ? new Date(transaction.returnDate)
                : null;
            
            updateData.actual_return = now;
            
            // Auto-determine status based on timing
            if (dueDate && now > dueDate) {
                // Late return
                updateData.status = 'late_return';
                const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
                console.log(`\n${'='.repeat(60)}\n📋 TEST 4.2: LATE RETURN DETECTION\n${'='.repeat(60)}\nTransaction ID: ${transactionId}\nItem: ${transaction.itemStack.item.name}\nUser: ${transaction.account.firstName} ${transaction.account.surname}\nEmail: ${transaction.account.email || 'N/A'}\nPrevious Status: ${transaction.status}\nDue Date: ${dueDate.toLocaleString()}${transaction.adjustedReturnDate ? ' (Adjusted)' : ' (Original)'}\nActual Return: ${now.toLocaleString()}\nDays Overdue: ${daysLate}\nStatus: late_return\nCurrent Stock: ${transaction.itemStack.quantity}\nQuantity Returned: ${transaction.quantity}\nStock Will Be: ${transaction.itemStack.quantity + transaction.quantity}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST 4.2\n${'='.repeat(60)}\n`);
            } else {
                // On-time return
                updateData.status = 'Returned';
                console.log(`\n${'='.repeat(60)}\n📋 TEST 4.1: ON-TIME RETURN DETECTION\n${'='.repeat(60)}\nTransaction ID: ${transactionId}\nItem: ${transaction.itemStack.item.name}\nUser: ${transaction.account.firstName} ${transaction.account.surname}\nEmail: ${transaction.account.email || 'N/A'}\nPrevious Status: ${transaction.status}\nDue Date: ${dueDate ? dueDate.toLocaleString() : 'N/A'}${transaction.adjustedReturnDate ? ' (Adjusted)' : ''}\nActual Return: ${now.toLocaleString()}\nStatus: Returned\nCurrent Stock: ${transaction.itemStack.quantity}\nQuantity Returned: ${transaction.quantity}\nStock Will Be: ${transaction.itemStack.quantity + transaction.quantity}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST 4.1\n${'='.repeat(60)}\n`);
            }
            
            // ============ TEST 4.2 DEBUG - VERIFY DUE DATE LOGIC ============
            console.log('[TEST 4.2 DEBUG] Return detection analysis:', {
                transactionId: transactionId,
                currentTime: now.toISOString(),
                adjustedReturnDate: transaction.adjustedReturnDate ? new Date(transaction.adjustedReturnDate).toISOString() : null,
                returnDate: transaction.returnDate ? new Date(transaction.returnDate).toISOString() : null,
                dueDateUsed: dueDate ? dueDate.toISOString() : null,
                isLate: dueDate && now > dueDate,
                statusDecision: updateData.status,
                previousStatus: transaction.status
            });
            // =================================================================
        }

        // Set actual_return timestamp for No_Return
        if (status === 'No_Return') {
            updateData.actual_return = new Date();
        }

        const currentStatus = transaction.status;
        const newStatus = updateData.status || status; // Use smart-detected status

        // ===================================================
        // RESERVED STACK MANAGEMENT (Proper Stack Tracking)
        // ===================================================
        // Approved: Transfer from EIC to Reserved
        if (newStatus === 'Approved' && currentStatus === 'Pending') {
            await transferBetweenStacks(
                prisma,
                transaction.itemStack.item.id,
                'EIC',
                'Reserved',
                transaction.quantity
            );
            console.log(`🔒 Reserved ${transaction.quantity} units: EIC → Reserved`);
        }

        // Pickup: Deduct from Reserved (borrowed/late_pickup)
        if (['Borrowed', 'late_pickup'].includes(newStatus) && currentStatus === 'Approved') {
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
                console.log(`📦 Deducted from Reserved: ${transaction.quantity} units`);
            }
        }

        // No Pickup: Transfer from Reserved back to EIC
        if (newStatus === 'No_Pickup' && currentStatus === 'Approved') {
            await transferBetweenStacks(
                prisma,
                transaction.itemStack.item.id,
                'Reserved',
                'EIC',
                transaction.quantity
            );
            console.log(`🔓 Released reservation: Reserved → EIC`);
        }

        // Cancelled before pickup: Transfer from Reserved back to EIC
        if (newStatus === 'Cancelled' && currentStatus === 'Approved') {
            await transferBetweenStacks(
                prisma,
                transaction.itemStack.item.id,
                'Reserved',
                'EIC',
                transaction.quantity
            );
            console.log(`🔓 Cancelled - returned: Reserved → EIC`);
        }

        // Cancelled after pickup: Restore to EIC (item returned)
        if (newStatus === 'Cancelled' && ['Borrowed', 'late_pickup'].includes(currentStatus)) {
            const eicStack = await prisma.itemStack.findFirst({
                where: {
                    itemId: transaction.itemStack.item.id,
                    status: 'EIC'
                }
            });
            if (eicStack) {
                await prisma.itemStack.update({
                    where: { id: eicStack.id },
                    data: { quantity: eicStack.quantity + transaction.quantity }
                });
                console.log(`🔙 Restored to EIC: ${transaction.quantity} units`);
            }
        }
        // ===================================================

        // Handle stock action logging
        let stackQuantityChange = 0;
        let stockAction = 'NO CHANGE';

        // Set stock action based on status changes (for logging purposes)
        if (['Returned', 'late_return'].includes(newStatus) && ['Borrowed', 'late_pickup'].includes(currentStatus)) {
            stockAction = `RESTORE ${transaction.quantity} units`;
        }

        // TEST 6.1, 6.2, 6.3: Stock Management Logging
        const testNumber = stockAction.includes('DEDUCT') ? '6.2' : stockAction.includes('RESTORE') ? '6.3' : '6.1';
        console.log(`
${'='.repeat(60)}
📋 TEST ${testNumber}: STOCK MANAGEMENT - ${stockAction}
${'='.repeat(60)}
Transaction ID: ${transactionId}
Item: ${transaction.itemStack.item.name}
Current Status: ${currentStatus}
New Status: ${newStatus}
Current Stock: ${transaction.itemStack.quantity}
Stock Change: ${stackQuantityChange > 0 ? '+' : ''}${stackQuantityChange}
New Stock Will Be: ${transaction.itemStack.quantity + stackQuantityChange}
Action: ${stockAction}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST ${testNumber}
${'='.repeat(60)}
`);

        // ============ TEST 4.2 DEBUG - VERIFY STOCK RESTORATION ============
        console.log('[TEST 4.2 DEBUG] Stock management calculation:', {
            transactionId: transactionId,
            currentStatus: currentStatus,
            newStatus: newStatus,
            itemName: transaction.itemStack.item.name,
            currentStock: transaction.itemStack.quantity,
            calculatedStockChange: stackQuantityChange,
            willUpdateStock: stackQuantityChange !== 0,
            action: stockAction,
            expectedNewStock: transaction.itemStack.quantity + stackQuantityChange
        });
        // ====================================================================

        // Set stock action text for various cancellation scenarios
        if (newStatus === 'Cancelled' && currentStatus === 'Approved') {
            stockAction = 'Reserved → EIC (cancelled before pickup)';
        }

        if (newStatus === 'Cancelled' && ['Borrowed', 'late_pickup'].includes(currentStatus)) {
            stockAction = `RESTORE ${transaction.quantity} units to EIC (cancelled after pickup)`;
        }

        if (newStatus === 'Cancelled' && currentStatus === 'Pending') {
            stockAction = 'NO CHANGE (cancelled from pending)';
        }

        if (newStatus === 'No_Return') {
            stockAction = 'NO CHANGE (item not returned)';
            console.log(`📦 No stock restoration - item marked as not returned`);
        }

        if (newStatus === 'Rejected') {
            stockAction = 'NO CHANGE (rejected)';
        }
        
        if (newStatus === 'No_Pickup' && currentStatus === 'Approved') {
            stockAction = 'Reserved → EIC (no pickup)';
        }
        
        if (newStatus === 'Approved' && currentStatus === 'Pending') {
            stockAction = `EIC → Reserved (${transaction.quantity} units)`;
        }
        
        if (['Borrowed', 'late_pickup'].includes(newStatus) && currentStatus === 'Approved') {
            stockAction = `DEDUCT ${transaction.quantity} units from Reserved`;
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
                            surname: true,
                            email: true,
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

            // Note: Stack updates now handled by transferBetweenStacks utility
            // Only logging remaining for audit trail
            if (stackQuantityChange !== 0) {
                console.log(`📊 Stock action performed: ${stockAction}`);
            }

            return updatedTransaction;
        });
        
        // ============ TEST 3.2 & 4.2 DEBUG - VERIFY DATABASE UPDATE ============
        console.log('[DATABASE UPDATE] Transaction updated successfully:', {
            transactionId: result.id,
            statusUpdated: result.status,
            adjustedReturnDateSaved: result.adjustedReturnDate ? result.adjustedReturnDate.toISOString() : null,
            actual_pickup: result.actual_pickup ? result.actual_pickup.toISOString() : null,
            actual_return: result.actual_return ? result.actual_return.toISOString() : null,
            stockChangeApplied: stackQuantityChange,
            committedToDB: true
        });
        // ========================================================================

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
            targetName: `${result.itemStack.item.name} (${result.account.firstName} ${result.account.surname})`,
            details: `Changed EIC request status to ${status} for ${result.itemStack.item.name} requested by ${result.account.firstName} ${result.account.surname}`,
            metadata: {
                action: 'eic_request_status_changed',
                requestId: result.id,
                itemName: result.itemStack.item.name,
                requestorName: `${result.account.firstName} ${result.account.surname}`,
                requestorId: result.account.id,
                quantity: result.quantity,
                previousStatus: transaction.status,
                newStatus: status,
                itemStackId: result.itemStackId,
                inventoryItemId: result.itemStack.item.id,
            },
            req: req,
        });

        // Send notification for approved/rejected status
        if (status === 'Approved' || status === 'Rejected') {
            await notifyRequestStatus(
                result.account.id,
                status === 'Approved',
                result.itemStack.item.name,
                result.id
            );
        }

        // ============ TEST 3.2 & 4.2 DEBUG - VERIFY RESPONSE INCLUDES FIELDS ============
        console.log('[RESPONSE TO CLIENT] Sending response:', {
            transactionId: result.id,
            status: result.status,
            adjustedReturnDate: result.adjustedReturnDate ? result.adjustedReturnDate.toISOString() : null,
            returnDate: result.returnDate ? result.returnDate.toISOString() : null,
            actual_pickup: result.actual_pickup ? result.actual_pickup.toISOString() : null,
            actual_return: result.actual_return ? result.actual_return.toISOString() : null,
            includesAdjustedDate: !!result.adjustedReturnDate,
            responseComplete: true
        });
        // =================================================================================
        
        return res.status(200).json({
            success: true,
            message: 'Transaction status updated successfully',
            transaction: {
                id: result.id,
                itemName: result.itemStack.item.name,
                requestor: `${result.account.firstName} ${result.account.surname}`,
                quantity: result.quantity,
                status: result.status,
                pickupDate: result.pickupDate,
                returnDate: result.returnDate,
                adjustedReturnDate: result.adjustedReturnDate, // For late pickup adjusted due date
                actual_pickup: result.actual_pickup, // For actual pickup timestamp
                actual_return: result.actual_return, // For actual return timestamp
                requestNote: result.requestNote,
                updatedBy: result.admin
                    ? `${result.admin.firstName} ${result.admin.surname}`
                    : 'User',
                updatedAt: result.updatedAt,
                stackQuantityChange: stackQuantityChange,
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
