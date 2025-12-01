import prisma from '../../config/database.js';

/**
 * Get unified schedule calendar data for both EIC and Distribution
 * Returns all scheduled pickups with type, status, and user information
 */
async function getScheduleCalendar(req, res) {
  try {
    const { startDate, endDate, type, status } = req.query;
    
    // Default to current month if no dates provided
    const start = startDate 
      ? new Date(startDate) 
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const end = endDate 
      ? new Date(endDate) 
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Fetch EIC requests
    let eicRequests = [];
    if (!type || type === 'eic' || type === 'all') {
      const whereClause = {
        pickupDate: {
          gte: start,
          lte: end
        }
      };
      
      if (status && status !== 'all') {
        whereClause.status = status;
      }
      
      eicRequests = await prisma.itemTransaction.findMany({
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
            include: {
              item: {
                select: {
                  name: true,
                  category: true
                }
              }
            }
          }
        },
        orderBy: {
          pickupDate: 'asc'
        }
      });
    }
    
    // Fetch Distribution requests
    let distributionRequests = [];
    if (!type || type === 'distribution' || type === 'all') {
      const whereClause = {
        pickupDate: {
          gte: start,
          lte: end
        },
        itemStack: {
          status: 'Distributed' // Only get Distribution transactions
        }
      };
      
      if (status && status !== 'all') {
        whereClause.status = status;
      }
      
      distributionRequests = await prisma.itemTransaction.findMany({
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
            include: {
              item: {
                select: {
                  name: true,
                  category: true
                }
              }
            }
          }
        },
        orderBy: {
          pickupDate: 'asc'
        }
      });
    }
    
    // Transform EIC requests
    const transformedEicRequests = eicRequests.map(req => ({
      id: req.id,
      type: 'EIC',
      typeColor: 'blue',
      userId: req.accountId,
      userName: `${req.account.firstName} ${req.account.surname}`,
      userEmail: req.account.email,
      userContact: req.account.contactNumber,
      itemName: req.itemStack.item.name,
      itemCategory: req.itemStack.item.category,
      quantity: req.quantity,
      pickupDate: req.pickupDate,
      returnDate: req.returnDate,
      status: req.status,
      requestNote: req.requestNote,
      createdAt: req.createdAt
    }));
    
    // Transform Distribution requests
    const transformedDistRequests = distributionRequests.map(req => ({
      id: req.id,
      type: 'DISTRIBUTION',
      typeColor: 'green',
      userId: req.accountId,
      userName: `${req.account.firstName} ${req.account.surname}`,
      userEmail: req.account.email,
      userContact: req.account.contactNumber,
      itemName: req.itemStack.item.name,
      itemCategory: req.itemStack.item.category,
      quantity: req.quantity,
      pickupDate: req.pickupDate,
      returnDate: null, // Distribution items don't have return dates
      status: req.status,
      requestNote: req.request_note || null,
      createdAt: req.createdAt
    }));
    
    // Combine and sort by pickup date
    const allRequests = [...transformedEicRequests, ...transformedDistRequests]
      .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));
    
    // Group by date for calendar view
    const requestsByDate = {};
    allRequests.forEach(req => {
      const dateKey = new Date(req.pickupDate).toISOString().split('T')[0];
      if (!requestsByDate[dateKey]) {
        requestsByDate[dateKey] = {
          date: dateKey,
          total: 0,
          eicCount: 0,
          distributionCount: 0,
          requests: []
        };
      }
      requestsByDate[dateKey].total++;
      requestsByDate[dateKey].requests.push(req);
      if (req.type === 'EIC') {
        requestsByDate[dateKey].eicCount++;
      } else {
        requestsByDate[dateKey].distributionCount++;
      }
    });
    
    // Calculate statistics
    const stats = {
      total: allRequests.length,
      eicTotal: transformedEicRequests.length,
      distributionTotal: transformedDistRequests.length,
      byStatus: {
        pending: allRequests.filter(r => r.status === 'Pending').length,
        approved: allRequests.filter(r => r.status === 'Approved').length,
        rejected: allRequests.filter(r => r.status === 'Rejected').length,
        returned: allRequests.filter(r => r.status === 'Returned').length,
        late_return: allRequests.filter(r => r.status === 'late_return').length,
        no_pickup: allRequests.filter(r => r.status === 'No_Pickup').length
      }
    };
    
    return res.json({
      success: true,
      data: {
        requests: allRequests,
        requestsByDate: Object.values(requestsByDate),
        stats,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching schedule calendar:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch schedule data',
      message: error.message
    });
  }
}

/**
 * Get available pickup slots for a specific date
 */
async function getAvailableSlots(req, res) {
  try {
    const { date, type } = req.query;
    
    if (!date) {
      return res.status(400).json({
        error: 'Date required',
        message: 'Please provide a date parameter'
      });
    }
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get settings
    const { getSetting } = await import('../../Services/systemSettingsService.js');
    
    const eicLimit = parseInt(await getSetting('eic_max_pickups_per_day') || '10');
    const distLimit = parseInt(await getSetting('distribution_max_pickups_per_day') || '20');
    const allowWeekends = await getSetting('allow_weekend_pickups');
    
    // Check if weekend
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    
    // Count existing requests
    const eicCount = await prisma.itemTransaction.count({
      where: {
        pickupDate: {
          gte: selectedDate,
          lte: endOfDay
        },
        status: {
          in: ['Pending', 'Approved']
        }
      }
    });
    
    const distCount = await prisma.distributionTransaction.count({
      where: {
        pickupDate: {
          gte: selectedDate,
          lte: endOfDay
        },
        status: {
          in: ['Pending', 'Approved']
        }
      }
    });
    
    return res.json({
      success: true,
      data: {
        date: date,
        isWeekend,
        weekendAllowed: allowWeekends === 'true',
        eic: {
          available: eicLimit - eicCount,
          limit: eicLimit,
          current: eicCount,
          isFull: eicCount >= eicLimit
        },
        distribution: {
          available: distLimit - distCount,
          limit: distLimit,
          current: distCount,
          isFull: distCount >= distLimit
        }
      }
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get available slots',
      message: error.message
    });
  }
}

export { getScheduleCalendar, getAvailableSlots };
