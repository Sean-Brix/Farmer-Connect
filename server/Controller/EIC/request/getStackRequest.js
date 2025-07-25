import { PrismaClient } from '../../../prisma/generated/client.js';
const prisma = new PrismaClient();

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
                        lastName: true,
                        email: true,
                        username: true,
                        cellphone_no: true,
                        access: true,
                        client_profile: true,
                    },
                },
                admin: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
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
            // User information
            requestorName: `${request.account.firstName} ${request.account.lastName}`,
            requestorEmail: request.account.email,
            requestorUsername: request.account.username,
            requestorPhone: request.account.cellphone_no,
            requestorAccess: request.account.access,
            requestorProfile: request.account.client_profile,
            // Admin information (if any)
            adminName: request.admin
                ? `${request.admin.firstName} ${request.admin.lastName}`
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
