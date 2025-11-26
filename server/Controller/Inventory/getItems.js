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
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        console.log(`📦 [Inventory API] Found ${items.length} items`);
        if (items.length > 0) {
            console.log('📦 [Inventory API] First item sample:', {
                id: items[0].id,
                name: items[0].name,
                category: items[0].category,
                categoryType: typeof items[0].category,
            });
        }

        // Calculate total quantity for each item
        const list = items.map((item) => {
            const totalQuantity = item.item_stacks.reduce(
                (sum, stack) => sum + stack.quantity,
                0
            );

            // Convert database enum format to display format (underscores to spaces)
            const displayCategory = item.category ? item.category.replace(/_/g, ' ') : 'Other';

            return {
                id: item.id,
                name: item.name,
                description: item.description,
                picture: '/api/inventory/item/' + item.id + '/picture',
                category: displayCategory,
                totalQuantity: totalQuantity,
                stacks: item.item_stacks,
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
