import { PrismaClient } from '../../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function addRequest(req, res) {
    try {
        const { item_id, pickupDate, request_note, quantity } = req.body;
        const accountId = req.user.id; // From JWT token

        // Validate required fields
        if (!item_id || !pickupDate || !quantity) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'item_id, pickupDate, and quantity are required',
            });
        }

        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({
                error: 'Invalid quantity',
                message: 'Quantity must be at least 1',
            });
        }

        // Validate dates
        const pickup = new Date(pickupDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (pickup < today) {
            return res.status(400).json({
                error: 'Invalid pickup date',
                message: 'Pickup date cannot be in the past',
            });
        }

        // Check if user is admin (admins cannot request items for distribution)
        const user = await prisma.account.findUnique({
            where: {
                id: accountId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                access: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'User account not found',
            });
        }

        if (user.access === 'Admin' || user.access === 'Super_Admin') {
            return res.status(403).json({
                error: 'Access denied',
                message: 'Admin cannot request distribution items',
            });
        }

        // Find the item stack by item_id
        const itemStack = await prisma.itemStack.findFirst({
            where: {
                itemId: item_id,
                status: 'Distributed',
            },
            include: {
                item: true,
            },
        });

        if (!itemStack) {
            return res.status(404).json({
                error: 'Item not found',
                message: 'Distribution item not found or not available',
            });
        }

        // Check if requested quantity is available
        if (quantity > itemStack.quantity) {
            return res.status(400).json({
                error: 'Insufficient quantity',
                message: `Only ${itemStack.quantity} units available, but ${quantity} requested`,
            });
        }

        // Check if user already has a pending request for this item
        const existingRequest = await prisma.itemTransaction.findFirst({
            where: {
                itemStackId: itemStack.id,
                accountId: accountId,
                status: 'Pending',
            },
        });

        if (existingRequest) {
            return res.status(409).json({
                error: 'Request already exists',
                message: 'You already have a pending request for this item',
            });
        }

        // Create the transaction request (no returnDate for distribution items)
        const transaction = await prisma.itemTransaction.create({
            data: {
                itemStackId: itemStack.id,
                accountId: accountId,
                quantity: parseInt(quantity),
                status: 'Pending',
                pickupDate: new Date(pickupDate),
                returnDate: null, // Distribution items don't need to be returned
                requestNote: request_note || null,
            },
            include: {
                itemStack: {
                    include: {
                        item: true,
                    },
                },
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Distribution request submitted successfully',
            transaction: {
                id: transaction.id,
                itemName: transaction.itemStack.item.name,
                quantity: transaction.quantity,
                pickupDate: transaction.pickupDate,
                returnDate: null, // Always null for distribution items
                requestNote: transaction.requestNote,
                status: transaction.status,
                createdAt: transaction.createdAt,
                itemDateLimit: transaction.itemStack.date_limit, // Include the stack's date limit for frontend reference
            },
        });
    } catch (error) {
        console.error('Error creating distribution request:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Duplicate request',
                message: 'A similar request already exists',
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Resource not found',
                message: 'Item or user not found',
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create request. Please try again later.',
        });
    }
}

export default addRequest;
