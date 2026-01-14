import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'purple' | 'teal' | 'orange' | 'green';
}

export function Badge({ children, color = 'purple' }: BadgeProps) {
  return <span className={`badge badge--${color}`}>{children}</span>;
}
