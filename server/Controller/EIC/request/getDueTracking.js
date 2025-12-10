import prisma from '../../../config/database.js';

/**
 * Get due date tracking for EIC items
 * Filters: all, overdue, today, week, nextWeek
 * Returns grouped data with urgency levels
 */
async function getDueTracking(req, res) {
    try {
        const { filter = 'all', sortBy = 'dueDate' } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let whereClause = {
            status: { in: ['Borrowed', 'late_pickup', 'late_return'] }, // Items currently with users
            returnDate: { not: null }
        };
        
        // Apply filter based on query parameter
        if (filter === 'overdue') {
            whereClause.returnDate = { lt: today };
        } else if (filter === 'today') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            whereClause.returnDate = { 
                gte: today, 
                lt: tomorrow 
            };
        } else if (filter === 'week') {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            whereClause.returnDate = { 
                gte: today, 
                lte: nextWeek 
            };
        } else if (filter === 'nextWeek') {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const twoWeeks = new Date(today);
            twoWeeks.setDate(twoWeeks.getDate() + 14);
            whereClause.returnDate = { 
                gt: nextWeek, 
                lte: twoWeeks 
            };
        }
        
        // Fetch transactions with related data
        const transactions = await prisma.itemTransaction.findMany({
            where: whereClause,
            include: {
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        email: true,
                        contactNumber: true
                    }
                },
                itemStack: {
                    select: {
                        id: true,
                        date_limit: true,
                        quantity: true,
                        item: {
                            select: {
                                id: true,
                                name: true,
                                category: true,
                                picture: true
                            }
                        }
                    }
                }
            },
            orderBy: sortBy === 'dueDate' 
                ? { returnDate: 'asc' }
                : sortBy === 'user'
                ? { account: { surname: 'asc' } }
                : { createdAt: 'desc' }
        });
        
        // Enrich transactions with calculated fields
        const enrichedTransactions = transactions.map(transaction => {
            // Use adjustedReturnDate if available (for late pickups), otherwise use returnDate
            const dueDate = new Date(transaction.adjustedReturnDate || transaction.returnDate);
            dueDate.setHours(0, 0, 0, 0);
            
            const diffTime = dueDate - today;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            // Determine urgency level
            let urgency = 'normal';
            if (diffDays < 0) urgency = 'critical';
            else if (diffDays === 0) urgency = 'urgent';
            else if (diffDays <= 3) urgency = 'warning';
            
            return {
                id: transaction.id,
                itemId: transaction.itemStack.item.id,
                itemName: transaction.itemStack.item.name,
                itemCategory: transaction.itemStack.item.category,
                itemImage: transaction.itemStack.item.picture,
                itemDateLimit: transaction.itemStack.date_limit,
                userId: transaction.account.id,
                userName: `${transaction.account.firstName} ${transaction.account.surname}`,
                userEmail: transaction.account.email,
                userContact: transaction.account.contactNumber,
                quantity: transaction.quantity,
                pickupDate: transaction.pickupDate,
                returnDate: transaction.returnDate,
                requestNote: transaction.requestNote,
                createdAt: transaction.createdAt,
                daysUntilDue: diffDays,
                isOverdue: diffDays < 0,
                isDueToday: diffDays === 0,
                urgency,
                urgencyColor: urgency === 'critical' ? 'red' :
                             urgency === 'urgent' ? 'orange' :
                             urgency === 'warning' ? 'yellow' : 'blue'
            };
        });
        
        // Group transactions by urgency
        const grouped = {
            overdue: enrichedTransactions.filter(t => t.isOverdue),
            dueToday: enrichedTransactions.filter(t => t.isDueToday),
            dueThisWeek: enrichedTransactions.filter(t => 
                t.daysUntilDue > 0 && t.daysUntilDue <= 7
            ),
            dueNextWeek: enrichedTransactions.filter(t => 
                t.daysUntilDue > 7 && t.daysUntilDue <= 14
            ),
            dueLater: enrichedTransactions.filter(t => 
                t.daysUntilDue > 14
            )
        };
        
        // Calculate summary statistics
        const counts = {
            total: enrichedTransactions.length,
            overdue: grouped.overdue.length,
            dueToday: grouped.dueToday.length,
            dueThisWeek: grouped.dueThisWeek.length,
            dueNextWeek: grouped.dueNextWeek.length,
            dueLater: grouped.dueLater.length
        };
        
        const itemsList = enrichedTransactions.slice(0, 5).map(t => 
            `  - ${t.itemName} (${t.userName}, Due: ${t.dueDate}, Status: ${t.status})`
        ).join('\n');
        
        console.log(`\n${'='.repeat(60)}\n📋 TEST 1.1: DUE TRACKING DASHBOARD\n${'='.repeat(60)}\nFilter: ${filter}\nSort By: ${sortBy}\nToday: ${today.toLocaleDateString()}\nStatuses Queried: Borrowed, late_pickup, late_return\nTotal Items: ${counts.total}\nOverdue: ${counts.overdue}\nDue Today: ${counts.dueToday}\nDue This Week: ${counts.dueThisWeek}\nDue Next Week: ${counts.dueNextWeek}\nDue Later: ${counts.dueLater}\nSample Items (first 5):\n${itemsList || '  (none)'}\n${'='.repeat(60)}\n✅ COPY THIS LOG TO CHECKLIST TEST 1.1\n${'='.repeat(60)}\n`);
        
        return res.json({
            success: true,
            data: {
                all: enrichedTransactions,
                grouped,
                counts
            }
        });
        
    } catch (error) {
        console.error('❌ [getDueTracking Error]:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch due tracking data',
            message: error.message
        });
    }
}

export default getDueTracking;
