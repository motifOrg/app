"use client"

// #region imports
import { useState } from "react"

import { Button, TextField } from "@/base"
import { Cancel, Search } from "@/icons"
import { useSearchParam } from "@/hooks"

import {
    EVALUATION_META,
    PRIORITY_META,
    RESEARCH_META,
} from "@/data"

import { Filter } from "../Filter"
// #endregion

const _CHIP_META: Record<string, Record<string, { label: string }>> = {
    priority: PRIORITY_META,
    research_status: RESEARCH_META,
    evaluation_status: EVALUATION_META,
}

export const LeadsToolbar = () => {
    const { searchParams, set, debounce } = useSearchParam()
    const [query, setQuery] = useState<string>(searchParams.get("q") ?? "")

    const search = (value: string) => {
        setQuery(value)
        debounce({ q: value.trim() })
    }

    const removeChip = (key: string, value: string) => {
        const next = (searchParams.get(key) ?? "")
            .split(",")
            .filter(item => item && item !== value)
        set({ [key]: next.join(",") })
    }

    const chips = Object.keys(_CHIP_META).flatMap(key =>
        (searchParams.get(key) ?? "")
            .split(",")
            .filter(Boolean)
            .map(value => ({
                key,
                value,
                label: _CHIP_META[key][value]?.label ?? value,
            }))
    )

    return (
        <section className="flex flex-col gap-3 w-full">
            <aside className="flex items-center gap-2 justify-between w-full">
                <TextField
                    value={query}
                    onChange={e => search(e.target.value)}
                    placeholder="Search name, domain, industry or location"
                    aria-label="Search leads"
                    className="w-80 max-mobile:w-full"
                    startIcon={<Search size={14} className="text-grey-200"/>}
                    endIcon={
                        query &&
                        <Cancel
                            size={8}
                            className="cursor-pointer text-grey-200 hover:text-charcoal-100"
                            onClick={() => search("")}
                        />
                    }
                />
                <Filter/>
            </aside>

            {
                chips.length > 0 &&
                <aside className="flex items-center gap-1.5 flex-wrap">
                    {
                        chips.map(chip =>
                            <Button
                                key={`${chip.key}-${chip.value}`}
                                type="button"
                                variant="primary"
                                size="shrink"
                                onClick={() => removeChip(chip.key, chip.value)}
                                aria-label={`Remove filter ${chip.label}`}
                                endIcon={<Cancel size={6}/>}
                            >
                                {chip.label}
                            </Button>
                        )
                    }
                </aside>
            }
        </section>
    )
}
