"use client"

// #region imports
import {
    useMemo,
    useState,
    useTransition,
} from "react"

import {
    Information,
    ToggleGroup,
} from "@/base"

import { FINDING_META } from "@/data"

import {
    FINDING_KIND,
    IFinding,
} from "@/lib"

import { FindingCard } from "@/components/Cards/FindingCard"
import { FindingForm } from "@/components/Forms/FindingForm"
import { EmptyState } from "../Navigation"

import { deleteFindingAction } from "./actions"
// #endregion

export const Findings = ({ companyId, findings }: {
    companyId: string
    findings: IFinding[]
}) => {
    const [kind, setKind] = useState<string>("all")
    const [deleting, setDeleting] = useState<string>()
    const [error, setError] = useState<string>()
    const [, startTransition] = useTransition()

    const options = useMemo(() => [
        { label: `All ${findings.length}`, value: "all" },
        ...(Object.keys(FINDING_META) as FINDING_KIND[])
            .map(key => ({
                key,
                count: findings.filter(finding => finding.kind === key).length,
            }))
            .filter(({ count }) => count > 0)
            .map(({ key, count }) => ({ label: `${FINDING_META[key].label} ${count}`, value: key })),
    ], [findings])

    const visible = kind === "all"
        ? findings
        : findings.filter(finding => finding.kind === kind)

    const remove = (id: string) => startTransition(async () => {
        setDeleting(id)
        setError(undefined)
        const res = await deleteFindingAction(companyId, id)
        if (!res.success) setError(res.error ?? "Couldn't delete the finding")
        setDeleting(undefined)
    })

    if (findings.length === 0)
        return (
            <EmptyState
                title="No findings yet"
                description="Log what you learn from calls, filings and the company site. Add a source URL so the team can check it."
                action={
                    <FindingForm 
                        companyId={companyId} 
                        variant="primary"
                    />
                }
            />
        )

    return (
        <section className="flex flex-col gap-4">
            <aside className="
                flex items-end justify-between gap-3 
                 border-grey-150 flex-wrap
            ">
                <ToggleGroup
                    options={options}
                    value={options.some(
                        option => option.value === kind
                    ) ? kind : "all"}
                    onChange={setKind}
                    className="flex-wrap"
                />
                    
                <FindingForm
                    companyId={companyId}
                />
            </aside>

            {
                error &&
                <Information
                    variant="error"
                    description={error}
                />
            }

            <ul className="flex flex-col gap-2">
                {
                    visible.map(finding =>
                        <FindingCard
                            key={finding.id}
                            finding={finding}
                            deleting={deleting === finding.id}
                            onDelete={() => remove(finding.id)}
                        />
                    )
                }
            </ul>
        </section>
    )
}
