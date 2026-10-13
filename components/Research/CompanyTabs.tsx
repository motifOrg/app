"use client"

// #region imports
import {
    usePathname,
    useSearchParams,
} from "next/navigation"

import {
    ReactNode,
    useState,
} from "react"

import { ToggleGroup } from "@/base"
// #endregion

export const CompanyTabs = ({ tabs }: {
    tabs: { value: string, label: string, content: ReactNode }[]
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const initial = searchParams.get("tab")
    const [tab, setTab] = useState<string>(
        tabs.some(item => item.value === initial) ? initial! : tabs[0].value
    )

    const change = (value: string) => {
        setTab(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value === tabs[0].value) params.delete("tab")
        else params.set("tab", value)
        const query = params.toString()
        window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname)
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="border-b border-grey-150">
                <ToggleGroup
                    options={tabs.map(({ value, label }) => ({ value, label }))}
                    value={tab}
                    onChange={change}
                />
            </div>
            {
                tabs.map(item =>
                    <div key={item.value} hidden={item.value !== tab} className="animate-fade-in-fast">
                        {item.content}
                    </div>
                )
            }
        </div>
    )
}
