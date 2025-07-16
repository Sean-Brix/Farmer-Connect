import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function addItem(req, res) {
    const { name, description, category } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        // Check if item already exists
        const existingItem = await prisma.inventoryItem.findFirst({
            where: {
                name,
                category,
            },
            
        });

        if (existingItem) {
            // Redirect to another route if item exists
            return res.redirect('/random-route');
        }

        if (!description || !category) {
            return res.status(400).json({ error: 'Name, description, and category are required' });
        }

        const newItem = await prisma.inventoryItem.create({
            data: {
                name,
                description,
                category,
            },
        });

        res.status(201).json({
            message: 'Item added successfully',
            item: {
                id: newItem.id,
                name: newItem.name,
                description: newItem.description,
                category: newItem.category,
                createdAt: newItem.createdAt,
                updatedAt: newItem.updatedAt,
            },
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add item' });
    }
}

export default addItem;