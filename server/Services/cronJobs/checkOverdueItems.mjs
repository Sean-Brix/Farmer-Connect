import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { notifyItemOverdue } from '../notificationService.js';

const prisma = new PrismaClient();

/**
 * Cron job to automatically update overdue EIC transactions to 'late_return' status
 * and auto-archive severely overdue borrowed items
 * Runs daily at 1:00 AM
 */
const checkOverdueItems = cron.schedule('0 1 * * *', async () => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to midnight for accurate day comparison

    // ===== PART 1: Mark borrowed items as late_return =====
    // Find items WITH USERS (Borrowed or late_pickup) that are past return date
    const overdueTransactions = await prisma.itemTransaction.findMany({
      where: {
        status: { in: ['Borrowed', 'late_pickup'] }, // Items currently with users
        OR: [
          // Check adjustedReturnDate if it exists (for late pickups)
          {
            adjustedReturnDate: { not: null },
            adjustedReturnDate: { lt: now }
          },
          // Otherwise check regular returnDate
          {
            adjustedReturnDate: null,
            returnDate: { not: null },
            returnDate: { lt: now }
          }
        ]
      },
      select: {
        id: true,
        returnDate: true,
        account: {
          select: {
            id: true,
            user_fname: true,
            user_lname: true,
            email: true
          }
        },
        itemStack: {
          select: {
            item: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (overdueTransactions.length > 0) {
      console.error(`[CRON - ${now.toISOString()}] Found ${overdueTransactions.length} overdue borrowed item(s). Updating status...`);

      // TEST 7.1: Cron Job Part 1 (Mark borrowed items as late_return)
      console.log(`
${'='.repeat(60)}
📋 TEST 7.1: CRON JOB - MARK OVERDUE ITEMS
${'='.repeat(60)}
Execution time: ${now.toISOString()}
Found overdue items: ${overdueTransactions.length}
Items to update:
${overdueTransactions.map(t => `  - ID: ${t.id}, Item: ${t.itemStack.item.name}, Due: ${(t.adjustedReturnDate || t.returnDate).toLocaleDateString()}`).join('\n')}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 7.1
${'='.repeat(60)}
`);

      // Update all overdue transactions
      const updatePromises = overdueTransactions.map(async (transaction) => {
        // Use adjustedReturnDate if available, otherwise returnDate
        const dueDate = transaction.adjustedReturnDate || transaction.returnDate;
        const daysOverdue = Math.floor((now - new Date(dueDate)) / (1000 * 60 * 60 * 24));
        
        await prisma.itemTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'late_return',
            autoStatusChanged: true,
            statusChangedAt: new Date(),
            statusChangeReason: `Automatically marked as late return. Item was due on ${new Date(dueDate).toLocaleDateString()} (${daysOverdue} day(s) overdue).`
          }
        });

        // Send overdue notification
        await notifyItemOverdue(
          transaction.account.id,
          {
            itemName: transaction.itemStack.item.name,
            daysOverdue: daysOverdue,
            transactionId: transaction.id
          }
        );

        console.error(`[CRON - ${now.toISOString()}] Updated transaction ${transaction.id}: ${transaction.itemStack.item.name} borrowed by ${transaction.account.user_fname} ${transaction.account.user_lname} (${daysOverdue} days overdue)`);
      });

      await Promise.all(updatePromises);

      console.error(`[CRON - ${now.toISOString()}] Successfully updated ${overdueTransactions.length} overdue transaction(s) to 'late_return' status.`);
    } else {
      console.error(`[CRON - ${now.toISOString()}] No overdue borrowed items found.`);
      // TEST 7.1: Cron Job Part 1 (No overdue items)
      console.log(`
${'='.repeat(60)}
📋 TEST 7.1: CRON JOB - MARK OVERDUE ITEMS
${'='.repeat(60)}
Execution time: ${now.toISOString()}
Result: No overdue borrowed items found
Statuses checked: Borrowed, late_pickup
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 7.1
${'='.repeat(60)}
`);
    }

    // ===== PART 2: Auto-reject expired pending requests =====
    const [autoRejectEnabledSetting, autoRejectGraceDaysSetting] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_grace_days' } })
    ]);

    const autoRejectEnabled = autoRejectEnabledSetting?.value === 'true' || false;
    const autoRejectGraceDays = parseInt(autoRejectGraceDaysSetting?.value || '0', 10);

    if (autoRejectEnabled) {
      console.error(`[CRON - ${now.toISOString()}] Auto-reject is enabled. Checking pending requests with grace period of ${autoRejectGraceDays} days...`);

      const rejectCutoffDate = new Date(now);
      rejectCutoffDate.setDate(rejectCutoffDate.getDate() - autoRejectGraceDays);

      const expiredPendingRequests = await prisma.itemTransaction.findMany({
        where: {
          status: 'Pending',
          pickupDate: {
            lt: rejectCutoffDate
          }
        },
        select: {
          id: true,
          pickupDate: true,
          account: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              email: true
            }
          },
          itemStack: {
            select: {
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (expiredPendingRequests.length > 0) {
        console.error(`[CRON - ${now.toISOString()}] Found ${expiredPendingRequests.length} expired pending request(s) to auto-reject.`);

        const rejectPromises = expiredPendingRequests.map(async (transaction) => {
          const daysExpired = Math.floor((now - new Date(transaction.pickupDate)) / (1000 * 60 * 60 * 24));
          
          await prisma.itemTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'Rejected',
              autoStatusChanged: true,
              statusChangedAt: new Date(),
              statusChangeReason: `Automatically rejected. Pickup date was ${new Date(transaction.pickupDate).toLocaleDateString()} (${daysExpired} day(s) expired with ${autoRejectGraceDays} day grace period).`
            }
          });

          console.error(`[CRON - ${now.toISOString()}] Auto-rejected transaction ${transaction.id}: ${transaction.itemStack.item.name} requested by ${transaction.account.firstName} ${transaction.account.surname}`);
        });

        await Promise.all(rejectPromises);
        console.error(`[CRON - ${now.toISOString()}] Successfully auto-rejected ${expiredPendingRequests.length} expired pending request(s).`);
      } else {
        console.error(`[CRON - ${now.toISOString()}] No expired pending requests found for auto-reject.`);
      }
    } else {
      console.error(`[CRON - ${now.toISOString()}] Auto-reject is disabled.`);
    }

    // ===== PART 3: Auto-no_pickup for overdue reservations =====
    const [autoNoPickupEnabledSetting, autoNoPickupDaysSetting] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_days' } })
    ]);

    const autoNoPickupEnabled = autoNoPickupEnabledSetting?.value === 'true' || false;
    const autoNoPickupDays = parseInt(autoNoPickupDaysSetting?.value || '3', 10);

    if (autoNoPickupEnabled) {
      console.error(`[CRON - ${now.toISOString()}] Auto-no_pickup is enabled. Checking approved reservations with threshold of ${autoNoPickupDays} days...`);

      const noPickupCutoffDate = new Date(now);
      noPickupCutoffDate.setDate(noPickupCutoffDate.getDate() - autoNoPickupDays);

      const overdueReservations = await prisma.itemTransaction.findMany({
        where: {
          status: 'Approved',
          pickupDate: {
            lt: noPickupCutoffDate
          }
        },
        select: {
          id: true,
          pickupDate: true,
          quantity: true,
          account: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              email: true
            }
          },
          itemStack: {
            select: {
              id: true,
              quantity: true,
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (overdueReservations.length > 0) {
        console.error(`[CRON - ${now.toISOString()}] Found ${overdueReservations.length} overdue reservation(s) to mark as No_Pickup.`);

        const noPickupPromises = overdueReservations.map(async (transaction) => {
          const daysOverdue = Math.floor((now - new Date(transaction.pickupDate)) / (1000 * 60 * 60 * 24));
          
          // Update transaction status
          // NOTE: No stock restoration needed - stock is now deducted at pickup (Borrowed/late_pickup)
          // Since item was never picked up, stock was never deducted
          await prisma.itemTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'No_Pickup',
              autoStatusChanged: true,
              statusChangedAt: new Date(),
              statusChangeReason: `Automatically marked as No Pickup. Item was not picked up by ${new Date(transaction.pickupDate).toLocaleDateString()} (${daysOverdue} day(s) overdue, threshold: ${autoNoPickupDays} days).`
            }
          });

          console.error(`[CRON - ${now.toISOString()}] Auto-no_pickup transaction ${transaction.id}: ${transaction.itemStack.item.name} reserved by ${transaction.account.firstName} ${transaction.account.surname} (no stock change - never deducted)`);
        });

        await Promise.all(noPickupPromises);
        console.error(`[CRON - ${now.toISOString()}] Successfully marked ${overdueReservations.length} overdue reservation(s) as No_Pickup.`);
      } else {
        console.error(`[CRON - ${now.toISOString()}] No overdue reservations found for auto-no_pickup.`);
      }
    } else {
      console.error(`[CRON - ${now.toISOString()}] Auto-no_pickup is disabled.`);
    }

    // ===== PART 4: Auto-archive severely overdue borrowed items =====
    // Get auto-archive settings
    const [autoArchiveEnabledSetting, autoArchiveDaysSetting] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_days' } })
    ]);

    const autoArchiveEnabled = autoArchiveEnabledSetting?.value === 'true' || false;
    const autoArchiveDays = parseInt(autoArchiveDaysSetting?.value || '30', 10);

    if (autoArchiveEnabled) {
      console.error(`[CRON - ${now.toISOString()}] Auto-archive is enabled. Checking for items overdue by ${autoArchiveDays}+ days...`);

      // Calculate the cutoff date
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - autoArchiveDays);

      // Find items WITH USERS (Borrowed, late_pickup, or late_return) severely overdue
      const severelyOverdueItems = await prisma.itemTransaction.findMany({
        where: {
          status: { in: ['Borrowed', 'late_pickup', 'late_return'] }, // All items with users
          OR: [
            // Check adjustedReturnDate for late pickups
            {
              adjustedReturnDate: { not: null },
              adjustedReturnDate: { lt: cutoffDate }
            },
            // Check regular returnDate
            {
              adjustedReturnDate: null,
              returnDate: { not: null },
              returnDate: { lt: cutoffDate }
            }
          ]
        },
        select: {
          id: true,
          returnDate: true,
          adjustedReturnDate: true,
          account: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              email: true
            }
          },
          itemStack: {
            select: {
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (severelyOverdueItems.length > 0) {
        console.error(`[CRON - ${now.toISOString()}] Found ${severelyOverdueItems.length} severely overdue item(s) to auto-archive.`);

        const archivePromises = severelyOverdueItems.map(async (transaction) => {
          const dueDate = transaction.adjustedReturnDate || transaction.returnDate;
          const daysOverdue = Math.floor((now - new Date(dueDate)) / (1000 * 60 * 60 * 24));
          
          await prisma.itemTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'No_Return',
              autoStatusChanged: true,
              statusChangedAt: new Date(),
              statusChangeReason: `Automatically archived as No Return. Item was overdue for ${daysOverdue} days (threshold: ${autoArchiveDays} days).`
            }
          });

          console.error(`[CRON - ${now.toISOString()}] Auto-archived transaction ${transaction.id}: ${transaction.itemStack.item.name} borrowed by ${transaction.account.firstName} ${transaction.account.surname} (${daysOverdue} days overdue)`);
        });

        await Promise.all(archivePromises);

        console.error(`[CRON - ${now.toISOString()}] Successfully auto-archived ${severelyOverdueItems.length} severely overdue item(s).`);
      } else {
        console.error(`[CRON - ${now.toISOString()}] No items found for auto-archive.`);
      }
    } else {
      console.error(`[CRON - ${now.toISOString()}] Auto-archive is disabled.`);
    }

  } catch (error) {
    console.error(`[CRON ERROR - ${new Date().toISOString()}] Failed to check overdue items:`, error);
  }
}, {
  scheduled: false, // Don't start automatically, will be started manually
  timezone: "Asia/Manila" // Adjust timezone as needed
});

/**
 * Manual trigger function for testing or immediate execution
 */
const runManualCheck = async () => {
  console.error(`[MANUAL CHECK - ${new Date().toISOString()}] Running manual overdue check...`);
  
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let totalUpdated = 0;
    let totalRejected = 0;
    let totalNoPickup = 0;
    let totalArchived = 0;

    // ===== PART 1: Mark Approved items as late_return =====
    const overdueTransactions = await prisma.itemTransaction.findMany({
      where: {
        status: 'Approved',
        AND: [
          { returnDate: { not: null } },
          { returnDate: { lt: now } }
        ]
      },
      select: {
        id: true,
        returnDate: true,
        account: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true
          }
        },
        itemStack: {
          select: {
            item: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (overdueTransactions.length > 0) {
      const updatePromises = overdueTransactions.map(async (transaction) => {
        const daysOverdue = Math.floor((now - new Date(transaction.returnDate)) / (1000 * 60 * 60 * 24));
        
        await prisma.itemTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'late_return',
            autoStatusChanged: true,
            statusChangedAt: new Date(),
            statusChangeReason: `Automatically marked as late return. Item was due on ${new Date(transaction.returnDate).toLocaleDateString()} (${daysOverdue} day(s) overdue).`
          }
        });

        // Send overdue notification
        await notifyItemOverdue(
          transaction.account.id,
          {
            itemName: transaction.itemStack.item.name,
            daysOverdue: daysOverdue,
            transactionId: transaction.id
          }
        );
      });

      await Promise.all(updatePromises);
      totalUpdated = overdueTransactions.length;
      console.error(`[MANUAL CHECK] Successfully updated ${totalUpdated} overdue transaction(s).`);
    } else {
      console.error(`[MANUAL CHECK] No overdue approved items found.`);
    }

    // ===== PART 2: Auto-reject expired pending requests =====
    const [autoRejectEnabledSetting, autoRejectGraceDaysSetting] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_reject_grace_days' } })
    ]);

    const autoRejectEnabled = autoRejectEnabledSetting?.value === 'true' || false;
    const autoRejectGraceDays = parseInt(autoRejectGraceDaysSetting?.value || '0', 10);

    if (autoRejectEnabled) {
      const rejectCutoffDate = new Date(now);
      rejectCutoffDate.setDate(rejectCutoffDate.getDate() - autoRejectGraceDays);

      const expiredPendingRequests = await prisma.itemTransaction.findMany({
        where: {
          status: 'Pending',
          pickupDate: {
            lt: rejectCutoffDate
          }
        },
        select: {
          id: true,
          pickupDate: true,
          itemStack: {
            select: {
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (expiredPendingRequests.length > 0) {
        const rejectPromises = expiredPendingRequests.map(async (transaction) => {
          const daysExpired = Math.floor((now - new Date(transaction.pickupDate)) / (1000 * 60 * 60 * 24));
          
          await prisma.itemTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'Rejected',
              autoStatusChanged: true,
              statusChangedAt: new Date(),
              statusChangeReason: `Automatically rejected. Pickup date expired ${daysExpired} days ago (grace period: ${autoRejectGraceDays} days).`
            }
          });
        });

        await Promise.all(rejectPromises);
        totalRejected = expiredPendingRequests.length;
        console.error(`[MANUAL CHECK] Auto-rejected ${totalRejected} expired pending request(s).`);
      }
    }

    // ===== PART 3: Auto-no_pickup for overdue reservations =====
    const [autoNoPickupEnabledSetting, autoNoPickupDaysSetting] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_no_pickup_days' } })
    ]);

    const autoNoPickupEnabled = autoNoPickupEnabledSetting?.value === 'true' || false;
    const autoNoPickupDays = parseInt(autoNoPickupDaysSetting?.value || '3', 10);

    if (autoNoPickupEnabled) {
      const noPickupCutoffDate = new Date(now);
      noPickupCutoffDate.setDate(noPickupCutoffDate.getDate() - autoNoPickupDays);

      const overdueReservations = await prisma.itemTransaction.findMany({
        where: {
          status: 'Approved',
          pickupDate: {
            lt: noPickupCutoffDate
          }
        },
        select: {
          id: true,
          pickupDate: true,
          quantity: true,
          itemStack: {
            select: {
              id: true,
              quantity: true,
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (overdueReservations.length > 0) {
        const noPickupPromises = overdueReservations.map(async (transaction) => {
          const daysOverdue = Math.floor((now - new Date(transaction.pickupDate)) / (1000 * 60 * 60 * 24));
          
          await prisma.$transaction(async (tx) => {
            await tx.itemTransaction.update({
              where: { id: transaction.id },
              data: {
                status: 'No_Pickup',
                autoStatusChanged: true,
                statusChangedAt: new Date(),
                statusChangeReason: `Automatically marked as No Pickup. Not picked up for ${daysOverdue} days (threshold: ${autoNoPickupDays} days).`
              }
            });

            await tx.itemStack.update({
              where: { id: transaction.itemStack.id },
              data: {
                quantity: transaction.itemStack.quantity + transaction.quantity
              }
            });
          });
        });

        await Promise.all(noPickupPromises);
        totalNoPickup = overdueReservations.length;
        console.error(`[MANUAL CHECK] Marked ${totalNoPickup} overdue reservation(s) as No_Pickup.`);
      }
    }

    // ===== PART 4: Auto-archive severely overdue borrowed items =====
    const [autoArchiveEnabledSetting, autoArchiveDaysSetting] = await Promise.all([
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_enabled' } }),
      prisma.systemSettings.findUnique({ where: { key: 'eic_auto_archive_days' } })
    ]);

    const autoArchiveEnabled = autoArchiveEnabledSetting?.value === 'true' || false;
    const autoArchiveDays = parseInt(autoArchiveDaysSetting?.value || '30', 10);

    if (autoArchiveEnabled) {
      console.error(`[MANUAL CHECK] Auto-archive is enabled. Checking for items overdue by ${autoArchiveDays}+ days...`);

      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - autoArchiveDays);

      const severelyOverdueItems = await prisma.itemTransaction.findMany({
        where: {
          status: 'late_return',
          AND: [
            { returnDate: { not: null } },
            { returnDate: { lt: cutoffDate } }
          ]
        },
        select: {
          id: true,
          returnDate: true,
          account: {
            select: {
              id: true,
              firstName: true,
              surname: true
            }
          },
          itemStack: {
            select: {
              item: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (severelyOverdueItems.length > 0) {
        const archivePromises = severelyOverdueItems.map(async (transaction) => {
          const daysOverdue = Math.floor((now - new Date(transaction.returnDate)) / (1000 * 60 * 60 * 24));
          
          await prisma.itemTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'No_Return',
              autoStatusChanged: true,
              statusChangedAt: new Date(),
              statusChangeReason: `Automatically archived as No Return. Item was overdue for ${daysOverdue} days (threshold: ${autoArchiveDays} days).`
            }
          });
        });

        await Promise.all(archivePromises);
        totalArchived = severelyOverdueItems.length;
        console.error(`[MANUAL CHECK] Successfully auto-archived ${totalArchived} severely overdue item(s).`);
      } else {
        console.error(`[MANUAL CHECK] No items found for auto-archive.`);
      }
    } else {
      console.error(`[MANUAL CHECK] Auto-archive is disabled.`);
    }

    // Return summary
    const messages = [];
    if (totalUpdated > 0) messages.push(`${totalUpdated} marked as late return`);
    if (totalRejected > 0) messages.push(`${totalRejected} auto-rejected`);
    if (totalNoPickup > 0) messages.push(`${totalNoPickup} marked as no pickup`);
    if (totalArchived > 0) messages.push(`${totalArchived} auto-archived`);
    
    return { 
      success: true, 
      count: totalUpdated + totalRejected + totalNoPickup + totalArchived,
      updated: totalUpdated,
      rejected: totalRejected,
      noPickup: totalNoPickup,
      archived: totalArchived,
      message: messages.length > 0 
        ? messages.join(', ') 
        : 'No overdue items found'
    };

  } catch (error) {
    console.error('[MANUAL CHECK ERROR] Failed to check overdue items:', error);
    return { 
      success: false, 
      count: 0, 
      message: 'Failed to check overdue items.', 
      error: error.message 
    };
  }
};

export {
  checkOverdueItems,
  runManualCheck
};
