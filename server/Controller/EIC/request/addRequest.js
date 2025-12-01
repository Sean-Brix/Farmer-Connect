import prisma from '../../../config/database.js';

async function addRequest(req, res) {
    try {
        const { item_id, pickupDate, returnDate, request_note, quantity } =
            req.body;
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

        // Validate return date if provided
        if (returnDate) {
            const returnD = new Date(returnDate);
            if (returnD <= pickup) {
                return res.status(400).json({
                    error: 'Invalid return date',
                    message: 'Return date must be after pickup date',
                });
            }
        }

        // Check if user is admin (admins cannot borrow items)
        const user = await prisma.account.findUnique({
            where: {
                id: accountId,
            },
            select: {
                id: true,
                firstName: true,
                surname: true,
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
                message: 'Admin cannot borrow an EIC item',
            });
        }

        // Find the item stack by item_id
        const itemStack = await prisma.itemStack.findFirst({
            where: {
                itemId: item_id,
                status: 'EIC',
            },
            include: {
                item: true,
            },
        });

        if (!itemStack) {
            return res.status(404).json({
                error: 'Item not found',
                message: 'EIC item not found or not available',
            });
        }

        // Check if requested quantity is available
        if (quantity > itemStack.quantity) {
            return res.status(400).json({
                error: 'Insufficient quantity',
                message: `Only ${itemStack.quantity} units available, but ${quantity} requested`,
            });
        }

        // Check if requested quantity exceeds max quantity per request limit
        if (itemStack.max_quantity_per_request && quantity > itemStack.max_quantity_per_request) {
            return res.status(400).json({
                error: 'Quantity limit exceeded',
                message: `This item has a maximum request limit of ${itemStack.max_quantity_per_request} units per request. You requested ${quantity} units.`,
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

        // Validate against stack's date_limit if set
        if (itemStack.date_limit && returnDate) {
            const pickup = new Date(pickupDate);
            const returnD = new Date(returnDate);
            
            // Calculate difference in days (floor to match frontend behavior)
            // Reset time to midnight for accurate day calculation
            pickup.setHours(0, 0, 0, 0);
            returnD.setHours(0, 0, 0, 0);
            const diffTime = returnD - pickup;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > itemStack.date_limit) {
                return res.status(400).json({
                    error: 'Borrowing period exceeds limit',
                    message: `This item has a maximum borrowing period of ${itemStack.date_limit} days. Your requested period is ${diffDays} days.`,
                });
            }
        }

        // Create the transaction request
        const transaction = await prisma.itemTransaction.create({
            data: {
                itemStackId: itemStack.id,
                accountId: accountId,
                quantity: parseInt(quantity),
                status: 'Pending',
                pickupDate: new Date(pickupDate),
                returnDate: returnDate ? new Date(returnDate) : null,
                requestNote: request_note || null, // Now we can store the request note
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
                        surname: true,
                        email: true,
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Request submitted successfully',
            transaction: {
                id: transaction.id,
                itemName: transaction.itemStack.item.name,
                quantity: transaction.quantity,
                pickupDate: transaction.pickupDate,
                returnDate: transaction.returnDate,
                requestNote: transaction.requestNote,
                status: transaction.status,
                createdAt: transaction.createdAt,
                itemDateLimit: transaction.itemStack.date_limit, // Include the stack's date limit for frontend reference
                itemMaxQuantityPerRequest: transaction.itemStack.max_quantity_per_request, // Include max quantity per request
            },
        });
    } catch (error) {
        console.error('Error creating EIC request:', error);

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
