import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-[#1C1F26] text-white hover:bg-[#1C1F26]/90 shadow-sm',
  secondary: 'bg-[#fef3c7] text-[#1C1F26] hover:bg-[#f2cd54]/80 shadow-sm',
  outline: 'border border-slate-200 bg-white text-[#1C1F26] hover:bg-slate-50',
  ghost: 'text-[#1C1F26] hover:bg-slate-100',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-6',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1F26]/20',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
