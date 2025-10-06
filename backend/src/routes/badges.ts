import { Router } from 'express';
import QRCode from 'qrcode';

import { prisma } from '../utils/prisma.js';
import type { AuthenticatedRequest } from '../middleware/requireAuth.js';

const router = Router();

router.get('/badges', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const badges = await prisma.badge.findMany({ where: { userId: req.user.id } });
    res.json(badges);
  } catch (error) {
    next(error);
  }
});

router.get('/profile', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      region: user.region,
      portfolioUrl: user.portfolioUrl,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/portfolio', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { portfolioUrl } = req.body as { portfolioUrl?: string };
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { portfolioUrl },
    });
    res.json({ portfolioUrl: updated.portfolioUrl });
  } catch (error) {
    next(error);
  }
});

router.get('/applications', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { job: true },
    });
    res.json(applications);
  } catch (error) {
    next(error);
  }
});

router.get('/badge/:id/qrcode', async (req, res, next) => {
  try {
    const badge = await prisma.badge.findUnique({ where: { id: req.params.id } });
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    const profileUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/u/${badge.userId}`;
    const dataUrl = await QRCode.toDataURL(profileUrl);
    res.json({ qrcode: dataUrl });
  } catch (error) {
    next(error);
  }
});

export const badgeRouter = router;
