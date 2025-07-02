import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function authorize(req, res, next) {

    const user = await prisma.account.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            access: true,
        },
    });

    if (!user.access) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the user has the required role
    if (user.access == 'User') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    next();
}

export default authorize;