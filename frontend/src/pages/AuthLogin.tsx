import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/client';
import { useAuthStore } from '../store/auth';
import { useToast } from '../components/Toast';
import { strings } from '../i18n/kk';

const AuthLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuthStore();
  const { show } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await api.post('/auth/login', form);
    login(data.token, data.user);
    show('Қош келдіңіз! (Добро пожаловать)');
    navigate('/learning');
  };

  return (
    <section className="section">
      <h2>{strings.common.login}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn primary">
          {strings.common.login}
        </button>
      </form>
    </section>
  );
};

export default AuthLogin;
