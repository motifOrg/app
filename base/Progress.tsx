// #region imports
import {
    forwardRef,
    ProgressHTMLAttributes
} from "react"

import { cn } from "@/lib"
// #endregion

const progressVariants = {
    base: `
        transition-all ease-in-out delay-75
    `,
    variants: {
        primary: "progress-primary",
        secondary: "progress-secondary",
        accent: "progress-accent",
        neutral: "progress-neutral"
    },
    sizes: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3"
    },
    radius: {
        none: "rounded-none",
        sm: "rounded",
        md: "rounded-md",
        full: "rounded-full"
    }
}

export interface ProgressProps
extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, "size"> {
    variant?: keyof typeof progressVariants.variants
    size?: keyof typeof progressVariants.sizes
    radius?: keyof typeof progressVariants.radius
    fullWidth?: boolean
    className?: string
    value?: number,
    max?: number
}

const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
    (
        {
            variant = "primary",
            size = "sm",
            radius = "full",
            fullWidth = true,
            value,
            max = 100,
            className,
            ...props
        },
        ref
    ) => {

        const progressClasses = cn(
            "progress bg-mint-100 progress-primary smooth",
            progressVariants.base,
            progressVariants.variants[variant],
            progressVariants.sizes[size],
            progressVariants.radius[radius],
            fullWidth && "w-full",
            className
        )

        return (
            <progress
                {...props}
                ref={ref}
                className={progressClasses}
                {
                    ...value ? 
                    { value, max }:
                    undefined
                }
            />
        )
    }
)

Progress.displayName = "Progress"
export default Progress