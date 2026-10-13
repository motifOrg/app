// #region imports
import {
	ReactNode
} from "react"

import {
	Info
} from "@/icons"

import { cn } from "@/lib"
// #endregion

const informationVariants = {
	info: "bg-mint-50 text-charcoal-100 [&_svg]:fill-mint-300 ring-mint-100",
	warning: "bg-amber-100 text-amber-200 [&_svg]:fill-amber-200 ring-amber-100",
	error: "bg-grey-150 text-error-200 [&_svg]:fill-error-200 ring-grey-100",
	neutral: "bg-grey-150 text-grey-300 [&_svg]:fill-grey-200 ring-grey-100",
}

const InformationCard = ({
	description,
	title,
	action,
	variant = "info",
    styles,
}:{
	description: ReactNode
	title?: string
	action?: ReactNode
	variant?: keyof typeof informationVariants
    styles?: string
}) => {
	return (
		<aside
			className={cn(
                "rounded-xl p-3 px-4 ring-1",
                "flex items-start gap-3 font-medium",
                "max-w-full",
				informationVariants[variant],
				styles
			)}
		>
			<div
				className="py-0.5 shrink-0"
			>
				<Info size={14}/>
			</div>

			<div className="flex-1 space-y-0.5 text-sm">
				{title && (
					<p className="font-bold">
						{title}
					</p>
				)}
				<div className="leading-snug opacity-90">
					{description}
				</div>
			</div>

			{action && (
				<div className="shrink-0 self-center">
					{action}
				</div>
			)}
		</aside>
	)
}

export default InformationCard
