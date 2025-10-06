import { Router } from 'express';

import { prisma } from '../utils/prisma.js';

const router = Router();

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, include: { badges: true } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      badges: user.badges.map((badge) => ({ id: badge.id, name: badge.name, level: badge.level })),
      projectUrl: user.portfolioUrl,
    });
  } catch (error) {
    next(error);
  }
});

export const publicRouter = router;
