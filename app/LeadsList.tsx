"use client"

import { useRouter } from "nextjs-toploader/app"
import {
    useOptimistic,
    useState,
    useTransition,
} from "react"

import {
    Information,
    Select,
} from "@/base"

import {
    EVALUATION_META,
    PRIORITY_META,
    RESEARCH_META,
    toOptions,
} from "@/data"

import {
    cn,
    EVALUATION_STATUS,
    ICompany,
    PRIORITY,
} from "@/lib"

import { FitScore } from "@/components/FitScore"
import { SortHeader } from "@/components/Leads/SortHeader"

import { updateCompanyAction } from "@/components/Leads/actions"

const _ROW = cn(
    "grid gap-x-10 gap-y-1 items-center px-4",
    "grid-cols-[minmax(12rem,1.5fr)_minmax(8rem,1fr)_5rem_6.5rem_6rem_8.5rem_1.25rem]",
    "max-tablet:min-w-205"
)

const _PRIORITY_OPTIONS = toOptions(PRIORITY_META)
const _STAGE_OPTIONS = toOptions(EVALUATION_META)

const _FIELD = `
    flex items-center w-full h-7 px-2.5 rounded-lg
    text-xs font-semibold whitespace-nowrap
`

const _SELECT_FIELD = `
    h-7! px-2.5! text-xs! rounded-lg!
    smooth
`

type ILeadPatch = {
    id: string
    priority?: PRIORITY
    evaluationStatus?: EVALUATION_STATUS
}

export const LeadsList = ({ companies }: {
    companies: ICompany[]
}) => {
    const router = useRouter()
    const [error, setError] = useState<string>()
    const [, startTransition] = useTransition()

    const [rows, applyPatch] = useOptimistic(
        companies,
        (state, patch: ILeadPatch) => state.map(
            company => company.id === patch.id
                ? {
                    ...company,
                    priority: patch.priority ?? company.priority,
                    evaluationStatus: patch.evaluationStatus ?? company.evaluationStatus,
                }
                : company
        )
    )

    const update = (patch: ILeadPatch) => startTransition(async () => {
        setError(undefined)
        applyPatch(patch)
        const res = await updateCompanyAction(patch.id, {
            priority: patch.priority,
            evaluation_status: patch.evaluationStatus,
        })
        if (!res.success)
            setError(res.error ?? "Couldn't save the change.")
    })

    return (
        <article className="flex flex-col gap-3">
            {error && <Information variant="error" description={error}/>}

            <section className="
                flex flex-col rounded-2xl bg-paper ring-1 ring-grey-100
                max-tablet:overflow-x-auto
            ">
                <ul className="flex flex-col min-w-0">
                    <aside className={cn(
                        _ROW,
                        "h-10 text-xs font-semibold text-grey-200 border-b border-grey-150",
                        "pl-5 pr-4"
                    )}>
                        <SortHeader column="name" label="Company"/>
                        <span>Location</span>
                        <SortHeader column="fit" label="Fit"/>
                        <SortHeader column="priority" label="Priority"/>
                        <span>Research</span>
                        <span>Stage</span>
                        <span/>
                    </aside>

                    {
                        rows.map(company => (
                            <li
                                key={company.id}
                                role="button"
                                tabIndex={0}
                                onClick={()=>router.push(
                                    `/companies/${company.id}?campaign=${company.campaignId}`
                                )}
                                onKeyDown={e => {
                                    if (e.key === "Enter" && e.target === e.currentTarget)
                                        router.push(
                                            `/companies/${company.id}?campaign=${company.campaignId}`
                                        )
                                }}
                                className={cn(
                                    _ROW,
                                    "group cursor-pointer smooth border-b border-grey-150 last:border-0",
                                    "py-3 pl-5 pr-4 hover:bg-default focus:bg-default outline-none"
                                )}
                            >
                                <aside className="flex items-center gap-3 min-w-0">
                                    <p className="
                                        w-8 h-8 rounded-lg bg-mint-50 text-mint-300
                                        flex items-center justify-center shrink-0
                                        text-xs font-extrabold
                                    ">
                                        {company.name.slice(0, 1)}
                                    </p>

                                    <div className="flex flex-col min-w-0">
                                        <p className="font-bold text-charcoal-100 truncate max-w-48">
                                            {company.name}
                                        </p>
                                        <p className="text-xs text-grey-200 truncate max-w-64">
                                            {[company.industry, company.domain].filter(Boolean).join(" · ") || "No details yet"}
                                        </p>
                                    </div>
                                </aside>

                                <aside className="flex flex-col">
                                    <p className="text-grey-300">
                                        {company.location || "—"}
                                    </p>
                                    <p className="text-xs text-grey-200">
                                        {company.employees != null ? `${company.employees} employees` : "Headcount unknown"}
                                    </p>
                                </aside>

                                <FitScore score={company.fitScore}/>

                                <Select
                                    required
                                    options={_PRIORITY_OPTIONS}
                                    selected={company.priority}
                                    className="w-full min-w-0 border-none!"
                                    buttonClassName={_SELECT_FIELD}
                                    buttonStyle={PRIORITY_META[company.priority].style}
                                    onChange={option => option && update({
                                        id: company.id,
                                        priority: option.value as PRIORITY,
                                    })}
                                />

                                <p
                                    className={_FIELD}
                                    style={RESEARCH_META[company.researchStatus].style}
                                >
                                    <span className="truncate">
                                        {RESEARCH_META[company.researchStatus].label}
                                    </span>
                                </p>

                                <Select
                                    required
                                    options={_STAGE_OPTIONS}
                                    selected={company.evaluationStatus}
                                    className="w-full min-w-0"
                                    buttonClassName={_SELECT_FIELD}
                                    buttonStyle={EVALUATION_META[company.evaluationStatus].style}
                                    onChange={option => option && update({
                                        id: company.id,
                                        evaluationStatus: option.value as EVALUATION_STATUS,
                                    })}
                                />
                            </li>
                        ))
                    }
                </ul>
            </section>
        </article>
    )
}