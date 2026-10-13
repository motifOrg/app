"use client"

// #region imports
import {
    useOptimistic,
    useState,
    useTransition,
} from "react"

import {
    Button,
    Information,
    Select,
} from "@/base"

import { Check, Cancel } from "@/icons"

import {
    OPPORTUNITY_META,
    PRIORITY_META,
    toOptions,
} from "@/data"

import {
    IOpportunity,
    OPPORTUNITY_STATUS,
    PRIORITY,
} from "@/lib"

import { MetaPill } from "@/components/Pills/MetaPill"
import { updateOpportunityAction } from "./actions"
// #endregion

const _PRIORITY = toOptions(PRIORITY_META)

export const OpportunityControls = ({ opportunity }: { opportunity: IOpportunity }) => {
    const [error, setError] = useState<string>()
    const [, startTransition] = useTransition()

    const [state, apply] = useOptimistic(
        { status: opportunity.status, priority: opportunity.priority },
        (current, patch: { status?: OPPORTUNITY_STATUS, priority?: PRIORITY }) => ({ ...current, ...patch })
    )

    const update = (patch: { status?: OPPORTUNITY_STATUS, priority?: PRIORITY }) =>
        startTransition(async () => {
            setError(undefined)
            apply(patch)
            const res = await updateOpportunityAction(opportunity.id, patch)
            if (!res.success) setError(res.error ?? "Couldn't update the deal")
        })

    return (
        <section className="flex flex-col gap-2">
            <aside className="flex items-center gap-2 flex-wrap">
                <MetaPill meta={OPPORTUNITY_META} value={state.status}/>
                <Select
                    required
                    options={_PRIORITY}
                    selected={state.priority}
                    className="w-28"
                    buttonClassName="h-8! text-xs! ring-inset!"
                    buttonStyle={PRIORITY_META[state.priority].style}
                    onChange={option => option && update({ priority: option.value as PRIORITY })}
                />

                <div className="flex-1"/>

                {
                    state.status === "new" &&
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => update({ status: "reviewing" })}
                    >
                        Start review
                    </Button>
                }
                {
                    (state.status === "new" || state.status === "reviewing") &&
                    <>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            startIcon={<Cancel size={7}/>} 
                            onClick={() => update({ status: "declined" })}
                        >
                            Decline
                        </Button>
                        <Button 
                            size="sm" startIcon={<Check size={10}/>} 
                            onClick={() => update({ status: "qualified" })}
                        >
                            Qualify
                        </Button>
                    </>
                }
                {
                    (state.status === "qualified" || state.status === "declined") &&
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => update({ status: "reviewing" })}
                    >
                        Move back to review
                    </Button>
                }
            </aside>

            {
                error && 
                <Information 
                    variant="error"
                    description={error}
                />
            }
        </section>
    )
}
