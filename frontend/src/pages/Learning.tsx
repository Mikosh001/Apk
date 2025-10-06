import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import api from '../api/client';
import { strings } from '../i18n/kk';
import { useAuthStore } from '../store/auth';

interface Enrollment {
  id: string;
  progress: number;
  course: {
    id: string;
    title: string;
    summary: string;
  };
}

const fetchEnrollments = async () => {
  const { data } = await api.get<Enrollment[]>('/courses/enrollments/me');
  return data;
};

const Learning = () => {
  const { user } = useAuthStore();
  const { data } = useQuery({ queryKey: ['enrollments'], queryFn: fetchEnrollments, enabled: Boolean(user) });

  return (
    <section className="section">
      <h2>{strings.learning.title}</h2>
      {!user ? <p>Курстарды көру үшін кіріңіз. (Войдите, чтобы көру курстар)</p> : null}
      <div className="card-grid">
        {data?.map((item) => (
          <Card key={item.id} title={item.course.title} subtitle={item.course.summary}>
            <ProgressBar value={item.progress} />
            <Link to={`/course/${item.course.id}`} className="btn secondary">
              {strings.common.explore}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Learning;
