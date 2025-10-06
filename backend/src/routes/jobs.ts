import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../utils/prisma.js';
import type { AuthenticatedRequest } from '../middleware/requireAuth.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { city, skills, matchFor } = req.query as { city?: string; skills?: string; matchFor?: string };
    if (matchFor === 'me') {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: req.user.id, progress: 100 },
        include: { course: true },
      });
      const badges = await prisma.badge.findMany({ where: { userId: req.user.id } });
      const studentSkills = new Set<string>();
      enrollments.forEach((enrollment) => enrollment.course.skills.forEach((skill) => studentSkills.add(skill)));
      badges.forEach((badge) => studentSkills.add(badge.skillTag));

      const jobs = await prisma.job.findMany({ include: { employer: true } });
      const scored = jobs.map((job) => {
        const matchSkills = job.skillsRequired.filter((skill) => studentSkills.has(skill));
        const score = job.skillsRequired.length ? matchSkills.length / job.skillsRequired.length : 0;
        return {
          ...job,
          score,
          reason: matchSkills,
        };
      });
      scored.sort((a, b) => b.score - a.score);
      return res.json(scored);
    }

    const skillsArray = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          city ? { city: { equals: city, mode: 'insensitive' } } : {},
          skillsArray.length ? { skillsRequired: { hasEvery: skillsArray } } : {},
        ],
      },
      include: { employer: true },
    });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

const jobSchema = z.object({
  title: z.string(),
  city: z.string(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  skillsRequired: z.array(z.string()).min(1),
  description: z.string(),
});

router.post('/', requireAuth, requireRole('employer'), async (req: AuthenticatedRequest, res, next) => {
  try {
    const data = jobSchema.parse(req.body);
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const job = await prisma.job.create({
      data: {
        ...data,
        employerId: req.user.id,
      },
    });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

const applySchema = z.object({});

router.post('/:id/apply', requireAuth, requireRole('student'), async (req: AuthenticatedRequest, res, next) => {
  try {
    applySchema.parse(req.body ?? {});
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const existing = await prisma.application.findFirst({ where: { jobId: req.params.id, userId: req.user.id } });
    if (existing) {
      return res.status(409).json({ message: 'Already applied' });
    }
    const application = await prisma.application.create({
      data: {
        jobId: req.params.id,
        userId: req.user.id,
      },
    });
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
});

router.get('/employer/mine', requireAuth, requireRole('employer'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const jobs = await prisma.job.findMany({ where: { employerId: req.user.id }, include: { applications: { include: { user: true } } } });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

export const jobRouter = router;
