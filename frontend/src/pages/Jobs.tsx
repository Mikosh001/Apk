import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import api from '../api/client';
import { Card } from '../components/Card';
import { strings } from '../i18n/kk';
import { useToast } from '../components/Toast';

interface Job {
  id: string;
  title: string;
  city: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  skillsRequired: string[];
  score?: number;
  reason?: string[];
}

const fetchJobs = async (params?: { city?: string; skills?: string }) => {
  const { data } = await api.get<Job[]>('/jobs', { params });
  return data;
};

const Jobs = () => {
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const { show } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ['jobs', city, skills];
  const jobsQuery = useQuery({ queryKey, queryFn: () => fetchJobs({ city, skills }) });

  const matchMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get<Job[]>('/jobs', { params: { matchFor: 'me' } });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      show('Жеке ұсыныстар жаңарды (Персональные рекомендации обновлены)');
    },
  });

  return (
    <section className="section">
      <h2>{strings.jobs.title}</h2>
      <form style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input placeholder="Қала" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Дағдылар (,)" value={skills} onChange={(e) => setSkills(e.target.value)} />
        <button type="button" className="btn secondary" onClick={() => jobsQuery.refetch()}>
          Іздеу (Поиск)
        </button>
        <button type="button" className="btn primary" onClick={() => matchMutation.mutate()}>
          {strings.jobs.match}
        </button>
      </form>
      <div className="card-grid" style={{ marginTop: '1.5rem' }}>
        {jobsQuery.data?.map((job) => (
          <Card key={job.id} title={`${job.title} — ${job.city}`} subtitle={job.description}>
            <p>Дағдылар: {job.skillsRequired.join(', ')}</p>
            {job.score ? <p>Match: {(job.score * 100).toFixed(0)}%</p> : null}
            {job.reason && job.reason.length ? <p>Сәйкес дағдылар: {job.reason.join(', ')}</p> : null}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Jobs;
