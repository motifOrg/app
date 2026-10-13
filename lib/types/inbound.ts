import { PRIORITY } from "./company"

export type OPPORTUNITY_STATUS = "new" | "reviewing" | "qualified" | "declined"
export type OPPORTUNITY_SOURCE = "gmail" | "manual" | "sample"
export type DRAFT_STATUS = "draft" | "reviewed"
export type GMAIL_STATUS = "setup_required" | "not_implemented" | "ready"

export interface IRawOpportunity {
    id: string
    campaign_id: string
    company_id: string | null
    source: OPPORTUNITY_SOURCE
    sender_name: string
    sender_email: string
    subject: string
    body: string
    company_name: string
    company_domain: string
    received_at: string
    is_sample: boolean
    fit_score: number | null
    fit_summary: string
    priority: PRIORITY
    status: OPPORTUNITY_STATUS
}

export interface IOpportunity {
    id: string
    campaignId: string
    companyId: string | null
    source: OPPORTUNITY_SOURCE
    senderName: string
    senderEmail: string
    subject: string
    body: string
    companyName: string
    companyDomain: string
    receivedAt: Date
    isSample: boolean
    fitScore: number | null
    fitSummary: string
    priority: PRIORITY
    status: OPPORTUNITY_STATUS
}

export type IOpportunityCounts = Record<OPPORTUNITY_STATUS | "all", number>

export interface IRawDraft {
    id: string
    company_id: string | null
    opportunity_id: string | null
    recipient: string
    subject: string
    body: string
    status: DRAFT_STATUS
    updated_at: string
}

export interface IDraft {
    id: string
    companyId: string | null
    opportunityId: string | null
    recipient: string
    subject: string
    body: string
    status: DRAFT_STATUS
    updatedAt: Date
}

export interface IRawIntegrations {
    gmail: {
        status: GMAIL_STATUS
        configured: boolean
        connected: boolean
        missing_env: string[] | null
        message: string
    }
    research: {
        status: string
        message: string
    }
}

export interface IIntegrations {
    gmail: {
        status: GMAIL_STATUS
        connected: boolean
        missingEnv: string[]
        message: string
    }
    research: {
        enabled: boolean
        message: string
    }
}

export const serializeOpportunity = (
    opportunity: IRawOpportunity
): IOpportunity => ({
    id: opportunity?.id,
    campaignId: opportunity?.campaign_id,
    companyId: opportunity?.company_id,
    source: opportunity?.source,
    senderName: opportunity?.sender_name,
    senderEmail: opportunity?.sender_email,
    subject: opportunity?.subject,
    body: opportunity?.body,
    companyName: opportunity?.company_name,
    companyDomain: opportunity?.company_domain,
    receivedAt: new Date(opportunity?.received_at),
    isSample: opportunity?.is_sample,
    fitScore: opportunity?.fit_score ?? null,
    fitSummary: opportunity?.fit_summary,
    priority: opportunity?.priority,
    status: opportunity?.status,
})

export const serializeDraft = (draft: IRawDraft): IDraft => ({
    id: draft?.id,
    companyId: draft?.company_id,
    opportunityId: draft?.opportunity_id,
    recipient: draft?.recipient,
    subject: draft?.subject,
    body: draft?.body,
    status: draft?.status,
    updatedAt: new Date(draft?.updated_at),
})

export const serializeIntegrations = (
    integrations: IRawIntegrations
): IIntegrations => ({
    gmail: {
        status: integrations?.gmail?.status ?? "setup_required",
        connected: integrations?.gmail?.connected ?? false,
        missingEnv: integrations?.gmail?.missing_env ?? [],
        message: integrations?.gmail?.message ?? "",
    },
    research: {
        enabled: integrations?.research?.status === "ready",
        message: integrations?.research?.message ?? "",
    },
})
