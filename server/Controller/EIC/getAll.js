import prisma from '../../config/database.js';

async function getAll(req, res) {
    try {
        console.log('🔍 Prisma client:', typeof prisma, prisma ? 'initialized' : 'UNDEFINED');
        console.log('🔍 Prisma.itemStack:', typeof prisma?.itemStack);
        console.log('🔍 Prisma.eICTransaction:', typeof prisma?.eICTransaction);
        
        // Get all item stacks with EIC status including their related item information
        const eicStacks = await prisma.itemStack.findMany({
            where: {
                status: 'EIC',
            },
            include: {
                item: true,
            },
            orderBy: {
                quantity: 'desc',
            },
        });

        console.log('✅ Got EIC stacks:', eicStacks.length);

        // Count approved EIC requests per item (these are "reserved" items)
        // Only count transactions for EIC items (not Distribution)
        const approvedRequests = await prisma.itemTransaction.findMany({
            where: { 
                status: 'Approved',
                itemStack: {
                    status: 'EIC'  // Only count EIC transactions, not Distribution
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
        const list = await Promise.all(eicStacks.map(async (stack) => {
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
                    picture: `/api/eic/photo/${stack.itemId}`
                },
                count: stack.count,
                reservedQuantity: reservedQty,
            };
        }));

        // Debug: Log reserved quantities
        console.log('📊 Reserved from Approved Requests:', reservedMap);
        console.log('📦 Sample EIC Stack with Reserved:', list[0]);

        // Return success response with the EIC stacks data
        return res.status(200).json(list);
    } 
    catch (error) {
        console.error('Error retrieving EIC stacks:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while retrieving EIC stacks',
            error: error.message,
        });
    }
}

export default getAll;
