/**
 * Stack Transfer Utility
 * Handles transferring quantities between inventory stacks with different statuses
 */

/**
 * Transfer quantity between stacks
 * @param {Object} prisma - Prisma client instance (transaction-aware)
 * @param {String} itemId - Item ID
 * @param {String} fromStatus - Source stack status (Available, EIC, Distributed, etc.)
 * @param {String} toStatus - Destination stack status (Reserved, etc.)
 * @param {Number} quantity - Quantity to transfer
 * @returns {Promise<Object>} { success, fromStack, toStack, message }
 */
async function transferBetweenStacks(prisma, itemId, fromStatus, toStatus, quantity) {
    try {
        // Validate inputs
        if (!itemId || !fromStatus || !toStatus) {
            throw new Error('itemId, fromStatus, and toStatus are required');
        }
        
        if (quantity <= 0) {
            throw new Error(`Quantity must be positive, received: ${quantity}`);
        }
        
        // Find source stack
        const fromStack = await prisma.itemStack.findFirst({
            where: { itemId, status: fromStatus },
            include: { item: true }
        });
        
        if (!fromStack) {
            throw new Error(`Source stack "${fromStatus}" not found for item ${itemId}`);
        }
        
        // Validate sufficient quantity in source
        if (fromStack.quantity < quantity) {
            throw new Error(
                `Insufficient quantity in ${fromStatus} stack. ` +
                `Available: ${fromStack.quantity}, Requested: ${quantity}`
            );
        }
        
        // Find or create destination stack
        let toStack = await prisma.itemStack.findFirst({
            where: { itemId, status: toStatus },
            include: { item: true }
        });
        
        if (!toStack) {
            console.log(`🔨 Creating new ${toStatus} stack for ${fromStack.item.name}`);
            toStack = await prisma.itemStack.create({
                data: {
                    itemId,
                    status: toStatus,
                    quantity: 0
                },
                include: { item: true }
            });
        }
        
        // Perform transfer (update both stacks)
        const [updatedFromStack, updatedToStack] = await Promise.all([
            prisma.itemStack.update({
                where: { id: fromStack.id },
                data: { quantity: fromStack.quantity - quantity },
                include: { item: true }
            }),
            prisma.itemStack.update({
                where: { id: toStack.id },
                data: { quantity: toStack.quantity + quantity },
                include: { item: true }
            })
        ]);
        
        const message = `✅ Transferred ${quantity} ${fromStack.item.unit || 'units'} of ${fromStack.item.name}: ${fromStatus} (${updatedFromStack.quantity}) → ${toStatus} (${updatedToStack.quantity})`;
        console.log(message);
        
        return {
            success: true,
            fromStack: updatedFromStack,
            toStack: updatedToStack,
            message
        };
    } catch (error) {
        console.error(`❌ Stack transfer failed:`, error.message);
        throw error;
    }
}

/**
 * Get stack by status for an item
 * @param {Object} prisma - Prisma client instance
 * @param {String} itemId - Item ID
 * @param {String} status - Stack status to find
 * @returns {Promise<Object|null>} Stack object or null
 */
async function getStackByStatus(prisma, itemId, status) {
    return await prisma.itemStack.findFirst({
        where: { itemId, status },
        include: { item: true }
    });
}

/**
 * Validate sufficient quantity in stack
 * @param {Object} stack - Stack object
 * @param {Number} requiredQuantity - Required quantity
 * @throws {Error} If insufficient quantity
 */
function validateStackQuantity(stack, requiredQuantity) {
    if (!stack) {
        throw new Error('Stack not found');
    }
    
    if (stack.quantity < requiredQuantity) {
        throw new Error(
            `Insufficient quantity. Available: ${stack.quantity}, Required: ${requiredQuantity}`
        );
    }
    
    return true;
}

export {
    transferBetweenStacks,
    getStackByStatus,
    validateStackQuantity
};
