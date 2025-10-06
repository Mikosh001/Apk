type Props = {
  label: string;
  level?: string;
};

export const BadgePill = ({ label, level }: Props) => (
  <span className={`badge ${level?.toLowerCase()}`} aria-label={label}>
    {label}
    {level ? <small> {level}</small> : null}
  </span>
);
