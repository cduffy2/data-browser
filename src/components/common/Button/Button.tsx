import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'plain';
  size?: 'sm' | 'md';
}

export function Button({
  children,
  onClick,
  variant = 'plain',
  size = 'sm'
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
