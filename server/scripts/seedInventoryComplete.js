import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Complete Inventory Seed Script
 * This script:
 * 1. Clears all existing inventory items, stacks, and transactions
 * 2. Creates seed varieties for distribution
 * 3. Creates seed items linked to varieties
 * 4. Creates equipment/tool items for EIC
 */

async function main() {
    console.log('🏭 Starting Complete Inventory Seeding...\n');

    try {
        // Step 1: Clean up existing data
        console.log('🧹 Cleaning up existing inventory data...');
        
        // Delete in correct order (foreign key constraints)
        // First: PlantingReports that reference SeedVariety
        await prisma.plantingReport.deleteMany({});
        console.log('  ✓ Deleted all planting reports');
        
        await prisma.itemTransaction.deleteMany({});
        console.log('  ✓ Deleted all item transactions');
        
        await prisma.itemStack.deleteMany({});
        console.log('  ✓ Deleted all item stacks');
        
        await prisma.inventoryItem.deleteMany({});
        console.log('  ✓ Deleted all inventory items');
        
        await prisma.seedVariety.deleteMany({});
        console.log('  ✓ Deleted all seed varieties');
        
        console.log('✅ Cleanup completed\n');

        // Step 2: Create Seed Varieties for Distribution
        console.log('🌱 Creating seed varieties...');

        const seedVarieties = [
            // Rice Varieties (4)
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
            // Corn Varieties (3)
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
            // High Value Crops (3)
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
                data: variety
            });
            createdVarieties.push(created);
            console.log(`  ✓ Created variety: ${created.name}`);
        }

        console.log(`✅ Created ${createdVarieties.length} seed varieties\n`);

        // Step 3: Create Distribution Seed Items (Seeds category)
        console.log('📦 Creating distribution seed items...');

        const distributionSeeds = [
            { varietyIndex: 0, quantity: 500, maxPerRequest: 50 },  // NSIC Rc222
            { varietyIndex: 1, quantity: 300, maxPerRequest: 40 },  // PSB Rc18
            { varietyIndex: 2, quantity: 450, maxPerRequest: 50 },  // NSIC Rc160
            { varietyIndex: 3, quantity: 350, maxPerRequest: 45 },  // PSB Rc82
            { varietyIndex: 4, quantity: 600, maxPerRequest: 60 },  // IPB Var 6
            { varietyIndex: 5, quantity: 400, maxPerRequest: 50 },  // NK 6410
            { varietyIndex: 6, quantity: 350, maxPerRequest: 40 },  // Pioneer 30G60
            { varietyIndex: 7, quantity: 200, maxPerRequest: 20 },  // Sweet Corn F1
            { varietyIndex: 8, quantity: 150, maxPerRequest: 15 },  // Sitao Pag-asa
            { varietyIndex: 9, quantity: 180, maxPerRequest: 18 },  // Squash Suprema
        ];

        let seedCount = 0;
        for (const seedData of distributionSeeds) {
            const variety = createdVarieties[seedData.varietyIndex];

            // Create InventoryItem
            const inventoryItem = await prisma.inventoryItem.create({
                data: {
                    name: variety.name,
                    description: `Certified ${variety.cropType.replace(/_/g, ' ').toLowerCase()} seeds`,
                    category: 'Seeds',
                    unit: 'kilograms',
                    seedVarietyId: variety.id
                }
            });

            // Create stacks: Available, Unavailable, Distributed, Reserved
            await prisma.itemStack.createMany({
                data: [
                    {
                        itemId: inventoryItem.id,
                        quantity: 50, // Ready stock at facility
                        status: 'Available'
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: 0, // Initially empty
                        status: 'Unavailable'
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: seedData.quantity,
                        status: 'Distributed',
                        max_quantity_per_request: seedData.maxPerRequest
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: 0, // Seeds requested, waiting pickup
                        status: 'Reserved'
                    }
                ]
            });

            seedCount++;
            console.log(`  ✓ ${variety.name} (${seedData.quantity} kg distributed)`);
        }

        console.log(`✅ Created ${seedCount} seed items with stacks\n`);

        // Step 4: Create Equipment/Tool Items (for EIC)
        console.log('🛠️  Creating equipment and tool items...');

        const equipmentItems = [
            // Farming Equipment
            { name: 'Hand Tractor', category: 'Farming_Equipment', description: 'Small motorized tractor for rice fields', available: 5, eic: 3 },
            { name: 'Plow', category: 'Farming_Equipment', description: 'Traditional plow for soil preparation', available: 10, eic: 5 },
            { name: 'Harrow', category: 'Farming_Equipment', description: 'Equipment for breaking soil clods', available: 8, eic: 4 },
            { name: 'Cultivator', category: 'Farming_Equipment', description: 'Tool for loosening soil and removing weeds', available: 12, eic: 6 },
            
            // Harvesting Tools
            { name: 'Sickle', category: 'Harvesting_Tools', description: 'Hand tool for harvesting crops', available: 25, eic: 10 },
            { name: 'Scythe', category: 'Harvesting_Tools', description: 'Large cutting tool for grass and grain', available: 15, eic: 8 },
            { name: 'Grain Thresher', category: 'Harvesting_Tools', description: 'Machine for separating grain from stalks', available: 3, eic: 2 },
            
            // Irrigation Systems
            { name: 'Water Pump', category: 'Irrigation_Systems', description: 'Motorized pump for irrigation', available: 8, eic: 4 },
            { name: 'Irrigation Hose (50m)', category: 'Irrigation_Systems', description: 'Flexible hose for water distribution', available: 20, eic: 10 },
            { name: 'Sprinkler System', category: 'Irrigation_Systems', description: 'Automated sprinkler for even watering', available: 6, eic: 3 },
            
            // Storage Equipment
            { name: 'Grain Sack (50kg)', category: 'Storage_Equipment', description: 'Heavy-duty sack for grain storage', available: 100, eic: 0 },
            { name: 'Storage Bin', category: 'Storage_Equipment', description: 'Metal bin for storing harvested crops', available: 10, eic: 5 },
            
            // Processing Equipment
            { name: 'Rice Mill', category: 'Processing_Equipment', description: 'Machine for processing paddy rice', available: 2, eic: 1 },
            { name: 'Corn Sheller', category: 'Processing_Equipment', description: 'Machine for removing corn kernels', available: 4, eic: 2 },
            
            // Safety Gear
            { name: 'Rubber Boots', category: 'Safety_Gear', description: 'Waterproof boots for farm work', available: 30, eic: 0 },
            { name: 'Protective Gloves', category: 'Safety_Gear', description: 'Heavy-duty gloves for handling tools', available: 40, eic: 0 },
            { name: 'Face Mask', category: 'Safety_Gear', description: 'Protective mask for pesticide application', available: 50, eic: 0 },
            
            // Pest Control
            { name: 'Knapsack Sprayer', category: 'Pest_Control', description: 'Manual sprayer for pesticides', available: 15, eic: 8 },
            { name: 'Motorized Sprayer', category: 'Pest_Control', description: 'Powered sprayer for large areas', available: 5, eic: 3 },
            
            // Livestock Equipment
            { name: 'Animal Feeder', category: 'Livestock_Equipment', description: 'Automatic feeder for livestock', available: 8, eic: 4 },
            { name: 'Water Trough', category: 'Livestock_Equipment', description: 'Container for animal drinking water', available: 12, eic: 6 },
            
            // Measuring Tools
            { name: 'Soil pH Meter', category: 'Measuring_Tools', description: 'Digital meter for soil acidity', available: 10, eic: 5 },
            { name: 'Moisture Meter', category: 'Measuring_Tools', description: 'Device for measuring soil moisture', available: 8, eic: 4 },
            { name: 'Weighing Scale (50kg)', category: 'Measuring_Tools', description: 'Heavy-duty scale for produce', available: 6, eic: 3 },
            
            // Fisheries
            { name: 'Fishing Net (10m)', category: 'Fisheries', description: 'Nylon net for pond fishing', available: 15, eic: 8 },
            { name: 'Fish Cage', category: 'Fisheries', description: 'Floating cage for fish farming', available: 10, eic: 5 },
            
            // Machinery
            { name: 'Corn Planter', category: 'Machinery', description: 'Machine for planting corn seeds', available: 3, eic: 2 },
            { name: 'Rotavator', category: 'Machinery', description: 'Rotary tiller for soil preparation', available: 4, eic: 2 },
            { name: 'Rice Transplanter', category: 'Machinery', description: 'Machine for planting rice seedlings', available: 2, eic: 1 }
        ];

        let equipmentCount = 0;
        for (const equip of equipmentItems) {
            // Create InventoryItem (no seedVarietyId for equipment)
            const inventoryItem = await prisma.inventoryItem.create({
                data: {
                    name: equip.name,
                    description: equip.description,
                    category: equip.category
                }
            });

            // Create stacks: Available, Unavailable, Damaged, EIC, Reserved
            await prisma.itemStack.createMany({
                data: [
                    {
                        itemId: inventoryItem.id,
                        quantity: equip.available,
                        status: 'Available'
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: 0,
                        status: 'Unavailable'
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: 0,
                        status: 'Damaged'
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: equip.eic,
                        status: 'EIC',
                        date_limit: 30 // 30 days return period
                    },
                    {
                        itemId: inventoryItem.id,
                        quantity: 0, // Items ready for pickup
                        status: 'Reserved'
                    }
                ]
            });

            equipmentCount++;
            console.log(`  ✓ ${equip.name} (${equip.available} available, ${equip.eic} in EIC)`);
        }

        console.log(`✅ Created ${equipmentCount} equipment items with stacks\n`);

        // Summary
        console.log('✨ Inventory seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Seed Varieties: ${createdVarieties.length}`);
        console.log(`   - Seed Items (Distribution): ${seedCount}`);
        console.log(`   - Equipment Items (EIC): ${equipmentCount}`);
        console.log(`   - Total Inventory Items: ${seedCount + equipmentCount}`);
        console.log(`   - Total Seed Stock: ${distributionSeeds.reduce((sum, s) => sum + s.quantity, 0)} kg`);

    } catch (error) {
        console.error('❌ Error seeding inventory:', error);
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
