import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../../Middlewares/JWT/authenticateToken.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/preferences/theme - Get user's theme preference
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's theme preference
    const themePreference = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: userId,
          key: 'theme'
        }
      }
    });

    if (themePreference) {
      res.json({
        success: true,
        theme: themePreference.value
      });
    } else {
      // If no preference found, create default light theme preference
      await prisma.userPreference.create({
        data: {
          userId: userId,
          key: 'theme',
          value: 'light'
        }
      });

      res.json({
        success: true,
        theme: 'light'
      });
    }
  } catch (error) {
    console.error('Error getting theme preference:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving theme preference'
    });
  }
});

// POST /api/preferences/theme - Update user's theme preference
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;

    // Validate theme value
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme value. Must be light, dark, or auto.'
      });
    }

    // Update or create theme preference
    const updatedPreference = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: userId,
          key: 'theme'
        }
      },
      update: {
        value: theme,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        key: 'theme',
        value: theme
      }
    });

    res.json({
      success: true,
      theme: updatedPreference.value,
      message: 'Theme preference updated successfully'
    });
  } catch (error) {
    console.error('Error updating theme preference:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme preference'
    });
  }
});

export default router;
