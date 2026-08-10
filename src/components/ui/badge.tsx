import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'warning' | 'outline';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[#1C1F26] text-white',
  secondary: 'bg-slate-100 text-[#1C1F26] ring-1 ring-slate-200',
  success: 'bg-slate-100 text-[#1C1F26] ring-1 ring-slate-200',
  destructive: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  warning: 'bg-[#fef3c7] text-[#a16207] ring-1 ring-[#f2cd54]/60',
  outline: 'bg-white text-[#1C1F26] ring-1 ring-slate-200',
};

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-4 py-1 text-[12px] font-semibold tracking-wide',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
