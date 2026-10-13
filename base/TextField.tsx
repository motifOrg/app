"use client"

// #region imports
import {
	InputHTMLAttributes,
	ReactNode,
	forwardRef
} from "react"

import { cn } from "@/lib"
// #endregion


const textFieldVariants = {
	base: `
		font-main rounded-lg
		font-normal text-sm
		transition-all ease-in-out delay-100
		has-disabled:opacity-60 has-disabled:cursor-not-allowed
	`,
	variants: {
		standard: `
			bg-transparent border-none border-grey-100 rounded-none
			focus-within:ring-none text-grey-300 focus:outline-none
		`,
		filled: `
			bg-grey-150 hover:bg-grey-100
			focus-within:bg-white
			focus-within:ring-1 focus-within:ring-mint-200 focus-within:ring-inset
		`,
		outlined: `
			bg-white border border-grey-100 hover:border-grey-200/60
			focus-within:border-mint-200
			focus-within:ring-1 focus-within:ring-mint-200 focus-within:ring-inset
		`
	},
	sizes: {
		sm: "text-xs h-8 justify-center px-2.5",
		md: "text-sm h-9 justify-center px-3",
		lg: "text-base h-11 justify-center px-4"
	},
	colors: {
		default: "text-charcoal-100",
		disabled: "text-grey-200",
		error: "text-error",
		success: "text-green-500"
	}
}

export interface ITextFieldProps
extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	variant?: keyof typeof textFieldVariants.variants
	size?: keyof typeof textFieldVariants.sizes
	disabled?: boolean
	fullWidth?: boolean
    error?: boolean

	color?: keyof typeof textFieldVariants.colors

	label?: string
	helperText?: ReactNode
	startIcon?: ReactNode
	endIcon?: ReactNode

	slotProps?: {
		input?: {
			disableUnderline?: boolean
			className?: string
		}
	}

	className?: string
}

const TextField = forwardRef<HTMLInputElement, ITextFieldProps>(
	(
		{
			variant = "outlined",
			size = "md",
			disabled = false,
			fullWidth = false,
            error = false,
			label,
			helperText,
			startIcon,
			endIcon,
			slotProps,
			className = "",
			...props
		},
		ref
	) => {

		const wrapperClasses = cn(
			"flex flex-col gap-1 relative",
			textFieldVariants.base,
			textFieldVariants.variants[variant],
			textFieldVariants.sizes[size],
			fullWidth && "w-full",
			label && "mt-6",
            error && "border-error! ring-error ring-1 ring-inset",
			className
		)

		const inputClasses = cn(
			"flex-1 min-w-0 bg-transparent outline-none placeholder:text-grey-200 text-charcoal-100",
			slotProps?.input?.disableUnderline && "border-none",
			slotProps?.input?.className
		)

		return (
			<div
                className={wrapperClasses}
                data-error={error}
            >
				{label && (
					<label
                        className="
                            text-xs text-grey-300 font-semibold
                            absolute -top-5.5 left-0
                        "
					>
						{label}
					</label>
				)}

				<div
					className="flex items-center gap-2"
				>
					{startIcon && (
						<span className="shrink-0">
                            {startIcon}
                        </span>
					)}

					<input
						ref={ref}
						className={inputClasses}
						disabled={disabled}
						{...props}
					/>

					{endIcon && (
						<span className="shrink-0">
							{endIcon}
						</span>
					)}
				</div>

				{helperText && (
                    <label
                        className={cn(
                            "text-xs font-medium absolute -top-5.5 right-0",
							
                            error ?
							"text-error animate-fade-in-fast" :
							"text-grey-200"
                        )}
                    >
                        {helperText}
                    </label>
                )}
			</div>
		)
	}
)

TextField.displayName = "TextField"
export default TextField
