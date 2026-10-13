import { ReactNode } from "react"
import { cn } from "@/lib"

export const Stat = ({ label, value, hint, className }: {
    label: string
    value: ReactNode
    hint?: ReactNode
    className?: string
}) => (
    <article className={cn(
        "rounded-2xl bg-paper ring-1 ring-grey-100 p-4 flex flex-col gap-1",
        className
    )}>
        <span>{label}</span>
        <span className="text-2xl font-extrabold tabular-nums text-charcoal-100">
            {value}
        </span>
        {hint && <span className="text-xs text-grey-200">{hint}</span>}
    </article>
)
