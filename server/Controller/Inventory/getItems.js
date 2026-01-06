import prisma from '../../config/database.js';

async function getItems(req, res) {
    try {
        console.log('📦 [Inventory API] Fetching all items...');
        
        const items = await prisma.inventoryItem.findMany({
            include: {
                item_stacks: {
                    select: {
                        id: true,
                        quantity: true,
                        status: true,
                        reservedQuantity: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        // Count approved requests per item (these are "reserved" items)
        // Include BOTH EIC and Distribution approved requests
        const approvedRequests = await prisma.itemTransaction.findMany({
            where: { 
                status: 'Approved',
                itemStack: {
                    status: { in: ['EIC', 'Distributed'] }  // Count both EIC and Distribution
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

        console.log(`📦 [Inventory API] Found ${items.length} items`);
        if (items.length > 0) {
            console.log('📦 [Inventory API] First item sample:', {
                id: items[0].id,
                name: items[0].name,
                category: items[0].category,
                categoryType: typeof items[0].category,
            });
        }

        // Calculate total quantity and reserved quantity for each item
        const list = items.map((item) => {
            // Filter out only Reserved stacks (legacy - now calculated from approved requests)
            // Keep Distributed stacks as they represent items offered for distribution
            const activeStacks = item.item_stacks.filter(
                stack => stack.status !== 'Reserved'
            );
            
            // Calculate total from all non-Reserved stacks (Available, Unavailable, Damaged, EIC, Distributed)
            const totalQuantity = activeStacks.reduce(
                (sum, stack) => sum + stack.quantity,
                0
            );

            const reservedQty = reservedMap[item.id] || 0;

            // Convert database enum format to display format (underscores to spaces)
            const displayCategory = item.category ? item.category.replace(/_/g, ' ') : 'Other';

            return {
                id: item.id,
                name: item.name,
                description: item.description,
                picture: '/api/inventory/item/' + item.id + '/picture',
                category: displayCategory,
                totalQuantity: totalQuantity,
                reservedQuantity: reservedQty,
                stacks: activeStacks, // Return all non-Reserved stacks
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };
        });

        console.log('📦 [Inventory API] Returning list with', list.length, 'items');
        res.status(200).json(list);
    } catch (error) {
        console.error('❌ [Inventory API] Error:', error);
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
}

export default getItems;
