"use client"

// #region imports
import {
    TextareaHTMLAttributes,
    ReactNode,
    forwardRef
} from "react"

import { cn } from "@/lib"
// #endregion

const textAreaVariants = {
    base: `
        font-main p-2 rounded-lg
        font-normal text-sm h-fit
        transition-all ease-in-out delay-100
        has-disabled:opacity-60 has-disabled:cursor-not-allowed
        resize-none text-charcoal-100
    `,
    variants: {
        standard: `
            bg-transparent border-none border-grey-100 rounded-none
            focus-within:ring-none text-grey-300 focus:outline-none
        `,
        filled: `
            bg-grey-150 hover:bg-grey-100
            focus-within:bg-white
            focus-within:ring-1 focus-within:ring-mint-200
            focus-within:ring-inset
        `,
        outlined: `
            bg-white border border-grey-100 hover:border-grey-200/60
            focus-within:border-mint-200
            focus-within:ring-1 focus-within:ring-mint-200 focus-within:ring-inset
        `
    },
    sizes: {
        sm: "text-sm px-2",
        md: "text-sm py-2 px-3",
        lg: "text-base py-3 px-4"
    },
    colors: {
        default: "text-charcoal-100",
        disabled: "text-grey-300",
        error: "text-error",
        success: "text-green-500"
    }
}

export interface ITextAreaProps
extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
    variant?: keyof typeof textAreaVariants.variants
    size?: keyof typeof textAreaVariants.sizes
    disabled?: boolean
    fullWidth?: boolean
    error?: boolean
    loading?: boolean
    color?: keyof typeof textAreaVariants.colors

    label?: string
    helperText?: string
    endIcon?: ReactNode

    slotProps?: {
        textarea?: {
            className?: string
        }
    }
    className?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, ITextAreaProps>(
    (
        {
            variant = "outlined",
            size = "md",
            disabled = false,
            fullWidth = false,
            error = false,
            loading = false,
            label,
            helperText,
            endIcon,
            slotProps,
            className = "",
            ...props
        },
        ref
    ) => {

        const wrapperClasses = cn(
            "flex flex-col gap-1 relative",
            textAreaVariants.base,
            textAreaVariants.variants[variant],
            textAreaVariants.sizes[size],
            error && "border-error-200! ring-error-200 ring-1 ring-inset",
            fullWidth && "w-full",
            label && "mt-6",
            className
        )

        const textareaClasses = cn(
            `
                flex-1 bg-transparent outline-none w-full 
                min-h-24 placeholder:text-grey-200
            `,
            slotProps?.textarea?.className
        )

        const displayEndIcon = loading ? (
			<span
				className="loading loading-spinner loading-sm text-mint-300"
			/>
		) : endIcon

        return (
            <div 
                className={wrapperClasses}
                data-error={error}
            >
                {label && (
                    <label className="
						text-xs text-grey-300 font-semibold
						absolute -top-5.5 left-0
					">
                        {label}
                    </label>
                )}

                <div className="
					flex items-start gap-2
				">
                    <textarea
                        ref={ref}
                        className={textareaClasses}
                        disabled={disabled}
                        {...props}
                    />

                    {endIcon && (
						<span className="
							shrink-0 self-end
						">
							{displayEndIcon}
						</span>
					)}
                </div>

                {helperText && (
                    <label
                        className={cn(
                            "text-xs font-medium absolute -top-5.5 right-0",
                            error ? "text-error-200" : "text-grey-200"
                        )}
                    >
                        {helperText}
                    </label>
                )}
            </div>
        )
    }
)

TextArea.displayName = "TextArea"
export default TextArea
