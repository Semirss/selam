import { HTMLAttributes, forwardRef } from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-14 w-14 text-base',
      xl: 'h-24 w-24 text-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-teal-light text-teal-mid font-semibold items-center justify-center',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="aspect-square h-full w-full object-cover" />
        ) : (
          <span>{name ? getInitials(name) : '?'}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
