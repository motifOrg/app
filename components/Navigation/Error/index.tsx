// #region imports
import { ReactNode } from "react"

import { Info } from "@/icons"
import { cn } from "@/lib"
// #endregion

export const ErrorComponent = ({
    title = "Something went wrong",
    message = "Please refresh the page or try again in a moment.",
    action,
    className,
}:{
    title?: string
    message?: ReactNode
    action?: ReactNode
    className?: string
}) => (
	<section
		role="alert"
		className={cn(
            "flex flex-col items-center justify-center text-center",
            "gap-3 rounded-2xl bg-paper ring-1 ring-grey-100 p-10",
            className
        )}
	>
        <span className="
            w-10 h-10 rounded-full bg-grey-150 text-error-200
            flex items-center justify-center
        ">
            <Info size={16}/>
        </span>
		<h2 className="text-base font-bold text-charcoal-100">
			{title}
		</h2>
		<p className="text-grey-300 max-w-md">
			{message}
		</p>
        {action}
	</section>
)

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    className,
}:{
    icon?: ReactNode
    title: string
    description?: ReactNode
    action?: ReactNode
    className?: string
}) => (
    <section className={cn(
        "flex flex-col items-center justify-center text-center",
        "gap-3 rounded-2xl border border-dashed border-grey-100 p-10",
        className
    )}>
        {
            icon &&
            <span className="
                w-10 h-10 rounded-full bg-mint-50 text-mint-300
                flex items-center justify-center
            ">
                {icon}
            </span>
        }
        <h2 className="text-base font-bold text-charcoal-100">
            {title}
        </h2>
        {
            description &&
            <p className="text-grey-300 max-w-md">
                {description}
            </p>
        }
        {action}
    </section>
)
