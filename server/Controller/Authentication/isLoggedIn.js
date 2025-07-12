import { isAuthenticated } from "../../Utils/jwt_token.js";
import { PrismaClient } from "../../prisma/generated/client.js";
const prisma = new PrismaClient();

async function isLoggedIn(req, res) {

    const id = isAuthenticated(req);

    if (!id) {
        return res.status(200).json({
            message: 'User is not authenticated',
            check: false,
        });
    }

    // Fetch user details from the database
    const userDetails = await prisma.account.findUnique({
        where: {
            id: id,
        },
        select: {
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            access: true,
        },
    });

    if (!userDetails) {
        return res.status(404).json({
            message: 'Cannot retrieve user details',
            check: false,
        });
    }

    res.status(200).json({
        message: 'User is authenticated',
        check: true,
        payload: userDetails
    });

}

export default isLoggedIn;