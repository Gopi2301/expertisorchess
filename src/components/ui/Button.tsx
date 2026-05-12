import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-bg-brand text-text-on-brand hover:bg-bg-brand-hover font-semibold shadow-sm active:scale-95',
  secondary: 'bg-bg-strong text-text-primary hover:bg-bg-elevated border border-border',
  danger: 'bg-bg-error text-error-strong hover:bg-red-900 border border-red-900',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-strong',
  outline: 'border border-border-strong text-text-primary hover:border-bg-brand hover:text-bg-brand',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center transition-all duration-150
      disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
      ${variantClasses[variant]} ${sizeClasses[size]} ${className}
    `}
    {...props}
  >
    {loading ? <Loader2 className="animate-spin" size={14} /> : icon}
    {children}
  </button>
);
