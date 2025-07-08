import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getParticipants(req, res) {
    try {
        const seminar_id = req.params.id;

        const participants = await prisma.seminarParticipant.findMany({
            where: {
                seminar_id: seminar_id,
            },
            include: {
                account: true,
            },
            orderBy: {
                status: 'asc',
            },
        });

        const modifiedParticipants = participants.map((participant) => {

            if(participant.status == 'Not_Attended'){
                participant.status = 'Not Attended'
            }

            const { firstName, middleName, lastName } = participant.account;
            const fullname = middleName
                ? `${firstName} ${middleName.charAt(0)}. ${lastName}`
                : `${firstName} ${lastName}`;


            return {
                ...participant,
                info: {
                    ...participant.account,
                    fullName: fullname,
                },
                account: undefined,
            };
        });

        return res.status(200).json({ list: modifiedParticipants });
    } catch (error) {
        console.error("Error fetching seminar's participants:", error);
        return res.status(500).json({
            message: "An error occurred while fetching seminar's participants",
            payload: [],
        });
    }
}

export default getParticipants;
