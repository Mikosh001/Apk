import { Router } from 'express';

import { prisma } from '../utils/prisma.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const mentors = await prisma.mentor.findMany({ include: { user: true } });
    res.json(mentors);
  } catch (error) {
    next(error);
  }
});

export const mentorRouter = router;
