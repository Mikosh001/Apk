import { Router } from 'express';
import { z } from 'zod';

import type { AuthenticatedRequest } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { prisma } from '../utils/prisma.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const skill = req.query.skill as string | undefined;
    const keyword = req.query.q as string | undefined;
    const courses = await prisma.course.findMany({
      where: {
        AND: [
          skill ? { skills: { has: skill } } : {},
          keyword
            ? {
                OR: [
                  { title: { contains: keyword, mode: 'insensitive' } },
                  { summary: { contains: keyword, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: { lessons: true },
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: req.params.id }, include: { lessons: true } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/lessons', async (req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({ where: { courseId: req.params.id }, orderBy: { order: 'asc' } });
    res.json(lessons);
  } catch (error) {
    next(error);
  }
});

const enrollmentSchema = z.object({ courseId: z.string() });

router.post('/enroll', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { courseId } = enrollmentSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const existing = await prisma.enrollment.findFirst({ where: { courseId, userId } });
    if (existing) {
      return res.json(existing);
    }
    const enrollment = await prisma.enrollment.create({ data: { courseId, userId } });
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
});

router.get('/enrollments/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: { course: true },
    });
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

export const courseRouter = router;
