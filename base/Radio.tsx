"use client"

// #region imports
import {
	forwardRef,
	InputHTMLAttributes,
	ReactNode
} from "react"

import {
	cn
} from "@/lib"
// #endregion

const radioVariants = {
	base: `
		radio transition-all duration-150 ease-in-out
		border-2 border-grey-300 checked:text-mint-300
		checked:bg-white-100 checked:border-mint-300
		disabled:opacity-50 disabled:cursor-not-allowed
		hover:bg-paper peer text-base desktop:text-base
	`,
	sizes: {
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
	}
}

export interface IRadioProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
	label?: ReactNode
	size?: keyof typeof radioVariants.sizes
	className?: string
	labelClassName?: string
}

const Radio = forwardRef<HTMLInputElement, IRadioProps>(
	(
		{
			label,
			size = "md",
			className = "",
			labelClassName = "",
			...props
		},
		ref
	) => {
		const radioClasses = cn(
			radioVariants.base,
			radioVariants.sizes[size],
			className
		)

		const labelClasses = cn(
			"font-main whitespace-nowrap text-grey-200 font-medium",
            "flex items-center gap-2 cursor-pointer",
			labelClassName
		)

		return label ? (
			<label className={labelClasses}>
				<input
					ref={ref}
					type="radio"
					className={radioClasses}
					{...props}
				/>
				<span className="peer-checked:text-black!">
                    {label}
                </span>
			</label>
		) : (
			<input
				ref={ref}
				type="radio"
				className={radioClasses}
				{...props}
			/>
		)
	}
)

Radio.displayName = "Radio"
export default Radio
