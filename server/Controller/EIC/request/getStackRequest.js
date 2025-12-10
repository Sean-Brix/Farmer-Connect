import prisma from '../../../config/database.js';

async function getStackRequests(req, res) {
    try {
        const itemId = req.params.itemID;

        if (!itemId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Item ID is required',
            });
        }

        // Get all item transactions for the specific item - ONLY for EIC stacks
        const requests = await prisma.itemTransaction.findMany({
            where: {
                itemStack: {
                    itemId: itemId,
                    status: 'EIC', // Only get transactions for EIC (Equipment in Circulation) stacks
                },
            },
            include: {
                itemStack: {
                    include: {
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                category: true,
                                picture: true,
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
                        access: true,
                        client_profile: true,
                    },
                },
                admin: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        email: true,
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
            accountId: request.accountId,
            adminId: request.adminId,
            quantity: request.quantity,
            status: request.status,
            pickupDate: request.pickupDate,
            returnDate: request.returnDate,
            adjustedReturnDate: request.adjustedReturnDate, // For late pickup adjusted due date
            actual_pickup: request.actual_pickup, // For actual pickup timestamp
            actual_return: request.actual_return, // For actual return timestamp
            requestNote: request.requestNote,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            // Item information
            itemName: request.itemStack.item.name,
            itemDescription: request.itemStack.item.description,
            itemCategory: request.itemStack.item.category,
            itemPicture: request.itemStack.item.picture,
            itemDateLimit: request.itemStack.date_limit,
            // Stack inventory information
            currentStock: request.itemStack.quantity,
            // User information (matching frontend expectations)
            userName: `${request.account.firstName} ${request.account.surname}`,
            userEmail: request.account.email,
            userUsername: request.account.username,
            userPhone: request.account.contactNumber,
            // Legacy fields for backward compatibility
            requestorName: `${request.account.firstName} ${request.account.surname}`,
            requestorEmail: request.account.email,
            requestorUsername: request.account.username,
            requestorPhone: request.account.contactNumber,
            requestorAccess: request.account.access,
            requestorProfile: request.account.client_profile,
            // Admin information (if any)
            adminName: request.admin
                ? `${request.admin.firstName} ${request.admin.surname}`
                : null,
            adminEmail: request.admin ? request.admin.email : null,
        }));

        return res.status(200).json({
            success: true,
            message: 'Item requests retrieved successfully',
            count: transformedRequests.length,
            itemId: itemId,
            requests: transformedRequests,
        });
    } catch (error) {
        console.error('Error fetching item requests:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A conflict occurred while fetching item requests',
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch item requests. Please try again later.',
        });
    }
}

export default getStackRequests;
