"use client"

// #region imports
import {
    useEffect,
    useState,
} from "react"

import { Check } from "@/icons"
// #endregion

const _STEPS = [
    "Reading lead and ICP",
    "Checking revenue and headcount",
    "Searching recent news",
    "Scoring fit",
    "Saving findings",
]

const _INTERVAL = 4000

const Step = ({ label, state }: {
    label: string
    state: "done" | "active" | "pending"
}) => (
    <li
        data-state={state}
        className="
            flex items-center gap-2.5 text-xs smooth
            text-grey-200 data-[state=active]:text-inherit
            data-[state=active]:font-semibold
            data-[state=done]:text-grey-300
        "
    >
        <span
            data-state={state}
            className="
                w-4 h-4 rounded-full shrink-0 flex 
                items-center justify-center smooth
                ring-1 ring-grey-150
                data-[state=done]:bg-mint-300
                data-[state=done]:ring-mint-300
                data-[state=active]:ring-mint-300
            "
        >
            {
                state === "done" &&
                <Check size={10} className="fill-paper"/>
            }
            {
                state === "active" &&
                <span className="
                    w-1.5 h-1.5 rounded-full 
                    bg-mint-300 animate-pulse
                "/>
            }
        </span>
        {label}
    </li>
)

export const ResearchSteps = () => {
    const [current, setCurrent] = useState<number>(0)

    useEffect(() => {
        const timer = setInterval(
            () => setCurrent(step => Math.min(step + 1, _STEPS.length - 1)),
            _INTERVAL
        )
        return () => clearInterval(timer)
    }, [])

    return (
        <aside
            className="
                absolute z-200 right-0 top-full mt-2
                pointer-events-none animate-fade-in-fast
            "
        >
            <ol className="
                flex flex-col gap-2 p-3 rounded-xl 
                ring-1 ring-grey-100 bg-paper shadow-md
                min-w-60
            ">
            {_STEPS.map((label, index) =>
                <Step
                    key={label}
                    label={label}
                    state={
                        index < current ? "done" :
                        index === current ? "active" :
                        "pending"
                    }
                />
            )}
            </ol>
        </aside>
    )
}
