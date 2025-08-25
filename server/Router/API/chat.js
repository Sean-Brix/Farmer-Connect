import express from 'express';
import { 
    getUsers,
    getUserChatRooms,
    createDirectChat,
    getChatMessages,
    getAllChatRoomsAdmin,
    createSupportChatAdmin
} from '../../Controller/Chat/chatController.js';
import { verifyAccessToken } from '../../Middlewares/JWT/verifyAccessToken.js';
import { adminAuth } from '../../Middlewares/Auth/adminAuth.js';

const router = express.Router();

// User chat routes
router.get('/users', verifyAccessToken, getUsers);
router.get('/rooms', verifyAccessToken, getUserChatRooms);
router.post('/rooms/direct', verifyAccessToken, createDirectChat);
router.get('/rooms/:roomId/messages', verifyAccessToken, getChatMessages);

// Admin chat routes
router.get('/admin/rooms', verifyAccessToken, adminAuth, getAllChatRoomsAdmin);
router.post('/admin/support', verifyAccessToken, adminAuth, createSupportChatAdmin);

export default router;
