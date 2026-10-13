// #region imports
import { ReactNode } from "react"
import { cn } from "@/lib"
// #endregion

export const Header = ({
    title,
    actions,
    className,
}: {
    title: ReactNode
    actions?: ReactNode
    className?: string
}) => (
    <header className={cn(
        "flex items-center justify-between gap-4 flex-wrap mt-4",
        className
    )}>
        <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-xl font-bold text-charcoal-100 truncate">
                {title}
            </h1>
        </div>

        {
            actions &&
            <div className="flex items-center gap-2 flex-wrap justify-end">
                {actions}
            </div>
        }
    </header>
)
