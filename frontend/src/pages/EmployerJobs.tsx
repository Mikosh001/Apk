import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import api from '../api/client';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { useToast } from '../components/Toast';

interface Job {
  id: string;
  title: string;
  city: string;
  skillsRequired: string[];
  applications: Array<{ id: string; status: string; user: { name: string } }>;
}

const fetchEmployerJobs = async () => {
  const { data } = await api.get<Job[]>('/jobs/employer/mine');
  return data;
};

const EmployerJobs = () => {
  const [form, setForm] = useState({ title: '', city: '', skillsRequired: '', description: '' });
  const queryClient = useQueryClient();
  const { show } = useToast();
  const jobsQuery = useQuery({ queryKey: ['employer-jobs'], queryFn: fetchEmployerJobs });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/jobs', {
        title: form.title,
        city: form.city,
        description: form.description,
        skillsRequired: form.skillsRequired.split(',').map((s) => s.trim()),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      show('Вакансия жарияланды (Вакансия опубликована)');
      setForm({ title: '', city: '', skillsRequired: '', description: '' });
    },
  });

  return (
    <section className="section">
      <h2>Жұмыс басқару (Управление вакансиями)</h2>
      <Card title="Жаңа вакансия (Новая вакансия)">
        <form>
          <input placeholder="Атауы" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Қала" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <textarea
            placeholder="Сипаттама"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Дағдылар (UAV, Mapping)"
            value={form.skillsRequired}
            onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
          />
          <button type="button" className="btn primary" onClick={() => createMutation.mutate()}>
            Жариялау (Опубликовать)
          </button>
        </form>
      </Card>

      {jobsQuery.data?.map((job) => (
        <Card key={job.id} title={job.title} subtitle={job.city}>
          <Table
            headers={['Кандидат', 'Статус']}
            rows={job.applications.map((app) => [app.user.name, app.status])}
          />
        </Card>
      ))}
    </section>
  );
};

export default EmployerJobs;
