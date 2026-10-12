"use client"

// #region imports
import {
	forwardRef,
	InputHTMLAttributes,
} from "react"

import {
	cn
} from "@/lib"
// #endregion

const checkboxVariants = {
	base: `
		checkbox checkbox-primary disabled:opacity-50
        disabled:cursor-not-allowed smooth
		border border-grey-200 checked:bg-mint-300
		rounded-sm checked:border-mint-300 checked:text-white
	`,
	sizes: {
		sm: "checkbox-sm",
		md: "checkbox-md",
		lg: "checkbox-lg",
	}
}

const columnClasses: Record<number, string> = {
	1: "grid-cols-1",
	2: "grid-cols-2",
	3: "grid-cols-3",
	4: "grid-cols-4",
	5: "grid-cols-5",
	6: "grid-cols-6",
}

export interface CheckboxOption {
	name: string
	value: string
}

export interface CheckboxGroupProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
	options: CheckboxOption[]
	value: string[]
	size?: keyof typeof checkboxVariants.sizes
	columns?: number
	gap?: string
	className?: string
	onChange: (value: string[]) => void
}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
	(
		{
			options,
			value,
			size = "md",
			columns = 2,
			gap = "gap-3",
			className = "",
			onChange,
			...props
		},
		ref
	) => {
		const handleToggle = (val: string) => {
			if (value.includes(val)) {
				onChange(value.filter((v) => v !== val))
			} else {
				onChange([...value, val])
			}
		}

		const wrapperClasses = cn(
			"grid",
			gap,
			columnClasses[columns] || columnClasses[2],
			className
		)

		const checkboxClasses = cn(
			checkboxVariants.base,
			checkboxVariants.sizes[size]
		)

		return (
			<div ref={ref} className={wrapperClasses}>
				{options.map((opt) => (
					<label
						key={opt.value}
						className="
							flex items-center gap-2 cursor-pointer select-none
							text-grey-300 text-sm font-medium has-checked:text-charcoal-100
						"
					>
						<input
							type="checkbox"
							className={checkboxClasses}
							checked={value.includes(opt.value)}
							onChange={() => handleToggle(opt.value)}
							{...props}
						/>
						<span>{opt.name}</span>
					</label>
				))}
			</div>
		)
	}
)

CheckboxGroup.displayName = "CheckboxGroup"
export default CheckboxGroup
