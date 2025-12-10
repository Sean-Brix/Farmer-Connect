import prisma from '../../../config/database.js';

async function getAllRequest(req, res) {
    try {
        // Get all item transactions with related data - ONLY for EIC stacks
        // Optimized query: select only necessary fields to reduce payload size
        const requests = await prisma.itemTransaction.findMany({
            where: {
                itemStack: {
                    status: 'EIC', // Only get transactions for EIC (Equipment in Circulation) stacks
                },
            },
            select: {
                id: true,
                itemStackId: true,
                accountId: true,
                adminId: true,
                quantity: true,
                status: true,
                pickupDate: true,
                returnDate: true,
                adjustedReturnDate: true, // For late pickup adjusted due date
                actual_pickup: true, // For actual pickup timestamp
                actual_return: true, // For actual return timestamp
                requestNote: true,
                statusChangeReason: true,
                statusChangedAt: true,
                createdAt: true,
                updatedAt: true,
                itemStack: {
                    select: {
                        quantity: true,
                        date_limit: true,
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                category: true,
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
                        username: true,
                        contactNumber: true,
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
            orderBy: [
                {
                    status: 'asc', // Order by status first (Pending, Approved, etc.)
                },
                {
                    createdAt: 'desc', // Then by creation date (newest first)
                },
            ],
        });

        // Transform the data to match the expected format
        const transformedRequests = requests.map((request) => ({
            id: request.id,
            itemStackId: request.itemStackId,
            quantity: request.quantity,
            requestQuantity: request.quantity, // Frontend expects requestQuantity
            status: request.status,
            pickupDate: request.pickupDate,
            returnDate: request.returnDate,
            adjustedReturnDate: request.adjustedReturnDate, // For late pickup adjusted due date
            actual_pickup: request.actual_pickup, // For actual pickup timestamp
            actual_return: request.actual_return, // For actual return timestamp
            requestNote: request.requestNote,
            statusChangeReason: request.statusChangeReason,
            statusChangedAt: request.statusChangedAt,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            // Item information
            itemName: request.itemStack.item.name,
            itemCategory: request.itemStack.item.category,
            // Stack inventory information
            currentStock: request.itemStack.quantity,
            itemDateLimit: request.itemStack.date_limit,
            // User information (matching frontend expectations)
            userName: `${request.account.firstName} ${request.account.surname}`,
            userEmail: request.account.email,
            userUsername: request.account.username,
            userPhone: request.account.contactNumber,
            // Legacy fields for backward compatibility
            requestorName: `${request.account.firstName} ${request.account.surname}`,
            requestorEmail: request.account.email,
            requestorUsername: request.account.username,
            // Admin information (if any)
            adminName: request.admin
                ? `${request.admin.firstName} ${request.admin.surname}`
                : null,
        }));

        console.log('🔍 [EIC Requests] Total requests:', transformedRequests.length);

        return res.status(200).json({
            success: true,
            requests: transformedRequests,
        });
    } catch (error) {
        console.error('❌ [EIC Requests] Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch requests',
        });
    }
}

export default getAllRequest;
