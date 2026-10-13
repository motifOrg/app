"use client"

// #region imports
import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode
} from "react"

import {
	cn
} from "@/lib"
// #endregion

const iconButtonVariants = {
	base: `
		inline-flex items-center justify-center rounded-full
		smooth active:scale-98 focus:outline-none focus:ring-2
		ring-white desktop:scale-120 cursor-pointer disabled:opacity-50
		disabled:cursor-not-allowed [&>svg]:pointer-events-none
	`,
	variants: {
		primary: `
			[&>svg]:fill-mint-300
			hover:bg-mint-50
			active:ring-mint-300
		`,
		secondary: `
			[&>svg]:fill-charcoal-100
			active:ring-charcoal-100
		`,
		danger: `
			[&>svg]:fill-error-200
			active:ring-error-200
		`,
		neutral: `
			[&>svg]:fill-grey-200
			active:ring-grey-200
		`,
		ghost: `
			[&>svg]:fill-grey-300 hover:bg-grey-150
			hover:[&>svg]:fill-charcoal-100
			active:ring-grey-200
		`,
		transparent: `
			[&>svg]:fill-white
			active:ring-transparent
			focus:ring-transparent
		`,
        fill: `
            bg-mint-100 text-mint-300 [&>svg]:fill-mint-300
			active:ring-transparent
			focus:ring-transparent
		`,
	},
	sizes: {
        xs: "w-6 h-6",
		sm: "w-8 h-8",
		md: "w-9 h-9",
		lg: "w-11 h-11",
	},
}


export interface IconButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: keyof typeof iconButtonVariants.variants
	size?: keyof typeof iconButtonVariants.sizes
    loading?: boolean
	disabled?: boolean
	children: ReactNode
	className?: string
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			disabled = false,
            loading,
			children,
			className,
			...props
		},
		ref
	) => {

		const buttonClasses = cn(
			"hover:brightness-80 active:brightness-85",
			iconButtonVariants.base,
			iconButtonVariants.variants[variant],
			iconButtonVariants.sizes[size],
			className
		)

		return (
			<button
				ref={ref}
				className={buttonClasses}
				disabled={disabled}
				{...props}
			>
				{
                    loading ? (
                        <span
                            className="loading loading-spinner loading-sm"
                        />
                    ) : children
                }
			</button>
		)
	}
)

IconButton.displayName = "IconButton"
export default IconButton
