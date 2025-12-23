// PrismaClient import removed - using centralized db
import prisma from '../../config/database.js';
import auditLogger from '../../Services/auditLogger.js';

// Using centralized prisma instance

const addDistributionItem = async (req, res) => {
    try {
        const { 
            name, 
            quantity, 
            description, 
            category, 
            status,
            unit,
            seedVarietyId,
            // New variety fields (if creating inline)
            cropType,
            directSeededDAS,
            transplantedDAS,
            plantingWindow,
            varietyDescription
        } = req.body;
        const image = req.file;

        // Validate required fields
        if (!name || !quantity) {
            return res.status(400).json({
                success: false,
                error: 'Name and quantity are required',
            });
        }

        // ENFORCE: Distribution items MUST be Seeds category
        if (category && category !== 'Seeds') {
            return res.status(400).json({
                success: false,
                error: 'Distribution items must be in the Seeds category',
            });
        }

        // ENFORCE: Seed variety is required
        if (!seedVarietyId && !cropType) {
            return res.status(400).json({
                success: false,
                error: 'Seed variety is required. Either select an existing variety (seedVarietyId) or provide crop type to create a new variety.',
            });
        }

        // ENFORCE: Unit is required for seeds
        if (!unit) {
            return res.status(400).json({
                success: false,
                error: 'Unit is required for seed items (e.g., bags, kilograms, packets)',
            });
        }

        // Convert quantity to number
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'Quantity must be a valid positive number',
            });
        }

        // Handle seed variety (create new or use existing)
        let finalSeedVarietyId = seedVarietyId;
        
        if (!seedVarietyId && cropType) {
            // Creating new seed variety inline
            if (!directSeededDAS || !transplantedDAS) {
                return res.status(400).json({
                    success: false,
                    error: 'Days After Sowing (DAS) values are required for both direct seeded and transplanted methods when creating a new seed variety',
                });
            }

            // Validate crop type
            const validCropTypes = ['Rice', 'Corn', 'High_Value_Crops'];
            if (!validCropTypes.includes(cropType)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid crop type. Must be Rice, Corn, or High_Value_Crops',
                });
            }

            // Check for duplicate variety
            const existingVariety = await prisma.seedVariety.findFirst({
                where: {
                    name: name.trim(),
                    cropType
                }
            });

            if (existingVariety) {
                finalSeedVarietyId = existingVariety.id;
            } else {
                // Create new seed variety
                const newVariety = await prisma.seedVariety.create({
                    data: {
                        name: name.trim(),
                        cropType,
                        directSeededDAS: parseInt(directSeededDAS),
                        transplantedDAS: parseInt(transplantedDAS),
                        description: varietyDescription?.trim() || null,
                        plantingWindow: plantingWindow ? parseInt(plantingWindow) : 30,
                        isActive: true
                    }
                });
                finalSeedVarietyId = newVariety.id;
            }
        }

        // Verify seed variety exists
        const seedVariety = await prisma.seedVariety.findUnique({
            where: { id: finalSeedVarietyId }
        });

        if (!seedVariety) {
            return res.status(400).json({
                success: false,
                error: 'Invalid seed variety selected',
            });
        }

        // Check if item already exists in inventory
        let inventoryItem = await prisma.inventoryItem.findFirst({
            where: {
                name: name.trim(),
            },
        });

        // If item doesn't exist, create it in inventory
        if (!inventoryItem) {
            inventoryItem = await prisma.inventoryItem.create({
                data: {
                    name: name.trim(),
                    description: description?.trim() || '',
                    category: 'Seeds', // Force Seeds category for distribution
                    picture: image ? image.buffer : null,
                    unit: unit.trim(), // Add unit field
                    seedVarietyId: finalSeedVarietyId, // Link to seed variety
                },
            });
        } else {
            // If item exists, update it to ensure seed variety is linked
            inventoryItem = await prisma.inventoryItem.update({
                where: { id: inventoryItem.id },
                data: {
                    picture: image ? image.buffer : inventoryItem.picture,
                    seedVarietyId: finalSeedVarietyId, // Ensure seed variety is linked
                    unit: unit.trim(), // Update unit
                    updatedAt: new Date(),
                },
            });
        }

        // Check if distribution stack already exists for this item (with Distributed status)
        let itemStack = await prisma.itemStack.findFirst({
            where: {
                itemId: inventoryItem.id,
                status: 'Distributed',
            },
        });

        if (itemStack) {
            // Update existing stack quantity
            itemStack = await prisma.itemStack.update({
                where: { id: itemStack.id },
                data: {
                    quantity: itemStack.quantity + parsedQuantity,
                    updatedAt: new Date(),
                },
                include: {
                    item: true,
                },
            });
        } else {
            // Create new distribution stack
            itemStack = await prisma.itemStack.create({
                data: {
                    itemId: inventoryItem.id,
                    quantity: parsedQuantity,
                    status: 'Distributed',
                },
                include: {
                    item: true,
                },
            });
        }

        // Log the distribution item creation
        await auditLogger.log({
            adminId: req.user?.id,
            action: 'DISTRIBUTION_CREATE',
            targetType: 'Distribution',
            targetId: itemStack.id,
            targetName: inventoryItem.name,
            details: `Added ${parsedQuantity} ${unit} of ${inventoryItem.name} (${seedVariety.cropType}) to distribution`,
            metadata: {
                action: 'distribution_item_added',
                itemName: inventoryItem.name,
                quantity: parsedQuantity,
                unit: unit,
                category: inventoryItem.category,
                seedVarietyId: finalSeedVarietyId,
                seedVarietyName: seedVariety.name,
                cropType: seedVariety.cropType,
                isNewInventoryItem: !itemStack ? false : true,
                stackId: itemStack.id,
                inventoryItemId: inventoryItem.id,
            },
            req: req,
        });

        res.status(201).json({
            success: true,
            message: 'Distribution item added successfully',
            data: itemStack,
        });
    } catch (error) {
        console.error('Error adding distribution item:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Internal server error while adding distribution item',
            details: error.message,
        });
    }
};

export default addDistributionItem;
