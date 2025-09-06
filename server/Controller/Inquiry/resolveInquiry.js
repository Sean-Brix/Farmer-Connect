import { PrismaClient } from '@prisma/client';
import socketLogoutService from '../../Services/socketLogoutService.js';
import auditLogger from '../../Services/auditLogger.js';

const prisma = new PrismaClient();

export const resolveInquiry = async (req, res) => {
    try {
        const { inquiryId } = req.params;
        const userId = req.user.id;

        // Verify the inquiry belongs to the user
        const inquiry = await prisma.inquiry.findFirst({
            where: {
                id: inquiryId, // Remove parseInt since id is a string (CUID)
                userId: userId
            }
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found or you do not have permission to resolve it'
            });
        }

        // Update inquiry status to RESOLVED
        const resolvedInquiry = await prisma.inquiry.update({
            where: {
                id: inquiryId // Remove parseInt since id is a string (CUID)
            },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date()
            }
        });

        // Log audit trail
        await auditLogger.logInquiryAction(
            req.user.id,
            'INQUIRY_RESOLVE',
            resolvedInquiry,
            `User resolved inquiry: ${resolvedInquiry.subject}`,
            {},
            req
        );

        try {
            // Broadcast to admins that inquiry is resolved
            const io = socketLogoutService.getIO?.();
            if (io) {
                io.to('admin_room').emit('admin_inquiry:status_update', {
                    inquiryId,
                    status: 'RESOLVED',
                    updatedAt: new Date().toISOString()
                });
            }
        } catch {}

        res.status(200).json({
            success: true,
            message: 'Inquiry marked as resolved successfully',
            inquiry: resolvedInquiry
        });

    } catch (error) {
        console.error('Error resolving inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resolve inquiry'
        });
    }
};
