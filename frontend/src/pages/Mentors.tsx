import { useQuery } from '@tanstack/react-query';

import api from '../api/client';
import { Card } from '../components/Card';

interface Mentor {
  id: string;
  skills: string[];
  bio: string;
  calendarUrl?: string;
  user: {
    name: string;
  };
}

const fetchMentors = async () => {
  const { data } = await api.get<Mentor[]>('/mentors');
  return data;
};

const Mentors = () => {
  const { data } = useQuery({ queryKey: ['mentors'], queryFn: fetchMentors });

  return (
    <section className="section">
      <h2>Тәлімгерлер (Наставники)</h2>
      <div className="card-grid">
        {data?.map((mentor) => (
          <Card key={mentor.id} title={mentor.user.name} subtitle={mentor.bio}>
            <p>Дағдылар: {mentor.skills.join(', ')}</p>
            {mentor.calendarUrl ? (
              <a href={mentor.calendarUrl} className="btn secondary" target="_blank" rel="noreferrer">
                Онлайн брондау (Онлайн бронь)
              </a>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Mentors;
