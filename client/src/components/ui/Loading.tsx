import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export const Spinner: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className={cn('rounded-full border-2 border-muted bg-transparent', sizes[size])} />
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-primary border-t-transparent',
            'animate-spin',
            sizes[size]
          )}
        />
      </div>
      {text && <p className="text-sm text-muted-foreground font-medium">{text}</p>}
    </div>
  );
};

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn('rounded-lg bg-muted/50 animate-pulse', className)}
    {...props}
  />
);

export const Loading: React.FC<LoadingProps & { fullscreen?: boolean; overlay?: boolean }> = ({
  size = 'md',
  text,
  fullscreen = false,
  overlay = true,
}) => {
  if (fullscreen) {
    return (
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        overlay && 'bg-black/30 backdrop-blur-sm'
      )}>
        <Spinner size={size} text={text} />
      </div>
    );
  }

  return <Spinner size={size} text={text} />;
};
