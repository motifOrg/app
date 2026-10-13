import { ReactNode } from "react"

import { cn } from "@/lib"

export const Pill = ({ children, className }: {
    children: ReactNode
    className?: string
}) => (
    <span className={cn(
        "inline-flex items-center gap-1 h-6 px-2 rounded-md",
        "text-xs font-semibold whitespace-nowrap",
        className
    )}>
        {children}
    </span>
)

export const MetaPill = <T extends string>({ meta, value, className }: {
    meta: Record<T, { label: string, className: string }>
    value: T
    className?: string
}) => (
    <Pill className={cn(meta[value]?.className, className)}>
        {meta[value]?.label ?? value}
    </Pill>
)
