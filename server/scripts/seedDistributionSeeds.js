import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed Distribution Seeds with SeedVariety data
 * This script:
 * 1. Resets ALL inventory, stacks, transactions, planting reports, and seed varieties
 * 2. Creates seed varieties for Rice, Corn, and High Value Crops
 * 3. Creates distribution seed items (Seeds category only) with names "<Crop Type> - <Variety>" and unit "kg"
 */

const toTitle = (value) => value.replace(/_/g, ' ');

async function main() {
    console.log('🌾 Starting Distribution Seeds seeding...\n');

    try {
        // Step 1: Full cleanup so only seeds appear after seeding
        console.log('🧹 Cleaning up existing inventory data (full reset)...');

        await prisma.plantingReport.deleteMany({});
        await prisma.itemTransaction.deleteMany({});
        await prisma.itemStack.deleteMany({});
        await prisma.inventoryItem.deleteMany({});
        await prisma.seedVariety.deleteMany({});

        console.log('✅ Cleanup completed\n');

        // Step 2: Create Seed Varieties
        console.log('🌱 Creating seed varieties...');

        const seedVarieties = [
            // Rice Varieties
            {
                name: 'NSIC Rc222 (Matatag 1)',
                cropType: 'Rice',
                directSeededDAS: 120,
                transplantedDAS: 115,
                plantingWindow: 30,
                description: 'High-yielding rice variety resistant to multiple diseases',
                isActive: true
            },
            {
                name: 'PSB Rc18 (Oryza)',
                cropType: 'Rice',
                directSeededDAS: 125,
                transplantedDAS: 120,
                plantingWindow: 30,
                description: 'Aromatic rice variety with good grain quality',
                isActive: true
            },
            {
                name: 'NSIC Rc160 (Pinalasang)',
                cropType: 'Rice',
                directSeededDAS: 118,
                transplantedDAS: 113,
                plantingWindow: 30,
                description: 'Early maturing variety with high yield potential',
                isActive: true
            },
            {
                name: 'PSB Rc82 (Mestiso 20)',
                cropType: 'Rice',
                directSeededDAS: 122,
                transplantedDAS: 117,
                plantingWindow: 30,
                description: 'Hybrid rice with excellent milling recovery',
                isActive: true
            },
            // Corn Varieties
            {
                name: 'IPB Var 6',
                cropType: 'Corn',
                directSeededDAS: 105,
                transplantedDAS: 100,
                plantingWindow: 21,
                description: 'Yellow corn variety for feed and food',
                isActive: true
            },
            {
                name: 'NK 6410',
                cropType: 'Corn',
                directSeededDAS: 110,
                transplantedDAS: 105,
                plantingWindow: 21,
                description: 'Hybrid corn with high yield potential',
                isActive: true
            },
            {
                name: 'Pioneer 30G60',
                cropType: 'Corn',
                directSeededDAS: 108,
                transplantedDAS: 103,
                plantingWindow: 21,
                description: 'White corn variety with good disease resistance',
                isActive: true
            },
            // High Value Crops
            {
                name: 'Sweet Corn F1',
                cropType: 'High_Value_Crops',
                directSeededDAS: 75,
                transplantedDAS: 70,
                plantingWindow: 14,
                description: 'Sweet corn hybrid for fresh market',
                isActive: true
            },
            {
                name: 'Sitao Pag-asa',
                cropType: 'High_Value_Crops',
                directSeededDAS: 60,
                transplantedDAS: 55,
                plantingWindow: 14,
                description: 'Long bean variety with high yield',
                isActive: true
            },
            {
                name: 'Squash Suprema',
                cropType: 'High_Value_Crops',
                directSeededDAS: 65,
                transplantedDAS: 60,
                plantingWindow: 14,
                description: 'Squash variety for fresh market',
                isActive: true
            }
        ];

        const createdVarieties = [];
        for (const variety of seedVarieties) {
            const created = await prisma.seedVariety.create({
                data: variety,
            });
            createdVarieties.push(created);
            console.log(`  ✓ Created: ${created.name} (${created.cropType})`);
        }

        console.log(`✅ Created ${createdVarieties.length} seed varieties\n`);

        // Step 3: Create Distribution Seed Items
        console.log('📦 Creating distribution seed items...');

        const distributionSeeds = [
            // Rice Seeds
            {
                varietyIndex: 0, // NSIC Rc222
                quantity: 500,
                maxPerRequest: 50,
                description: 'Certified inbred rice seeds for wet season planting'
            },
            {
                varietyIndex: 1, // PSB Rc18
                quantity: 300,
                maxPerRequest: 40,
                description: 'Premium aromatic rice seeds for special markets'
            },
            {
                varietyIndex: 2, // NSIC Rc160
                quantity: 450,
                maxPerRequest: 50,
                description: 'Early maturing rice seeds for dry season'
            },
            {
                varietyIndex: 3, // PSB Rc82
                quantity: 350,
                maxPerRequest: 45,
                description: 'Hybrid rice seeds with high yield potential'
            },
            // Corn Seeds
            {
                varietyIndex: 4, // IPB Var 6
                quantity: 600,
                maxPerRequest: 60,
                description: 'Yellow corn seeds for feed production'
            },
            {
                varietyIndex: 5, // NK 6410
                quantity: 400,
                maxPerRequest: 50,
                description: 'Hybrid corn seeds for commercial production'
            },
            {
                varietyIndex: 6, // Pioneer 30G60
                quantity: 350,
                maxPerRequest: 40,
                description: 'White corn seeds for food processing'
            },
            // High Value Crops
            {
                varietyIndex: 7, // Sweet Corn F1
                quantity: 200,
                maxPerRequest: 20,
                description: 'Sweet corn seeds for fresh market production'
            },
            {
                varietyIndex: 8, // Sitao Pag-asa
                quantity: 150,
                maxPerRequest: 15,
                description: 'Sitao/long bean seeds for vegetable production'
            },
            {
                varietyIndex: 9, // Squash Suprema
                quantity: 180,
                maxPerRequest: 18,
                description: 'Squash seeds for fresh market'
            }
        ];

        const createdSeeds = [];
        for (const seedData of distributionSeeds) {
            const variety = createdVarieties[seedData.varietyIndex];

            const itemName = `${toTitle(variety.cropType)} - ${variety.name}`;

            // Create InventoryItem
            const inventoryItem = await prisma.inventoryItem.create({
                data: {
                    name: itemName,
                    description: seedData.description,
                    category: 'Seeds',
                    unit: 'kg',
                    seedVarietyId: variety.id
                }
            });

            // Create ItemStack for Distributed status
            await prisma.itemStack.create({
                data: {
                    itemId: inventoryItem.id,
                    quantity: seedData.quantity,
                    status: 'Distributed',
                    max_quantity_per_request: seedData.maxPerRequest
                }
            });

            createdSeeds.push(inventoryItem);
            console.log(`  ✓ Created: ${inventoryItem.name} (${seedData.quantity} kg)`);
        }

        console.log(`✅ Created ${createdSeeds.length} distribution seed items\n`);

        console.log('✨ Distribution Seeds seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Seed Varieties: ${createdVarieties.length}`);
        console.log(`   - Distribution Items: ${createdSeeds.length}`);
        console.log(`   - Total Quantity: ${distributionSeeds.reduce((sum, s) => sum + s.quantity, 0)} kg`);

    } catch (error) {
        console.error('❌ Error seeding distribution seeds:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
