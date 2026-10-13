// #region imports
import { ReactNode } from "react"

import {
    Check,
    Cancel,
    Info,
} from "@/icons"

import {
    cn,
    ICompany,
    IICP,
} from "@/lib"

import { Card } from "@/components/Cards/Card"
import { FitScore } from "@/components/Pills/FitScore"

import {
    checkCriteria,
    ICriterion,
    ICriterionState,
} from "./criteria"
// #endregion

type IStateMeta = {
    label: string
    icon: ReactNode
    className: string
}

const _STATE_META: Record<ICriterionState, IStateMeta> = {
    match: {
        label: "Matches",
        icon: <Check size={9}/>,
        className: "bg-mint-50 text-mint-300",
    },
    partial: {
        label: "Partly",
        icon: <Info size={9}/>,
        className: "bg-amber-100 text-amber-200",
    },
    miss: {
        label: "Outside",
        icon: <Cancel size={6}/>,
        className: "bg-grey-150 text-error-200",
    },
    unknown: {
        label: "Unknown",
        icon: <Info size={9}/>,
        className: "bg-grey-150 text-grey-300",
    },
}

const StateBadge = ({ state }: { state: ICriterionState }) => {
    const meta = _STATE_META[state]

    return (
        <span className={cn(
            "inline-flex items-center gap-1 h-6 px-2 rounded-md text-xs font-semibold",
            meta.className,
        )}>
            {meta.icon}
            {meta.label}
        </span>
    )
}

const CriterionRow = ({ criterion }: { criterion: ICriterion }) => (
    <li className="
        grid grid-cols-[110px_1fr_auto] gap-3 items-center 
        py-2.5 border-t border-grey-150
        max-mobile:grid-cols-[1fr_auto]
    ">
        <span className="font-bold">
            {criterion.label}
        </span>

        <span className="
            flex flex-col min-w-0
            max-mobile:col-span-2 max-mobile:row-start-2
        ">
            <span className="text-charcoal-100 truncate">
                {criterion.actual}
            </span>
            <span className="text-xs text-grey-200 truncate">
                ICP: {criterion.expected}
            </span>
        </span>

        <StateBadge state={criterion.state}/>
    </li>
)

const DiligenceList = ({ items }: { items: string[] }) => (
    <div className="
        flex flex-col gap-2 
        rounded-xl bg-default 
        p-4
    ">
        <span className="
            text-xs font-semibold 
            uppercase tracking-wide 
            text-grey-200
        ">
            Verify in diligence
        </span>
        <ul className="flex flex-col gap-1.5">
            {
                items.map(item =>
                    <li
                        key={item}
                        className="
                            flex items-center gap-2 
                            text-grey-300"
                    >
                        <span className="
                            w-3.5 h-3.5 
                            rounded border 
                            border-grey-200 
                            shrink-0
                        "/>
                        {item}
                    </li>
                )
            }
        </ul>
    </div>
)

export const Fit = ({ company, icp }: {
    company: ICompany
    icp?: IICP
}) => {
    const criteria = checkCriteria(company, icp)
    const matched = criteria.filter(row => row.state === "match").length

    const description = criteria.length
        ? `${matched} of ${criteria.length} profile criteria match. Rule-based check, not AI.`
        : "The campaign ICP has no measurable criteria yet"

    return (
        <Card
            title="Why it matches the ICP"
            description={description}
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-6 flex-wrap">
                    <FitScore
                        score={company.fitScore}
                        size="lg"
                    />
                    {
                        company.fitSummary &&
                        <p className="
                            flex-1 min-w-64 
                            text-grey-300 
                            leading-relaxed
                        ">
                            {company.fitSummary}
                        </p>
                    }
                </div>

                {
                    criteria.length > 0 &&
                    <ul className="flex flex-col">
                        {
                            criteria.map(criterion =>
                                <CriterionRow
                                    key={criterion.label}
                                    criterion={criterion}
                                />
                            )
                        }
                    </ul>
                }

                {
                    !!icp?.characteristics.length &&
                    <DiligenceList items={icp.characteristics}/>
                }
            </div>
        </Card>
    )
}
