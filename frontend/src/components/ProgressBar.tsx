type Props = {
  value: number;
};

export const ProgressBar = ({ value }: Props) => (
  <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
    <div className="progress-inner" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);
