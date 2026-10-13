"use client"

// #region imports
import {
	CSSProperties,
	forwardRef,
	isValidElement,
	ReactElement,
	ReactNode,
	Ref,
	useState,
} from "react"

import { cn } from "@/lib"
import Button from "./Button"
// #endregion

export interface ISelectOption {
	label: string
	value: string
	disabled?: boolean
}

export interface ISelectProps<T> {
    label?: string
    name?: string
    error?: boolean
    helperText?: string
	options?: T[]
	selected?: T | string
	placeholder?: string
	disabled?: boolean
	required?: boolean
	variant?: "primary" | "neutral"
	className?: string
	buttonClassName?: string
	buttonStyle?: CSSProperties
	dropClassName?: string
	onChange?: (value: T | undefined) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObject = (val: any): val is { label: string } =>
	val && typeof val === "object" && "label" in val

const Select = <T extends string | ISelectOption | ReactNode>(
	{
        name="",
        label,
        error,
        helperText,
		options,
		selected,
		placeholder,
		disabled,
		required = false,
		className = "",
		buttonClassName = "",
		buttonStyle,
		dropClassName = "",
		onChange
	}: ISelectProps<T>,
	ref: Ref<HTMLDivElement>
) => {

	const [internalSelected, setInternalSelected] = useState<T | undefined | string>(selected)
	const [previous, setPrevious] = useState<T | undefined | string>(selected)

	if (selected !== previous) {
		setPrevious(selected)
		if (selected !== undefined) setInternalSelected(selected)
	}

    const getValue = (val: unknown): string | undefined => {
        if (typeof val === "string") return val
        if (isObject(val)) return (val as ISelectOption).value
        return undefined
    }

    const matches = (opt: T) =>
        isObject(opt) && isObject(internalSelected)
            ? opt.label === internalSelected.label
            : isObject(opt) && typeof internalSelected === "string"
                ? (opt as ISelectOption).value === internalSelected
                : opt === internalSelected

	const handleSelect = (opt: T) => {
		const isPrev = matches(opt)

		if (isPrev && required) {
			const element = document.activeElement
			if (element && element instanceof HTMLElement)
				element.blur()
			return
		}

		setInternalSelected(
			isPrev ? undefined : opt
		)
		onChange?.(
			isPrev ? undefined : opt
		)

		const element = document.activeElement
    	if (element && element instanceof HTMLElement)
			element.blur()
	}

	const selectedOption = options?.find(matches)

	const wrapperClasses = cn(
        label && "mt-6",
        "dropdown relative",
        !/(^|\s)w-/.test(className) && "w-full",
        className
    )

	return (
		<div
			ref={ref}
			className={wrapperClasses}
			onClick={e => e.stopPropagation()}
		>
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={getValue(internalSelected) || ""}
                />
            )}

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


			<Button
                type="button"
				tabIndex={0}
				variant="inverted"
				size="full"
				style={buttonStyle}
				textClassName="text-ellipsis truncate text-left font-semibold"
				endIcon={<span className="ml-2 text-xs opacity-60">&#9662;</span>}
				disabled={disabled}
				data-selected={!!selectedOption}
				className={cn(
                    "rounded-lg ring-1! ring-transparent! relative px-3!",
                    "data-[selected=true]:text-charcoal-100",
                    "focus:ring-mint-200! focus:ring-2!",
                    error && "ring-error! ring-1! ring-inset!",
                    buttonClassName
                )}
			>
					{
						isObject(selectedOption)
						? selectedOption?.label
						: selectedOption || (placeholder || "Select")
					}
			</Button>

			<ul
				tabIndex={0}
				className={cn(
					`
						dropdown-content p-1.5 mt-1 min-w-full w-max shadow-lg rounded-xl bg-white
						ring-1 ring-grey-100 space-y-0.5 max-h-[40vh] overflow-y-auto z-50 absolute
					`,
					dropClassName
				)}
			>
				{options?.map((opt, index) => {
					if (isValidElement(opt)) return opt

					const isObj = isObject(opt)
					const isSelected = matches(opt)

					return (
						<li
							key={index}
							className="
								rounded-md px-3 py-1.5 cursor-pointer text-charcoal-100 text-sm
								data-[selected=true]:bg-mint-50 data-[selected=true]:text-mint-300
								hover:bg-grey-150 truncate
								data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
							"
							data-selected={isSelected}
							data-disabled={isObj && !!opt.disabled}
							onClick={() => {
								if (!isObj || !opt.disabled) handleSelect(opt)
							}}
						>
							{isObj ? opt.label : opt}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

Select.displayName = "Select"

export default forwardRef(Select) as <T extends string | ISelectOption | ReactNode>(
	props: ISelectProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement
