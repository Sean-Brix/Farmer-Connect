import prisma from '../../config/database.js';

async function getAll(req, res) {
    try {
        // Get all item stacks with Distributed status including their related item information
        const distributedStacks = await prisma.itemStack.findMany({
            where: {
                status: 'Distributed',
            },
            include: {
                item: {
                    include: {
                        seedVariety: true,
                    },
                },
            },
            orderBy: {
                quantity: 'desc',
            },
        });

        // Count approved Distribution requests per item (these are "reserved" items)
        // Only count transactions for Distribution items (not EIC)
        const approvedRequests = await prisma.itemTransaction.findMany({
            where: { 
                status: 'Approved',
                itemStack: {
                    status: 'Distributed'  // Only count Distribution transactions, not EIC
                }
            },
            select: {
                itemStack: {
                    select: {
                        itemId: true
                    }
                },
                quantity: true
            }
        });

        // Create a map of itemId to total reserved quantity from approved requests
        const reservedMap = approvedRequests.reduce((acc, request) => {
            const itemId = request.itemStack.itemId;
            acc[itemId] = (acc[itemId] || 0) + request.quantity;
            return acc;
        }, {});

        // Update reservedQuantity in database and prepare response
        const list = await Promise.all(distributedStacks.map(async (stack) => {
            const reservedQty = reservedMap[stack.itemId] || 0;
            
            // Update database if reservedQuantity changed
            if (stack.reservedQuantity !== reservedQty) {
                await prisma.itemStack.update({
                    where: { id: stack.id },
                    data: { reservedQuantity: reservedQty }
                });
            }

            return {
                ...stack,
                item: {
                    ...stack.item,
                    picture: `/api/distribution/photo/${stack.itemId}`,
                },
                count: stack.count,
                reservedQuantity: reservedQty,
            };
        }));

        // Return success response with the distributed stacks data
        return res.status(200).json(list);
    } 
    catch (error) {
        console.error('Error retrieving distributed stacks:', error);
        return res.status(500).json({
            success: false,
            message:
                'Internal server error while retrieving distributed stacks',
            error: error.message,
        });
    }
}

export default getAll;
