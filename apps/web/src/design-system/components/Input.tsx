import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10',
        lg: 'h-11 text-base',
      },
      state: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, type = 'text', ...props }, ref) => (
    <input type={type} className={cn(inputVariants({ size, state, className }))} ref={ref} {...props} />
  ),
);
Input.displayName = 'Input';

export { inputVariants };
