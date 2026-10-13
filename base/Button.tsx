"use client"

// #region imports
import {
	ButtonHTMLAttributes,
	ReactNode,
	forwardRef
} from "react"

import {
	cn
} from "@/lib"
// #endregion


const buttonVariants = {
	base: `
		flex items-center justify-center gap-2 select-none
		rounded-lg font-main font-semibold text-sm
		normal-case smooth active:scale-98 active:outline-none active:ring-2
		active:ring-offset-2 shrink-0 disabled:opacity-50 whitespace-nowrap
        disabled:cursor-not-allowed cursor-pointer
	`,

	variants: {
		secondary: `
			bg-paper hover:bg-grey-150 active:brightness-95 text-charcoal-100
			ring-1 ring-grey-100 fill-charcoal-100 active:ring-mint-300!
		`,

		primary: `
			bg-mint-300 hover:brightness-110 active:brightness-95
			text-white fill-white active:ring-mint-300!
		`,

		danger: `
			bg-error-200 hover:brightness-110 active:brightness-95
			text-white fill-white active:ring-error-200!
		`,

		neutral: `
			bg-paper active:brightness-95 text-grey-300
			fill-grey-300 ring-1 ring-grey-100 hover:text-charcoal-100
			active:ring-mint-300!
		`,

		ghost: `
			bg-transparent hover:bg-grey-150 active:bg-grey-100
			text-grey-300 hover:text-charcoal-100 fill-current
		`,

		inverted: `
			bg-white hover:bg-grey-150 active:brightness-95
			text-grey-200 fill-white active:ring-charcoal-100 group ring-grey-100
		`,
        text: `
			bg-none text-grey-200  group
            hover:text-mint-300 text-left
		`
	},

	sizes: {
		shrink: "px-3 py-1 text-xs",
		xs: "px-2 py-1 text-xs",
		sm: "px-3 h-8",
		md: "px-4 h-9",
		lg: "px-5 h-10",
		xl: "px-6 h-11",
		full: "px-4 h-9 w-full",
		auto: "px-4 h-9 w-fit",
	}
}

export interface ButtonProps
extends ButtonHTMLAttributes<
	HTMLButtonElement
> {
	variant?: keyof typeof buttonVariants.variants
	size?: keyof typeof buttonVariants.sizes
	disabled?: boolean
	loading?: boolean
	loadingText?: string

	startIcon?: ReactNode
	endIcon?: ReactNode

	children: ReactNode
	className?: string
	textClassName?: string

	fullWidth?: boolean

	onClick?: (
		event: React.MouseEvent<HTMLButtonElement>
	) => void
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			disabled = false,
			loading = false,
			loadingText = "Loading",
			startIcon,
			endIcon,
			children,
			className = "",
			textClassName = "",
			fullWidth = false,
			onClick,
			...props
		},
		ref
	) => {

		const isDisabled = disabled || loading
		const displayText = loading ? loadingText : children

		const displayStartIcon = loading ? (
			<span
				className="loading loading-spinner loading-sm"
			/>
		) : startIcon

		const buttonClasses = cn(
			buttonVariants.base,
			buttonVariants.variants[variant],
			fullWidth ? buttonVariants.sizes.full : buttonVariants.sizes[size],
			className
		)

		const textClasses = cn(
            "flex-1 text-center",
            variant === "text" ? "text-left" : "",
			textClassName
		)


		const handleClick = (
			event: React.MouseEvent<HTMLButtonElement>
		) => {
			if (onClick && !isDisabled)
				onClick(event)
		}

		return (
			<button
				ref={ref}
				className={buttonClasses}
				disabled={isDisabled}
				onClick={handleClick}
				{...props}
			>

				{displayStartIcon && (
					<span
						className="shrink-0"
					>
						{displayStartIcon}
					</span>
				)}

				<p
					className={textClasses}
				>
					{displayText}
				</p>

				{endIcon && !loading && (
					<span
						className="shrink-0"
					>
						{endIcon}
					</span>
				)}
			</button>
		)
	}
)

Button.displayName = "Button"
export default Button
