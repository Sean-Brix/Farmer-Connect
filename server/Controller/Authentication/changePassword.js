import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function changePassword(req, res) {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new password are required' });

    const user = await prisma.account.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.account.update({ where: { id: userId }, data: { password: hashed } });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
