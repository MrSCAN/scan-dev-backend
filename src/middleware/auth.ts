import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = ClerkExpressRequireAuth({});

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await requireAuth(req, res, async () => {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      
      if (user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Forbidden: Admin access required' });
        return;
      }
      
      next();
    });
  } catch (error) {
    next(error);
  }
};