import { Link } from 'react-router-dom';

import { useAuthStore } from '../store/auth';
import { strings } from '../i18n/kk';

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="navbar" role="banner">
      <div className="navbar-brand">
        <Link to="/" aria-label="Профессия 2.0">
          <span className="logo">Профессия 2.0</span>
        </Link>
      </div>
      <nav className="navbar-links" aria-label="Primary">
        <Link to="/professions">{strings.nav.professions}</Link>
        <Link to="/learning">{strings.nav.learning}</Link>
        <Link to="/jobs">{strings.nav.jobs}</Link>
        <Link to="/mentors">{strings.nav.mentors}</Link>
        <Link to="/portfolio">{strings.nav.portfolio}</Link>
      </nav>
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">{user.name}</span>
            <button type="button" onClick={logout} className="btn secondary">
              {strings.common.logout}
            </button>
          </>
        ) : (
          <Link to="/auth/login" className="btn primary">
            {strings.common.login}
          </Link>
        )}
      </div>
    </header>
  );
};
