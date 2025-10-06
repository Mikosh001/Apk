import { Router } from 'express';
import { z } from 'zod';

import { answerQuestion, finishSession, startQuizSession } from '../services/quizSession.js';
import type { AuthenticatedRequest } from '../middleware/requireAuth.js';

const router = Router();

router.post('/:courseId/start', async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { sessionId, question } = await startQuizSession(req.user.id, req.params.courseId);
    res.json({ sessionId, question });
  } catch (error) {
    next(error);
  }
});

const answerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  choice: z.string(),
});

router.post('/:courseId/answer', async (req, res, next) => {
  try {
    const data = answerSchema.parse(req.body);
    const response = await answerQuestion(data.sessionId, data.questionId, data.choice);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

const finishSchema = z.object({ sessionId: z.string() });

router.post('/:courseId/finish', async (req, res, next) => {
  try {
    const data = finishSchema.parse(req.body);
    const result = await finishSession(data.sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const quizRouter = router;
