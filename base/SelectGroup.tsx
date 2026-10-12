"use client"

// #region imports
import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useState,
} from "react"

import { cn } from "@/lib"
import { Radio } from "@/base"
// #endregion

export interface ISelectOption {
    name: string
    value: string
}

export interface ISelectGroupProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "size" | "onChange"
    > {
    options: ISelectOption[]
    value?: string
    columns?: number
    gap?: string
    className?: string
    title?: string
    onChange?: (value: string) => void
}

const columnClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
}

const SelectGroup = forwardRef<
    HTMLDivElement,
    ISelectGroupProps
>(
    (
        {
            options,
            value,
            defaultValue,
            columns = 1,
            gap = "gap-3",
            title,
            className = "",
            name,
            onChange,
            ...props
        },
        ref
    ) => {
        const [selected, setSelected] =
            useState<string | null>(
                (
                    value ??
                    defaultValue ??
                    null
                ) as string | null
            )

        useEffect(() => {
            if (value !== undefined) {
                setSelected(
                    value as string | null
                )
            }
        }, [value])

        const wrapperClasses = cn(
            "flex flex-col gap-1 relative",
            className
        )

        const gridClass = cn(
            "grid",
            gap,
            columnClasses[columns] ||
                columnClasses[1]
        )

        return (
            <div
                ref={ref}
                className={wrapperClasses}
            >
                {title && (
                    <label
                        className="
                            text-sm text-grey-200 
                            font-medium absolute 
                            -top-6 left-0
                        "
                    >
                        {title}
                    </label>
                )}

                <aside className={gridClass}>
                    {options.map(opt => (
                        <label
                            key={opt.value}
                        >
                            <input
                                hidden
                                type="radio"
                                name={name}
                                value={opt.value}
                                checked={
                                    selected ===
                                    opt.value
                                }
                                onChange={() => {
                                    setSelected(
                                        opt.value
                                    )

                                    onChange?.(
                                        opt.value
                                    )
                                }}
                            />

                            <Radio
                                onChange={()=>""}
                                checked={
                                    selected ===
                                    opt.value
                                }
                                label={opt.name}
                                onClick={() => {
                                    setSelected(
                                        opt.value
                                    )

                                    onChange?.(
                                        opt.value
                                    )
                                }}
                                {...props}
                            />
                        </label>
                    ))}
                </aside>
            </div>
        )
    }
)

SelectGroup.displayName =
    "SelectGroup"

export default SelectGroup