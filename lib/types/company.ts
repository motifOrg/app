export type PRIORITY = "high" | "medium" | "low"
export type RESEARCH_STATUS = "not_started" | "in_progress" | "complete"
export type EVALUATION_STATUS = "new" | "shortlisted" | "contacted" | "in_discussion" | "rejected"
export type COMPANY_SOURCE = "sample" | "csv" | "manual" | "inbound"
export type FINDING_KIND = "fit" | "finding" | "risk" | "missing" | "next_action"
export type EVIDENCE_STATUS = "sample" | "unverified" | "verified"
export type CONFIDENCE = "high" | "medium" | "low"

export interface IRawFinding {
    id: string
    company_id: string
    kind: FINDING_KIND
    title: string
    content: string
    source_url: string
    confidence: CONFIDENCE
    evidence_status: EVIDENCE_STATUS
    created_at: string
}

export interface IFinding {
    id: string
    companyId: string
    kind: FINDING_KIND
    title: string
    content: string
    sourceUrl: string
    confidence: CONFIDENCE
    evidence: EVIDENCE_STATUS
    createdAt: Date
}

export interface IRawCompany {
    id: string
    campaign_id: string
    name: string
    domain: string
    industry: string
    location: string
    description: string
    employees: number | null
    revenue_estimate: string
    founded_year: number | null
    owner_name: string
    source: COMPANY_SOURCE
    is_sample: boolean
    fit_score: number | null
    fit_summary: string
    priority: PRIORITY
    research_status: RESEARCH_STATUS
    evaluation_status: EVALUATION_STATUS
    findings?: IRawFinding[]
    created_at: string
    updated_at: string
}

export interface ICompany {
    id: string
    campaignId: string
    name: string
    domain: string
    industry: string
    location: string
    description: string
    employees: number | null
    revenue: string
    foundedYear: number | null
    owner: string
    source: COMPANY_SOURCE
    isSample: boolean
    fitScore: number | null
    fitSummary: string
    priority: PRIORITY
    researchStatus: RESEARCH_STATUS
    evaluationStatus: EVALUATION_STATUS
    findings: IFinding[]
    createdAt: Date
    updatedAt: Date
}

export interface IImportResult {
    rowsProcessed: number
    inserted: number
    skipped: number
    failed: number
    errors: { row: number, message: string }[]
}

export const serializeFinding = (
    finding: IRawFinding
): IFinding => ({
    id: finding?.id,
    companyId: finding?.company_id,
    kind: finding?.kind,
    title: finding?.title,
    content: finding?.content,
    sourceUrl: finding?.source_url,
    confidence: finding?.confidence,
    evidence: finding?.evidence_status,
    createdAt: new Date(finding?.created_at),
})

export const serializeCompany = (
    company: IRawCompany
): ICompany => ({
    id: company?.id,
    campaignId: company?.campaign_id,
    name: company?.name,
    domain: company?.domain,
    industry: company?.industry,
    location: company?.location,
    description: company?.description,
    employees: company?.employees ?? null,
    revenue: company?.revenue_estimate,
    foundedYear: company?.founded_year ?? null,
    owner: company?.owner_name,
    source: company?.source,
    isSample: company?.is_sample,
    fitScore: company?.fit_score ?? null,
    fitSummary: company?.fit_summary,
    priority: company?.priority,
    researchStatus: company?.research_status,
    evaluationStatus: company?.evaluation_status,
    findings: (company?.findings ?? []).map(serializeFinding),
    createdAt: new Date(company?.created_at),
    updatedAt: new Date(company?.updated_at),
})
