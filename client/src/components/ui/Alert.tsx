import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning';

const variants: Record<AlertVariant, { container: string; icon: string; title: string; description: string }> = {
  default: {
    container: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-800/80 dark:text-blue-200/80',
  },
  destructive: {
    container: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-100',
    description: 'text-red-800/80 dark:text-red-200/80',
  },
  success: {
    container: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-900 dark:text-green-100',
    description: 'text-green-800/80 dark:text-green-200/80',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-900 dark:text-yellow-100',
    description: 'text-yellow-800/80 dark:text-yellow-200/80',
  },
};

const iconMap = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, description, children, ...props }, ref) => {
    const variantStyles = variants[variant];
    const IconComponent = iconMap[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border p-4 flex gap-3',
          variantStyles.container,
          className
        )}
        {...props}
      >
        <IconComponent className={cn('h-5 w-5 shrink-0 mt-0.5', variantStyles.icon)} />
        <div className="flex-1 space-y-1">
          {title && <h4 className={cn('font-semibold text-sm', variantStyles.title)}>{title}</h4>}
          {description && <p className={cn('text-sm', variantStyles.description)}>{description}</p>}
          {children && !description && <div className={cn('text-sm', variantStyles.description)}>{children}</div>}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
);

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
);

AlertDescription.displayName = 'AlertDescription';
