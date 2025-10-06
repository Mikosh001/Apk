import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/client';
import { useAuthStore } from '../store/auth';
import { useToast } from '../components/Toast';
import { strings } from '../i18n/kk';

const AuthRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const { login } = useAuthStore();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await api.post('/auth/register', form);
    login(data.token, data.user);
    show('Тіркелу сәтті (Регистрация успешна)');
    navigate('/learning');
  };

  return (
    <section className="section">
      <h2>{strings.common.register}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Аты" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Құпиясөз (Пароль)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="student">Студент</option>
          <option value="employer">Жұмыс беруші</option>
        </select>
        <button type="submit" className="btn primary">
          {strings.common.register}
        </button>
      </form>
    </section>
  );
};

export default AuthRegister;
