import { create } from 'zustand';

interface QuizQuestion {
  id: string;
  text: string;
  difficulty: number;
  options: Array<{ text: string }>;
}

interface QuizState {
  sessionId: string | null;
  currentQuestion: QuizQuestion | null;
  answers: Array<{ questionId: string; choice: string; correct?: boolean }>;
  setSession: (sessionId: string, question: QuizQuestion) => void;
  setNext: (question: QuizQuestion | null) => void;
  addAnswer: (answer: { questionId: string; choice: string; correct?: boolean }) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: null,
  currentQuestion: null,
  answers: [],
  setSession: (sessionId, question) => set({ sessionId, currentQuestion: question, answers: [] }),
  setNext: (question) => set({ currentQuestion: question }),
  addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
  reset: () => set({ sessionId: null, currentQuestion: null, answers: [] }),
}));
