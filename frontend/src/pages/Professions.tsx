import { useQuery } from '@tanstack/react-query';

import { Card } from '../components/Card';
import api from '../api/client';
import { strings } from '../i18n/kk';

interface Course {
  id: string;
  title: string;
  summary: string;
  skills: string[];
}

const fetchCourses = async () => {
  const { data } = await api.get<Course[]>('/courses');
  return data;
};

const Professions = () => {
  const { data } = useQuery({ queryKey: ['courses'], queryFn: fetchCourses });

  return (
    <section className="section">
      <h2>{strings.nav.professions}</h2>
      <div className="card-grid">
        {data?.map((course) => (
          <Card key={course.id} title={course.title} subtitle={course.summary}>
            <p>{course.skills.join(', ')}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Professions;
