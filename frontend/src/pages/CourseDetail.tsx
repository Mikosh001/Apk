import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';

import { Card } from '../components/Card';
import { Table } from '../components/Table';
import api from '../api/client';

interface Lesson {
  id: string;
  title: string;
  type: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  summary: string;
  durationWeeks: number;
}

const fetchCourse = async (id: string) => {
  const [{ data: course }, { data: lessons }] = await Promise.all([
    api.get<Course>(`/courses/${id}`),
    api.get<Lesson[]>(`/courses/${id}/lessons`),
  ]);
  return { course, lessons };
};

const CourseDetail = () => {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['course', id], queryFn: () => fetchCourse(id ?? '') });

  if (!data) return null;

  return (
    <section className="section">
      <h2>{data.course.title}</h2>
      <p>{data.course.summary}</p>
      <p>Ұзақтығы: {data.course.durationWeeks} апта</p>
      <Link to={`/quiz/${data.course.id}`} className="btn primary">
        Адаптив тестке кіру (Перейти к тесту)
      </Link>
      <Card title="Сабақтар (Уроки)">
        <Table
          headers={['#', 'Атауы', 'Түрі']}
          rows={data.lessons.map((lesson) => [lesson.order, lesson.title, lesson.type])}
        />
      </Card>
    </section>
  );
};

export default CourseDetail;
