"use client"

// #region imports
import {
    useState,
    useTransition,
} from "react"

import {
    Button,
    Information,
} from "@/base"

import { Sparkle } from "@/icons"

import { evaluateOpportunityAction } from "./actions"
// #endregion

export const EvaluateDeal = ({ id, scored }: {
    id: string
    scored: boolean
}) => {
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const evaluate = () => startTransition(async () => {
        setError(undefined)
        const res = await evaluateOpportunityAction(id)
        if (!res.success) setError(res.error ?? "Couldn't evaluate the deal")
    })

    return (
        <aside className="flex flex-col gap-2">
            <Button
                variant={scored ? "secondary" : "primary"}
                size="sm"
                startIcon={<Sparkle size={11}/>}
                loading={isPending}
                loadingText="Evaluating"
                onClick={evaluate}
            >
                {scored ? "Re-evaluate" : "Evaluate with AI"}
            </Button>
            {
                error &&
                <Information
                    variant="error"
                    description={error}
                />
            }
        </aside>
    )
}
