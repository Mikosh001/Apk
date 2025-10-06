import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import api from '../api/client';
import { BadgePill } from '../components/BadgePill';

interface PublicProfileData {
  name: string;
  badges: Array<{ id: string; name: string; level: string }>;
  projectUrl?: string;
}

const fetchProfile = async (id: string) => {
  const { data } = await api.get<PublicProfileData>(`/public/users/${id}`);
  return data;
};

const PublicProfile = () => {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['public-profile', id], queryFn: () => fetchProfile(id ?? '') });

  if (!data) return <p>Жүктелуде...</p>;

  return (
    <section className="section">
      <h2>{data.name}</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {data.badges.map((badge) => (
          <BadgePill key={badge.id} label={badge.name} level={badge.level} />
        ))}
      </div>
      {data.projectUrl ? (
        <p>
          Жоба: <a href={data.projectUrl}>{data.projectUrl}</a>
        </p>
      ) : null}
    </section>
  );
};

export default PublicProfile;
