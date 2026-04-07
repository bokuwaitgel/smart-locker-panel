import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-[#1C1F26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C1F26]/15 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
