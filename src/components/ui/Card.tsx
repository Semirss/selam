import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverLift = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface rounded-lg shadow-sm border border-gray-light overflow-hidden',
          hoverLift && 'hover-lift',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
