/**
 * Check Reserved Mismatch
 * Compares approved request quantities vs Reserved stack quantities
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkReservedMismatch() {
    try {
        console.log('🔍 Checking Approved Requests vs Reserved Stacks...\n');
        
        // Get all approved requests
        const approvedRequests = await prisma.eICTransaction.findMany({
            where: { status: 'Approved' },
            include: {
                itemStack: {
                    include: {
                        item: true
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        
        console.log(`✅ Found ${approvedRequests.length} Approved requests\n`);
        
        // Group by item
        const grouped = {};
        approvedRequests.forEach(req => {
            const itemId = req.itemStack.item.id;
            const itemName = req.itemStack.item.name;
            
            if (!grouped[itemId]) {
                grouped[itemId] = {
                    name: itemName,
                    requests: [],
                    totalQty: 0
                };
            }
            
            grouped[itemId].requests.push({
                user: `${req.user.firstName} ${req.user.lastName}`,
                quantity: req.quantity,
                id: req.id
            });
            grouped[itemId].totalQty += req.quantity;
        });
        
        console.log('📊 Approved Requests by Item:');
        Object.entries(grouped).forEach(([itemId, data]) => {
            console.log(`\n  ${data.name}:`);
            console.log(`    ${data.requests.length} requests, ${data.totalQty} total units reserved`);
            data.requests.forEach(r => {
                console.log(`      - ${r.user}: ${r.quantity} units`);
            });
        });
        
        // Get all Reserved stacks
        console.log('\n\n🔒 Reserved Stacks in Database:');
        const reservedStacks = await prisma.itemStack.findMany({
            where: { status: 'Reserved' },
            include: { item: true }
        });
        
        if (reservedStacks.length === 0) {
            console.log('  (No Reserved stacks found)');
        } else {
            reservedStacks.forEach(stack => {
                console.log(`  ${stack.item.name}: ${stack.quantity} units`);
            });
        }
        
        // Compare
        console.log('\n\n⚖️  COMPARISON:');
        let mismatchFound = false;
        
        Object.entries(grouped).forEach(([itemId, data]) => {
            const reservedStack = reservedStacks.find(s => s.itemId === itemId);
            const stackQty = reservedStack ? reservedStack.quantity : 0;
            const expectedQty = data.totalQty;
            
            if (stackQty !== expectedQty) {
                mismatchFound = true;
                console.log(`\n  ❌ MISMATCH: ${data.name}`);
                console.log(`     Expected: ${expectedQty} (from ${data.requests.length} approved requests)`);
                console.log(`     Actual:   ${stackQty} (in Reserved stack)`);
                console.log(`     Diff:     ${stackQty - expectedQty}`);
            } else {
                console.log(`\n  ✅ OK: ${data.name} - ${stackQty} units match`);
            }
        });
        
        if (!mismatchFound) {
            console.log('\n🎉 All Reserved quantities match approved requests!');
        } else {
            console.log('\n⚠️  Mismatches detected! Reserved stacks do not match approved requests.');
        }
        
    } catch (error) {
        console.error('❌ Check failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

checkReservedMismatch()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
