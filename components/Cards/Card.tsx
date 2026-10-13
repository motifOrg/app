import { ReactNode } from "react"

import { cn } from "@/lib"

export const Card = ({ title, description, actions, children, className, bodyClassName }: {
    title?: ReactNode
    description?: ReactNode
    actions?: ReactNode
    children: ReactNode
    className?: string
    bodyClassName?: string
}) => (
    <section className={cn(
        "rounded-2xl bg-paper ring-1 ring-grey-100 flex flex-col",
        className
    )}>
        {
            (title || actions) &&
            <header className="
                flex items-start justify-between gap-4
                px-5 pt-4 pb-3 border-b border-grey-150
            ">
                <div className="flex flex-col gap-0.5 min-w-0">
                    {title && <h2 className="font-bold text-charcoal-100">{title}</h2>}
                    {description && <p className="text-xs text-grey-200">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
            </header>
        }
        <div className={cn("p-5", bodyClassName)}>
            {children}
        </div>
    </section>
)
