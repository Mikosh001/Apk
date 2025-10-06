import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import api from '../api/client';
import { BadgePill } from '../components/BadgePill';
import { Card } from '../components/Card';
import { useAuthStore } from '../store/auth';
import { strings } from '../i18n/kk';
import { useToast } from '../components/Toast';

interface Badge {
  id: string;
  name: string;
  level: string;
}

const fetchBadges = async () => {
  const { data } = await api.get<Badge[]>('/me/badges');
  return data;
};

const Portfolio = () => {
  const { user } = useAuthStore();
  const { data } = useQuery({ queryKey: ['badges'], queryFn: fetchBadges });
  const profileQuery = useQuery({
    queryKey: ['me-profile'],
    queryFn: async () => {
      const { data: profile } = await api.get<{ portfolioUrl?: string; region?: string }>('/me/profile');
      return profile;
    },
    enabled: Boolean(user),
  });
  const [projectUrl, setProjectUrl] = useState('');

  useEffect(() => {
    if (profileQuery.data) {
      setProjectUrl(profileQuery.data.portfolioUrl ?? '');
    }
  }, [profileQuery.data]);
  const [selectedBadgeQr, setSelectedBadgeQr] = useState<string | null>(null);
  const { show } = useToast();

  const handleQr = async (badgeId: string) => {
    const { data: qr } = await api.get<{ qrcode: string }>(`/me/badge/${badgeId}/qrcode`);
    setSelectedBadgeQr(qr.qrcode);
  };

  const handleSaveProject = async () => {
    await api.post('/me/portfolio', { portfolioUrl: projectUrl });
    profileQuery.refetch();
    show('Жоба сақталды (Проект сохранён)');
  };

  const shareLink = user && typeof window !== 'undefined' ? `${window.location.origin}/u/${user.id}` : '';

  return (
    <section className="section">
      <h2>{strings.portfolio.title}</h2>
      {user ? (
        <Card title={user.name} subtitle={profileQuery.data?.region ?? ''}>
          <p>Рөлі: {user.role}</p>
          <p>
            Портфолио QR: <a href={shareLink}>{shareLink}</a>
          </p>
        </Card>
      ) : null}

      <Card title={strings.portfolio.badges}>
        <div className="card-content" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {data?.map((badge) => (
            <button key={badge.id} type="button" className="btn secondary" onClick={() => handleQr(badge.id)}>
              <BadgePill label={badge.name} level={badge.level} />
            </button>
          ))}
        </div>
        {selectedBadgeQr ? <img src={selectedBadgeQr} alt="Badge QR" style={{ maxWidth: '200px' }} /> : null}
      </Card>

      <Card title="Мини-жоба (Мини-проект)">
        <input
          type="url"
          placeholder="YouTube немесе файл сілтемесі"
          value={projectUrl}
          onChange={(event) => setProjectUrl(event.target.value)}
        />
        <button type="button" className="btn primary" onClick={handleSaveProject}>
          {strings.common.save}
        </button>
        {projectUrl ? (
          <p>
            Жоба сілтемесі: <a href={projectUrl}>{projectUrl}</a>
          </p>
        ) : null}
      </Card>
    </section>
  );
};

export default Portfolio;
