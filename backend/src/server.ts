import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { authRouter } from './routes/auth.js';
import { courseRouter } from './routes/courses.js';
import { quizRouter } from './routes/quiz.js';
import { badgeRouter } from './routes/badges.js';
import { jobRouter } from './routes/jobs.js';
import { mentorRouter } from './routes/mentors.js';
import { adminRouter } from './routes/admin.js';
import { publicRouter } from './routes/public.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/requireAuth.js';

export const createServer = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/auth', authRouter);
  app.use('/courses', courseRouter);
  app.use('/quiz', requireAuth, quizRouter);
  app.use('/me', requireAuth, badgeRouter);
  app.use('/jobs', jobRouter);
  app.use('/mentors', mentorRouter);
  app.use('/admin', adminRouter);
  app.use('/public', publicRouter);

  app.use(errorHandler);

  return app;
};
