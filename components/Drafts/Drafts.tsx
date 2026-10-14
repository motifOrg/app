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

import { Mail, Plus } from "@/icons"
import { IDraft } from "@/lib"

import { EmptyState } from "../Navigation"
import { createDraftAction } from "./actions"
import { DraftEditor } from "./DraftEditor"
// #endregion

export const Drafts = ({ drafts, companyId, opportunityId, kind, ai = false }: {
    drafts: IDraft[]
    companyId?: string
    opportunityId?: string
    kind: "outreach" | "reply"
    ai?: boolean
}) => {
    const [selected, setSelected] = useState<string | undefined>(drafts[0]?.id)
    const [error, setError] = useState<string>()
    const [isPending, startTransition] = useTransition()

    const create = () => startTransition(async () => {
        setError(undefined)
        const res = await createDraftAction({
            company_id: companyId,
            opportunity_id: opportunityId,
        })
        if (!res.success) setError(res.error ?? "Couldn't create a draft")
        else setSelected(undefined)
    })

    const active = drafts.find(draft => draft.id === selected) ?? drafts[0]
    const label = kind === "outreach" ? "outreach email" : "reply"

    if (drafts.length === 0)
        return (
            <aside className="flex flex-col gap-3">
                <EmptyState
                    icon={<Mail size={16}/>}
                    title={`No ${label} drafted yet`}
                    description={
                        kind === "reply"
                            ? "Start a reply from a template that references the deal. Nothing is sent from Motif."
                            : ai
                                ? "AI writes a first email from this company's profile and findings, your campaign thesis and ICP. Edit it, mark it reviewed, then copy it into your mail client."
                                : "Start from a template filled in with this company's details. Set OPENAI_API_KEY to have AI write it from the company and your ICP."
                    }
                    action={
                        <Button 
                            size="sm" 
                            startIcon={<Plus size={11}/>} 
                            loading={isPending} 
                            loadingText="Drafting" 
                            onClick={create}
                        >
                            Draft {label}
                        </Button>
                    }
                />
                {
                    error && 
                    <Information 
                        variant="error" 
                        description={error}
                    />
                }
            </aside>
        )

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1.5 flex-wrap">
                {
                    drafts.map((draft, index) =>
                        <Button
                            key={draft.id}
                            type="button"
                            variant={draft.id === active?.id ? "primary" : "secondary"}
                            size="xs"
                            onClick={() => setSelected(draft.id)}
                        >
                            Draft {drafts.length - index}
                            {draft.status === "reviewed" && " ✓"}
                        </Button>
                    )
                }
                <Button 
                    variant="ghost" 
                    size="xs" 
                    startIcon={<Plus size={10}/>} 
                    loading={isPending} 
                    loadingText="Drafting" 
                    onClick={create}
                >
                    New draft
                </Button>
            </div>

            {
                error && 
                <Information 
                    variant="error" 
                    description={error}
                />
            }
            {
                active && 
                <DraftEditor 
                    key={`${active.id}-${active.updatedAt.getTime()}`} 
                    draft={active}
                />
            }
        </div>
    )
}
