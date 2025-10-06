import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../api/client';
import { useQuizStore } from '../store/quiz';
import { strings } from '../i18n/kk';
import { useToast } from '../components/Toast';

interface StartResponse {
  sessionId: string;
  question: { id: string; text: string; options: Array<{ text: string }> };
}

const QuizPage = () => {
  const { courseId } = useParams();
  const { show } = useToast();
  const { sessionId, currentQuestion, setSession, setNext, addAnswer, reset } = useQuizStore();
  const [finished, setFinished] = useState<{ score: number; badge?: { name: string; level: string } | null } | null>(null);

  useEffect(() => {
    reset();
    const start = async () => {
      if (!courseId) return;
      const { data } = await api.post<StartResponse>(`/quiz/${courseId}/start`);
      setSession(data.sessionId, data.question);
    };
    start().catch(() => show('Тест басталмады (Ошибка запуска теста)'));
  }, [courseId, reset, setSession, show]);

  const answerMutation = useMutation({
    mutationFn: async (choice: string) => {
      if (!sessionId || !currentQuestion) return null;
      const { data } = await api.post(`/quiz/${courseId}/answer`, {
        sessionId,
        questionId: currentQuestion.id,
        choice,
      });
      return data as { nextQuestion: typeof currentQuestion | null; finished: boolean; correct: boolean };
    },
    onSuccess: (data, choice) => {
      if (!data) return;
      addAnswer({ questionId: currentQuestion!.id, choice, correct: data.correct });
      if (data.finished || !data.nextQuestion) {
        finishMutation.mutate();
      } else {
        setNext(data.nextQuestion);
      }
    },
  });

  const finishMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return null;
      const { data } = await api.post(`/quiz/${courseId}/finish`, { sessionId });
      return data as { score: number; badge: { name: string; level: string } | null };
    },
    onSuccess: (data) => {
      if (!data) return;
      setFinished(data);
      show('Тест аяқталды (Тест завершён)');
    },
  });

  if (finished) {
    return (
      <section className="section">
        <h2>{strings.quiz.finish}</h2>
        <p>Дұрыстық: {(finished.score * 100).toFixed(0)}%</p>
        {finished.badge ? <p>Жаңа бейдж: {finished.badge.name}</p> : <p>Қосымша жаттығу ұсынылады.</p>}
      </section>
    );
  }

  if (!currentQuestion) {
    return <p>Жүктелуде...</p>;
  }

  return (
    <section className="section">
      <h2>{strings.quiz.title}</h2>
      <article className="card">
        <h3>{currentQuestion.text}</h3>
        <div className="card-content">
          {currentQuestion.options.map((option) => (
            <button
              key={option.text}
              className="btn secondary"
              type="button"
              onClick={() => answerMutation.mutate(option.text)}
              disabled={answerMutation.isPending}
            >
              {option.text}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
};

export default QuizPage;
