import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function addSeminar(req, res) {
    try {

        const adminId = req.user.id
        
        return res.status(200).json({ list: seminarList });
    } 
    catch (error) {
        
    }
}

export default addSeminar;
