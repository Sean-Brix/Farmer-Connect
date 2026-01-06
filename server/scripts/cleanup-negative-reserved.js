/**
 * Cleanup Script: Remove Negative Reserved Stacks
 * Deletes any Reserved stacks with quantity <= 0
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanupNegativeReserved() {
    try {
        console.log('🔍 Searching for negative or zero Reserved stacks...');
        
        // Find all Reserved stacks with quantity <= 0
        const negativeStacks = await prisma.itemStack.findMany({
            where: {
                status: 'Reserved',
                quantity: {
                    lte: 0
                }
            },
            include: {
                item: true
            }
        });
        
        if (negativeStacks.length === 0) {
            console.log('✅ No negative or zero Reserved stacks found!');
            return;
        }
        
        console.log(`⚠️  Found ${negativeStacks.length} Reserved stacks with invalid quantities:`);
        negativeStacks.forEach(stack => {
            console.log(`   - ${stack.item.name}: ${stack.quantity} units (ID: ${stack.id})`);
        });
        
        // Delete all negative/zero Reserved stacks
        const result = await prisma.itemStack.deleteMany({
            where: {
                status: 'Reserved',
                quantity: {
                    lte: 0
                }
            }
        });
        
        console.log(`✅ Deleted ${result.count} invalid Reserved stacks`);
        console.log('🎉 Cleanup complete!');
        
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run cleanup
cleanupNegativeReserved()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
