import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import { WebhookEvent } from '@clerk/clerk-sdk-node';

const router = express.Router();
const prisma = new PrismaClient();

// Clerk webhook handler for user creation/updates
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const evt = req.body as WebhookEvent;
    const { data, type } = evt;

    if (type === 'user.created') {
      await prisma.user.create({
        data: {
          id: data.id as string,
          email: (data.email_addresses as any)[0].email_address,
          name: `${data.first_name} ${data.last_name}`.trim(),
          role: 'USER',
        },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Get user role
router.get('/:id', requireAuth, asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { role: true },
  });
  
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  
  res.json(user);
}));

// Update user role (admin only)
router.put('/:id/role', requireAdmin, asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { role } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
  });
  res.json(user);
}));

// Get all users (admin only)
router.get('/', requireAdmin, asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
  res.json(users);
}));

export const usersRouter = router;