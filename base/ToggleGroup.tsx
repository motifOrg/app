"use client"

// #region imports
import {
    CSSProperties,
    forwardRef,
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react"

import {
    cn
} from "@/lib"
// #endregion

export interface IToggleOption {
    label: ReactNode
    value: string
}

export interface IToggleGroupProps {
    options: IToggleOption[]
    value: string
    className?: string
    onChange: (value: string) => void
}

const ToggleGroup = forwardRef<HTMLDivElement, IToggleGroupProps>(
    (
        {
            options,
            value,
            className = "",
            onChange
        },
        ref
    ) => {

        const containerRef = useRef<HTMLDivElement | null>(null)
        const [line, setLine] = useState({
            width: 0,
            x: 0
        })

        const handleToggle = (val: string) =>
            value !== val && onChange(val)

        useEffect(() => {
            if (!containerRef.current) return

            const index = options.findIndex(o => o.value === value)
            if (index === -1) return

            const el = containerRef.current.children[index] as HTMLElement
            if (!el) return

            setLine({
                width: el.offsetWidth,
                x: el.offsetLeft
            })
        }, [value, options])

        return (
            <div
                ref={(node) => {
                    containerRef.current = node
                    if (typeof ref === "function") ref(node)
                    else if (ref) ref.current = node
                }}
                style={
                    {
                        "--line-width": `${line.width}px`,
                        "--line-x": `${line.x}px`
                    } as CSSProperties
                }
                className={cn(
                    `
                        relative inline-flex gap-5 text-sm font-semibold
                        after:absolute after:-bottom-px after:h-0.5 after:bg-mint-300
                        after:left-0
                        after:w-(--line-width) after:translate-x-(--line-x)
                        after:transition-all after:duration-300 after:ease-out
                    `,
                    className
                )}
            >
                {options.map(opt => {
                    const active = opt.value === value
                    return (
                        <p
                            key={opt.value}
                            onClick={() => handleToggle(opt.value)}
                            className={cn(
                                "transition-colors duration-200 outline-none cursor-pointer pb-2.5 whitespace-nowrap",
                                active
                                    ? "text-charcoal-100"
                                    : "text-grey-200 hover:text-grey-300"
                            )}
                        >
                            {opt.label}
                        </p>
                    )
                })}
            </div>
        )
    }
)

ToggleGroup.displayName = "ToggleGroup"
export default ToggleGroup
