import './Checkbox.css';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onChange, className = '' }: CheckboxProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(!checked);
  };

  return (
    <div
      className={`checkbox ${checked ? 'checkbox--checked' : ''} ${className}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
    >
      {checked && (
        <svg
          className="checkbox__icon"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5L5 9L13 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
