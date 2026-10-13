"use client"

// #region imports
import {
    useOptimistic,
    useState,
    useTransition,
} from "react"

import {
    Button,
    IconButton,
    Information,
    Modal,
    Select,
    Tooltip,
} from "@/base"

import {
    Delete,
    Sparkle,
} from "@/icons"

import {
    EVALUATION_META,
    PRIORITY_META,
    RESEARCH_META,
    toOptions,
} from "@/data"

import {
    EVALUATION_STATUS,
    ICompany,
    PRIORITY,
    RESEARCH_STATUS,
} from "@/lib"

import { updateCompanyAction } from "../Leads/actions"

import {
    deleteCompanyAction,
    runResearchAction,
} from "./actions"
// #endregion

const _PRIORITY = toOptions(PRIORITY_META)
const _RESEARCH = toOptions(RESEARCH_META)
const _STAGE = toOptions(EVALUATION_META)

type IState = {
    priority: PRIORITY
    researchStatus: RESEARCH_STATUS
    evaluationStatus: EVALUATION_STATUS
}

const _FIELD = "h-8! text-xs! ring-inset!"

export const CompanyControls = ({ company, researchEnabled }: {
    company: ICompany
    researchEnabled: boolean
}) => {
    const [error, setError] = useState<string>()
    const [setup, setSetup] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()

    const [state, apply] = useOptimistic<IState, Partial<IState>>(
        {
            priority: company.priority,
            researchStatus: company.researchStatus,
            evaluationStatus: company.evaluationStatus,
        },
        (current, patch) => ({ ...current, ...patch })
    )

    const update = (patch: Partial<IState>) => startTransition(async () => {
        setError(undefined)
        apply(patch)
        const res = await updateCompanyAction(company.id, {
            priority: patch.priority,
            research_status: patch.researchStatus,
            evaluation_status: patch.evaluationStatus,
        })
        if (!res.success) setError(res.error ?? "Couldn't save the change")
    })

    const research = () => {
        if (!researchEnabled) {
            setSetup(true)
            return
        }
        startTransition(async () => {
            const res = await runResearchAction(company.id)
            if (!res.success) setError(res.error ?? "Research failed")
        })
    }

    const remove = () => startTransition(async () => {
        const res = await deleteCompanyAction(company.id, company.campaignId)
        if (!res.success) setError(res.error ?? "Couldn't delete the company")
    })

    return (
        <div className="flex flex-col gap-2 items-end max-tablet:items-start">
            <div className="flex items-center gap-2 flex-wrap">
                <Select
                    required
                    options={_PRIORITY}
                    selected={state.priority}
                    className="w-28"
                    buttonClassName={_FIELD}
                    buttonStyle={PRIORITY_META[state.priority].style}
                    onChange={option => option && update({ priority: option.value as PRIORITY })}
                />
                <Select
                    required
                    options={_RESEARCH}
                    selected={state.researchStatus}
                    className="w-32"
                    buttonClassName={_FIELD}
                    buttonStyle={RESEARCH_META[state.researchStatus].style}
                    onChange={option => option && update({ researchStatus: option.value as RESEARCH_STATUS })}
                />
                <Select
                    required
                    options={_STAGE}
                    selected={state.evaluationStatus}
                    className="w-36"
                    buttonClassName={_FIELD}
                    buttonStyle={EVALUATION_META[state.evaluationStatus].style}
                    onChange={option => option && update({ evaluationStatus: option.value as EVALUATION_STATUS })}
                />
                <Button
                    size="sm"
                    startIcon={<Sparkle size={12}/>}
                    onClick={research}
                    loading={isPending && researchEnabled}
                    loadingText="Researching"
                >
                    Run AI research
                </Button>
                <Tooltip content="Delete company">
                    <IconButton variant="ghost" size="sm" aria-label="Delete company" onClick={() => setConfirm(true)}>
                        <Delete size={13}/>
                    </IconButton>
                </Tooltip>
            </div>

            {error && <Information variant="error" description={error}/>}

            <Modal open={setup} onClose={() => setSetup(false)} title="AI research isn't connected" size="sm">
                <div className="flex flex-col gap-4">
                    <p className="text-grey-300">
                        Automated research needs an AI provider and a source pipeline. Neither is configured,
                        so Motif won&apos;t invent findings for this company.
                    </p>
                    <ul className="flex flex-col gap-2 text-sm">
                        {[
                            "Add a research provider in core (the ResearchProvider interface)",
                            "Restart the API so /integrations reports research as ready",
                            "Run research here. Findings arrive with source URLs",
                        ].map((step, index) =>
                            <li key={step} className="flex gap-3">
                                <span className=" pt-0.5">{String(index + 1).padStart(2, "0")}</span>
                                <span>{step}</span>
                            </li>
                        )}
                    </ul>
                    <Information
                        variant="neutral"
                        description="Until then, add findings by hand and set the research status yourself."
                    />
                    <div className="flex justify-end">
                        <Button size="sm" onClick={() => setSetup(false)}>Got it</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={confirm} onClose={() => !isPending && setConfirm(false)} title={`Delete ${company.name}?`} size="sm">
                <div className="flex flex-col gap-4">
                    <p className="text-grey-300">
                        This removes the company with its {company.findings.length} findings, research thread and drafts.
                    </p>
                    <div className="flex gap-2 justify-end">
                        <Button variant="secondary" size="sm" onClick={() => setConfirm(false)} disabled={isPending}>Cancel</Button>
                        <Button variant="danger" size="sm" onClick={remove} loading={isPending} loadingText="Deleting">Delete company</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
