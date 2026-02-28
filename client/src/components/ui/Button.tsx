import * as React from "react"
import { cn } from "../../utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
    size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:ring-2 hover:ring-primary/30 transition-all duration-200',
            secondary: 'bg-transparent border border-primary text-primary font-semibold hover:bg-primary/10 transition-all duration-200',
            outline: 'border border-border bg-transparent text-foreground hover:bg-muted font-medium transition-all duration-200',
            ghost: 'bg-transparent text-foreground/80 hover:bg-muted/50 hover:text-foreground font-medium transition-all duration-200',
            destructive: 'bg-destructive text-destructive-foreground font-semibold shadow-sm hover:bg-destructive/90 transition-all duration-200',
        }
        const sizes = {
            sm: 'h-8 px-4 text-xs',
            md: 'h-[42px] px-5 text-sm',
            lg: 'h-12 px-6 text-base',
            icon: 'h-10 w-10',
        }

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
