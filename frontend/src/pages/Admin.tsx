import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import api from '../api/client';
import { Card } from '../components/Card';
import { Table } from '../components/Table';

interface Course {
  id: string;
  title: string;
  slug: string;
  summary: string;
  skills: string[];
}

const fetchCourses = async () => {
  const { data } = await api.get<Course[]>('/courses');
  return data;
};

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: '', slug: '', summary: '', skills: '' });
  const coursesQuery = useQuery({ queryKey: ['admin-courses'], queryFn: fetchCourses });

  const createCourse = useMutation({
    mutationFn: async () => {
      await api.post('/admin/courses', {
        title: form.title,
        slug: form.slug,
        summary: form.summary,
        skills: form.skills.split(',').map((s) => s.trim()),
        durationWeeks: 4,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setForm({ title: '', slug: '', summary: '', skills: '' });
    },
  });

  return (
    <section className="section">
      <h2>Әкімші панелі (Админ панель)</h2>
      <Card title="Курс қосу (Добавить курс)">
        <form>
          <input placeholder="Атауы" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <textarea
            placeholder="Сипаттама"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <input
            placeholder="Дағдылар"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
          <button type="button" className="btn primary" onClick={() => createCourse.mutate()}>
            Қосу (Добавить)
          </button>
        </form>
      </Card>

      <Card title="Бар курстар (Текущие курсы)">
        <Table
          headers={['Атауы', 'Slug', 'Дағдылар']}
          rows={(coursesQuery.data ?? []).map((course) => [course.title, course.slug, course.skills.join(', ')])}
        />
      </Card>
    </section>
  );
};

export default AdminPage;
