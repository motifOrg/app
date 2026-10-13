// #region imports
import type { CSSProperties } from "react"

import type { IFilter } from "@/components/Filter"
// #endregion

export type ITone = {
    className: string
    style: CSSProperties
}

export const TONES = {
    grey: {
        className: "bg-grey-150 text-grey-300",
        style: { backgroundColor: "var(--color-grey-150)", color: "var(--color-grey-300)" },
    },
    mint: {
        className: "bg-mint-50 text-mint-300",
        style: { backgroundColor: "var(--color-mint-50)", color: "var(--color-mint-300)" },
    },
    amber: {
        className: "bg-amber-100 text-amber-200",
        style: { backgroundColor: "var(--color-amber-100)", color: "var(--color-amber-200)" },
    },
    blue: {
        className: "bg-blue-50 text-blue-200",
        style: { backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-200)" },
    },
    error: {
        className: "bg-error-100 text-error-200",
        style: { backgroundColor: "var(--color-error-100)", color: "var(--color-error-200)" },
    },
} satisfies Record<string, ITone>

const tone = (label: string, name: keyof typeof TONES) => ({ label, ...TONES[name] })

export const PRIORITY_META = {
    high: tone("High", "mint"),
    medium: tone("Medium", "amber"),
    low: tone("Low", "grey"),
}

export const RESEARCH_META = {
    not_started: tone("Not Started", "grey"),
    in_progress: tone("In Progress", "amber"),
    complete: tone("Complete", "mint"),
}

export const EVALUATION_META = {
    new: tone("New", "grey"),
    shortlisted: tone("Shortlisted", "mint"),
    contacted: tone("Contacted", "blue"),
    in_discussion: tone("In Discussion", "amber"),
    rejected: tone("Rejected", "error"),
}

export const OPPORTUNITY_META = {
    new: tone("New", "blue"),
    reviewing: tone("Reviewing", "amber"),
    qualified: tone("Qualified", "mint"),
    declined: tone("Declined", "error"),
}

export const CAMPAIGN_META = {
    draft: tone("Draft", "grey"),
    active: tone("Active", "mint"),
    paused: tone("Paused", "amber"),
    archived: tone("Archived", "grey"),
}

export const FINDING_META = {
    fit: tone("Why It Fits", "mint"),
    finding: tone("Finding", "grey"),
    risk: tone("Risk", "error"),
    missing: tone("Missing Info", "amber"),
    next_action: tone("Next Action", "blue"),
}

export const EVIDENCE_META = {
    sample: { label: "Sample", tooltip: "Seed data for the demo. Not researched." },
    unverified: { label: "Unverified", tooltip: "Added without a source URL." },
    verified: { label: "Sourced", tooltip: "Backed by a source URL you can open." },
} as const

export const WORKFLOW_META = {
    outbound: {
        label: "Outbound sourcing",
        description: "Build a target list from our data providers filtered against the ICP.",
    },
    inbound: {
        label: "Inbound evaluation",
        description: "Log deals brokers and owners send you, and evaluate against the ICP.",
    },
    both: {
        label: "Both",
        description: "Run outbound sourcing and inbound evaluation against the same ICP.",
    },
} as const

export const toOptions = <T extends Record<string, { label: string }>>(meta: T) =>
    Object.entries(meta).map(([value, { label }]) => ({ label, value }))

export const SORT_OPTIONS = [
    { name: "Best Fit", value: "fit" },
    { name: "Lowest Fit", value: "fit-asc" },
    { name: "Priority", value: "priority" },
    { name: "Recently Added", value: "recents" },
    { name: "Name A–Z", value: "a-z" },
    { name: "Name Z–A", value: "z-a" },
]

const toChildren = <T extends Record<string, { label: string }>>(meta: T) =>
    Object.entries(meta).map(([value, { label }]) => ({ name: label, value }))

export const FILTERS_META: IFilter[] = [
    {
        id: "priority",
        title: "Priority",
        type: "multi",
        children: toChildren(PRIORITY_META),
    },
    {
        id: "research_status",
        title: "Research",
        type: "multi",
        children: toChildren(RESEARCH_META),
    },
    {
        id: "evaluation_status",
        title: "Pipeline Stage",
        type: "multi",
        children: toChildren(EVALUATION_META),
    },
    {
        id: "sort",
        title: "Sort By",
        type: "select",
        children: SORT_OPTIONS,
    },
]
