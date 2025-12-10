import prisma from '../../../config/database.js';
import ExcelJS from 'exceljs';

/**
 * GET /api/eic/request/export
 * 
 * Export archive data as Excel file with monthly sheets
 * Supports filtering by query parameters
 */
export default async function exportArchive(req, res) {
  try {
    const { status, dateFrom, dateTo, userId, itemId, adminId } = req.query;

    // Build where clause
    // late_return is NOW archived - means item has been returned late
    const where = {
      status: {
        in: ['Rejected', 'Returned', 'late_return', 'No_Return', 'No_Pickup', 'Cancelled']
      },
      itemStack: {
        status: 'EIC' // Only export EIC (Equipment in Circulation) transactions
      }
    };

    // Apply filters
    if (status && status !== 'all') {
      where.status = status;
    }

    if (userId && userId !== 'all') {
      where.accountId = userId;
    }

    if (itemId && itemId !== 'all') {
      where.itemStackId = itemId;
    }

    if (adminId && adminId !== 'all') {
      where.adminId = adminId;
    }

    if (dateFrom || dateTo) {
      where.statusChangedAt = {};
      if (dateFrom) {
        where.statusChangedAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.statusChangedAt.lte = endDate;
      }
    }

    // TEST 2.3: Export API
    console.log(`
${'='.repeat(60)}
📋 TEST 2.3: EXPORT ARCHIVE API
${'='.repeat(60)}
Filters applied:
  Status: ${status || 'all'}
  Date from: ${dateFrom || 'none'}
  Date to: ${dateTo || 'none'}
  User ID: ${userId || 'all'}
  Item ID: ${itemId || 'all'}
  Admin ID: ${adminId || 'all'}
Where clause: ${JSON.stringify(where, null, 2)}
${'='.repeat(60)}
✅ COPY THIS LOG TO CHECKLIST TEST 2.3
${'='.repeat(60)}
`);

    // Fetch data with relations (fixed relation names)
    const transactions = await prisma.itemTransaction.findMany({
      where,
      include: {
        itemStack: {
          select: {
            item: {
              select: {
                name: true,
                category: true
              }
            }
          }
        },
        account: {
          select: {
            firstName: true,
            surname: true,
            email: true
          }
        },
        admin: {
          select: {
            firstName: true,
            surname: true
          }
        }
      },
      orderBy: {
        statusChangedAt: 'desc'
      }
    });

    // Group transactions by month
    const monthlyData = {};
    transactions.forEach(tx => {
      const date = new Date(tx.statusChangedAt || tx.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          name: monthName,
          data: []
        };
      }
      monthlyData[monthKey].data.push(tx);
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EIC System';
    workbook.created = new Date();

    // Define column headers
    const columns = [
      { header: 'ID', key: 'id', width: 25 },
      { header: 'Item Name', key: 'itemName', width: 25 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Requestor Name', key: 'requestorName', width: 25 },
      { header: 'Requestor Email', key: 'requestorEmail', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Pickup Date', key: 'pickupDate', width: 15 },
      { header: 'Return Date', key: 'returnDate', width: 15 },
      { header: 'Adjusted Return Date', key: 'adjustedReturnDate', width: 18 },
      { header: 'Actual Pickup', key: 'actualPickup', width: 15 },
      { header: 'Actual Return', key: 'actualReturn', width: 15 },
      { header: 'Request Date', key: 'requestDate', width: 15 },
      { header: 'Status Changed', key: 'statusChanged', width: 15 },
      { header: 'Processing Admin', key: 'processingAdmin', width: 25 },
      { header: 'Reason/Note', key: 'reason', width: 40 }
    ];

    // Create a sheet for each month
    const sortedMonths = Object.keys(monthlyData).sort().reverse();
    sortedMonths.forEach(monthKey => {
      const { name, data } = monthlyData[monthKey];
      const worksheet = workbook.addWorksheet(name, {
        properties: { tabColor: { argb: 'FF00FF00' } }
      });

      // Set columns
      worksheet.columns = columns;

      // Style header row
      worksheet.getRow(1).font = { bold: true, size: 12 };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows
      data.forEach(tx => {
        worksheet.addRow({
          id: tx.id,
          itemName: tx.itemStack?.item?.name || 'N/A',
          category: tx.itemStack?.item?.category || 'N/A',
          requestorName: tx.account ? `${tx.account.firstName} ${tx.account.surname}` : 'N/A',
          requestorEmail: tx.account?.email || 'N/A',
          quantity: tx.quantity,
          status: tx.status,
          pickupDate: tx.pickupDate ? new Date(tx.pickupDate).toLocaleDateString() : '',
          returnDate: tx.returnDate ? new Date(tx.returnDate).toLocaleDateString() : '',
          adjustedReturnDate: tx.adjustedReturnDate ? new Date(tx.adjustedReturnDate).toLocaleDateString() : '',
          actualPickup: tx.actual_pickup ? new Date(tx.actual_pickup).toLocaleDateString() : '',
          actualReturn: tx.actual_return ? new Date(tx.actual_return).toLocaleDateString() : '',
          requestDate: new Date(tx.createdAt).toLocaleDateString(),
          statusChanged: tx.statusChangedAt ? new Date(tx.statusChangedAt).toLocaleDateString() : '',
          processingAdmin: tx.admin ? `${tx.admin.firstName} ${tx.admin.surname}` : '',
          reason: tx.statusChangeReason || tx.requestNote || ''
        });
      });

      // Auto-filter
      worksheet.autoFilter = {
        from: 'A1',
        to: String.fromCharCode(64 + columns.length) + '1'
      };

      // Freeze header row
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }
      ];
    });

    // If no data, create a summary sheet
    if (sortedMonths.length === 0) {
      const worksheet = workbook.addWorksheet('No Data');
      worksheet.getCell('A1').value = 'No archived transactions found with the current filters.';
      worksheet.getCell('A1').font = { bold: true, size: 14 };
    }

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers for file download
    const filename = `EIC_Archive_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Error exporting archive:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to export archive data'
    });
  }
}
