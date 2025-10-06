import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../utils/prisma.js';
import { requireAuth, requireRole } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

const courseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  durationWeeks: z.number().min(1),
});

router.post('/courses', async (req, res, next) => {
  try {
    const data = courseSchema.parse(req.body);
    const course = await prisma.course.create({ data });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
});

router.put('/courses/:id', async (req, res, next) => {
  try {
    const data = courseSchema.partial().parse(req.body);
    const course = await prisma.course.update({ where: { id: req.params.id }, data });
    res.json(course);
  } catch (error) {
    next(error);
  }
});

router.delete('/courses/:id', async (req, res, next) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

const lessonSchema = z.object({
  courseId: z.string(),
  type: z.enum(['video', 'task', 'sim']),
  title: z.string(),
  videoUrl: z.string().optional(),
  contentMd: z.string().optional(),
  order: z.number(),
});

router.post('/lessons', async (req, res, next) => {
  try {
    const data = lessonSchema.parse(req.body);
    const lesson = await prisma.lesson.create({ data });
    res.status(201).json(lesson);
  } catch (error) {
    next(error);
  }
});

router.put('/lessons/:id', async (req, res, next) => {
  try {
    const data = lessonSchema.partial().parse(req.body);
    const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data });
    res.json(lesson);
  } catch (error) {
    next(error);
  }
});

router.delete('/lessons/:id', async (req, res, next) => {
  try {
    await prisma.lesson.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

const questionSchema = z.object({
  quizId: z.string(),
  text: z.string(),
  skillTag: z.string(),
  difficulty: z.number().min(1).max(3),
  options: z.array(z.object({ text: z.string(), isCorrect: z.boolean() })).min(2),
});

router.post('/questions', async (req, res, next) => {
  try {
    const data = questionSchema.parse(req.body);
    const question = await prisma.question.create({ data: { ...data, options: data.options } });
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

router.put('/questions/:id', async (req, res, next) => {
  try {
    const data = questionSchema.partial().parse(req.body);
    const question = await prisma.question.update({ where: { id: req.params.id }, data });
    res.json(question);
  } catch (error) {
    next(error);
  }
});

router.delete('/questions/:id', async (req, res, next) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/jobs', async (_req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({ include: { applications: true } });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

export const adminRouter = router;
