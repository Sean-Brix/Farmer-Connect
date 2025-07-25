import { PrismaClient } from '../../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getMyRequest(req, res) {
    try {
        const accountId = req.user.id; // From JWT token

        // Verify user exists
        const user = await prisma.account.findUnique({
            where: {
                id: accountId,
            },
            select: {
                id: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'User account not found',
            });
        }

        // Fetch all distribution requests made by the user
        const requests = await prisma.itemTransaction.findMany({
            where: {
                accountId: accountId,
                itemStack: {
                    status: 'Distributed', // Only get distribution requests
                },
            },
            include: {
                itemStack: {
                    include: {
                        item: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Distribution requests fetched successfully',
            count: requests.length,
            requests: requests.map((request) => ({
                id: request.id,
                itemName: request.itemStack.item.name,
                itemCategory: request.itemStack.item.category,
                quantity: request.quantity,
                status: request.status,
                pickupDate: request.pickupDate,
                returnDate: null, // Always null for distribution items
                requestNote: request.requestNote,
                createdAt: request.createdAt,
                updatedAt: request.updatedAt,
                itemDateLimit: request.itemStack.date_limit,
            })),
        });
    } catch (error) {
        console.error('Error fetching user distribution requests:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Resource not found',
                message: 'User or requests not found',
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch requests. Please try again later.',
        });
    }
}
export default getMyRequest;
