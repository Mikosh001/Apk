interface SkillChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function SkillChip({ label, selected, onClick }: SkillChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full mr-2 mb-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
        selected ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
      }`}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
