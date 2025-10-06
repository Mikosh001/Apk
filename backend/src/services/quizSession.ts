import { randomUUID } from 'crypto';

import { prisma } from '../utils/prisma.js';

interface QuizSessionState {
  userId: string;
  courseId: string;
  asked: Array<{ questionId: string; correct: boolean; difficulty: number; skill: string }>;
  currentDifficulty: number;
}

const sessions = new Map<string, QuizSessionState>();

export const startQuizSession = async (userId: string, courseId: string) => {
  const quiz = await prisma.quiz.findFirst({ where: { courseId }, include: { questions: true } });
  if (!quiz) {
    throw new Error('Quiz not found');
  }
  const sessionId = randomUUID();
  const state: QuizSessionState = {
    userId,
    courseId,
    asked: [],
    currentDifficulty: 2,
  };
  sessions.set(sessionId, state);
  const nextQuestion = pickQuestion(quiz.questions, state);
  return { sessionId, question: serializeQuestion(nextQuestion) };
};

const pickQuestion = (questions: typeof import('@prisma/client').Question[], state: QuizSessionState) => {
  const available = questions.filter((q) => !state.asked.some((a) => a.questionId === q.id) && q.difficulty === state.currentDifficulty);
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  const fallback = questions.filter((q) => !state.asked.some((a) => a.questionId === q.id));
  if (fallback.length === 0) {
    throw new Error('No more questions');
  }
  return fallback[Math.floor(Math.random() * fallback.length)];
};

const serializeQuestion = (question: import('@prisma/client').Question | null) => {
  if (!question) return null;
  const options = Array.isArray(question.options) ? (question.options as any[]) : [];
  return { id: question.id, text: question.text, difficulty: question.difficulty, options: options.map((o) => ({ text: o.text })) };
};

export const answerQuestion = async (sessionId: string, questionId: string, choice: string) => {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  const quiz = await prisma.quiz.findFirst({ where: { courseId: session.courseId }, include: { questions: true } });
  if (!quiz) {
    throw new Error('Quiz not found');
  }
  const question = quiz.questions.find((q) => q.id === questionId);
  if (!question) {
    throw new Error('Question not found');
  }
  const options = Array.isArray(question.options) ? (question.options as any[]) : [];
  const selected = options.find((o) => o.text === choice);
  const correct = Boolean(selected?.isCorrect);
  session.asked.push({ questionId, correct, difficulty: question.difficulty, skill: question.skillTag });
  session.currentDifficulty = correct
    ? Math.min(3, question.difficulty + 1)
    : Math.max(1, question.difficulty - 1);
  const finished = session.asked.length >= 10 || session.asked.length >= quiz.questions.length;
  const next = finished ? null : serializeQuestion(pickQuestion(quiz.questions, session));
  return { nextQuestion: next, finished, correct };
};

export const finishSession = async (sessionId: string) => {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  const asked = session.asked;
  const correctCount = asked.filter((a) => a.correct).length;
  const total = asked.length || 1;
  const score = correctCount / total;
  const skillMap = new Map<string, { correct: number; total: number }>();
  asked.forEach((a) => {
    const record = skillMap.get(a.skill) ?? { correct: 0, total: 0 };
    record.total += 1;
    if (a.correct) record.correct += 1;
    skillMap.set(a.skill, record);
  });
  const skillBreakdown = Array.from(skillMap.entries()).map(([skill, value]) => ({
    skill,
    correct: value.correct,
    total: value.total,
    accuracy: value.correct / (value.total || 1),
  }));

  let badge = null;
  if (score >= 0.8) {
    badge = await prisma.badge.create({
      data: {
        userId: session.userId,
        name: 'Advanced ' + session.courseId,
        skillTag: 'multi',
        level: 'Advanced',
      },
    });
  } else if (score >= 0.5) {
    badge = await prisma.badge.create({
      data: {
        userId: session.userId,
        name: 'Standard ' + session.courseId,
        skillTag: 'multi',
        level: 'Standard',
      },
    });
  }

  const remediation = badge
    ? []
    : skillBreakdown.filter((s) => s.accuracy < 0.5).map((s) => ({ skill: s.skill, recommendation: 'Қайта қарау' }));

  const result = {
    score,
    asked,
    badge,
    remediation,
    skillBreakdown,
  };

  sessions.delete(sessionId);
  return result;
};
