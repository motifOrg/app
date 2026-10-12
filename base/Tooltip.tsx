"use client"

// #region imports
import {
    ReactNode,
    HTMLAttributes,
    forwardRef,
} from "react"

import { cn } from "@/lib"
// #endregion

export interface ITooltip
    extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode

    side?: "top" | "bottom" | "left" | "right"
    className?: string
    tooltipClassName?: string
}

const sideClasses = {
    top: `
        bottom-full left-1/2 -translate-x-1/2
        mb-2
    `,
    bottom: `
        top-full left-1/2 -translate-x-1/2
        mt-2
    `,
    left: `
        right-full top-1/2 -translate-y-1/2
        mr-2
    `,
    right: `
        left-full top-1/2 -translate-y-1/2
        ml-2
    `,
}

const Tooltip = forwardRef<HTMLDivElement, ITooltip>(
    (
        {
            children,
            content,
            side = "top",
            className = "",
            tooltipClassName = "",
            ...props
        },
        ref
    ) => (
        <div
            ref={ref}
            {...props}
            className={cn(
                "relative inline-flex group",
                className
            )}
        >
            {children}

            <aside
                className={cn(
                    `
                        absolute z-200
                        pointer-events-none
                        opacity-0 scale-95
                        group-hover:opacity-100
                        group-hover:scale-100
                        group-focus-within:opacity-100
                        group-focus-within:scale-100
                        transition-all duration-200
                        w-max max-w-64 whitespace-normal
                        font-medium leading-snug normal-case

                        rounded-md
                        bg-charcoal-100
                        text-white
                        text-xs
                        px-2.5 py-1.5
                        shadow-md
                    `,
                    sideClasses[side],
                    tooltipClassName
                )}
            >
                {content}
            </aside>
        </div>
    )
)

Tooltip.displayName = "Tooltip"
export default Tooltip