"use client"

// #region imports
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
    TextField,
    ToggleGroup,
} from "@/base"

import { Search } from "@/icons"
import { useSearchParam } from "@/hooks"
import { OPPORTUNITY_META, PRIORITY_META } from "@/data"

import {
    cn,
    initials,
    IOpportunity,
    IOpportunityCounts,
    timeAgo,
} from "@/lib"

import { MetaPill } from "@/components/Pills/MetaPill"
// #endregion

export const InboundList = ({ opportunities, counts, selected }: {
    opportunities: IOpportunity[]
    counts: IOpportunityCounts
    selected?: string
}) => {
    const pathname = usePathname()
    const { searchParams, set, debounce } = useSearchParam()

    const status = searchParams.get("status") ?? ""
    const urlQuery = searchParams.get("q") ?? ""
    const [query, setQuery] = useState<string>(urlQuery)

    const href = (id: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("id", id)
        return `${pathname}?${params.toString()}`
    }

    return (
        <aside className="rounded-2xl bg-paper ring-1 ring-grey-100 flex flex-col min-h-0">
            <header className="p-3 pb-0 flex flex-col gap-3 border-b border-grey-150">
                <TextField
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value)
                        debounce({ q: e.target.value.trim(), id: undefined })
                    }}
                    placeholder="Search subject, sender, company"
                    aria-label="Search inbound"
                    fullWidth
                    startIcon={<Search size={14} className="text-grey-200"/>}
                />
                <ToggleGroup
                    value={status}
                    onChange={value => set({ status: value, id: undefined }, { replace: true })}
                    className="px-1 gap-4"
                    options={[
                        { value: "", label: `All ${counts.all}` },
                        { value: "new", label: `New ${counts.new}` },
                        { value: "reviewing", label: `Reviewing ${counts.reviewing}` },
                        { value: "qualified", label: `Qualified ${counts.qualified}` },
                        { value: "declined", label: `Declined ${counts.declined}` },
                    ]}
                />
            </header>

            <ul className="flex flex-col overflow-y-auto">
                {
                    opportunities.length === 0 &&
                    <li className="p-8 text-center text-grey-200">
                        {status || urlQuery ? "No deals match." : "No inbound deals yet."}
                    </li>
                }
                {
                    opportunities.map(opportunity =>
                        <li key={opportunity.id}>
                            <Link
                                href={href(opportunity.id)}
                                scroll={false}
                                data-active={opportunity.id === selected}
                                className={cn(
                                    "flex gap-3 p-3.5 border-b border-grey-150 smooth",
                                    "hover:bg-default data-[active=true]:bg-mint-50",
                                    "data-[active=true]:shadow-[inset_3px_0_0_var(--color-mint-300)]",
                                )}
                            >
                                <p className="
                                    w-8 h-8 rounded-full bg-grey-150 
                                    text-grey-300 shrink-0
                                    flex items-center justify-center 
                                    text-xs font-bold
                                ">
                                    {initials(opportunity.senderName || opportunity.senderEmail)}
                                </p>

                                <aside className="
                                    flex-1 min-w-0 flex 
                                    flex-col gap-1
                                ">
                                    <div className="flex items-center gap-2">
                                        <p className={cn(
                                            "truncate flex-1",
                                            opportunity.status === "new" ? "font-extrabold" : "font-semibold"
                                        )}>
                                            {opportunity.senderName || opportunity.senderEmail}
                                        </p>
                                        <p className="text-[11px] text-grey-200 shrink-0">
                                            {timeAgo(opportunity.receivedAt)}
                                        </p>
                                    </div>
                                    <p className="truncate text-charcoal-100">
                                        {opportunity.subject}
                                    </p>
                                    <span className="flex items-center gap-1.5">
                                        <MetaPill 
                                            meta={OPPORTUNITY_META} 
                                            value={opportunity.status} 
                                            className="h-5 text-[11px]"
                                        />
                                        <MetaPill 
                                            meta={PRIORITY_META}
                                            value={opportunity.priority}
                                            className="h-5 text-[11px]"
                                        />
                                        {
                                            opportunity.companyName &&
                                            <span className="text-xs text-grey-200 truncate">
                                                {opportunity.companyName}
                                            </span>
                                        }
                                    </span>
                                </aside>
                            </Link>
                        </li>
                    )
                }
            </ul>
        </aside>
    )
}
