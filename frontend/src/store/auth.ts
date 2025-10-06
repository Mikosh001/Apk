import { create } from 'zustand';

type Role = 'student' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  region?: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const getInitial = () => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem('apk-auth');
  return stored ? (JSON.parse(stored) as { token: string; user: User }) : null;
};

const initial = getInitial();

export const useAuthStore = create<AuthState>((set) => ({
  token: initial?.token ?? null,
  user: initial?.user ?? null,
  login: (token, user) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('apk-auth', JSON.stringify({ token, user }));
    }
    set({ token, user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('apk-auth');
    }
    set({ token: null, user: null });
  },
}));
