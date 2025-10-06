import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export const Card = ({ title, subtitle, children, actions }: Props) => (
  <article className="card">
    <header>
      <h3>{title}</h3>
      {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
    </header>
    <div className="card-content">{children}</div>
    {actions ? <div className="card-actions">{actions}</div> : null}
  </article>
);
