export type CAMPAIGN_STATUS = "draft" | "active" | "paused" | "archived"
export type WORKFLOW = "outbound" | "inbound" | "both"

export interface IRawICP {
    thesis: string
    industries: string[] | null
    geographies: string[] | null
    business_models: string[] | null
    characteristics: string[] | null
    exclusions: string[] | null
    revenue_min: number | null
    revenue_max: number | null
    ebitda_min: number | null
    employees_min: number | null
    employees_max: number | null
    ownership: string
    updated_at?: string
}

export interface IICP {
    thesis: string
    industries: string[]
    geographies: string[]
    businessModels: string[]
    characteristics: string[]
    exclusions: string[]
    revenueMin: number | null
    revenueMax: number | null
    ebitdaMin: number | null
    employeesMin: number | null
    employeesMax: number | null
    ownership: string
}

export interface IRawCampaign {
    id: string
    name: string
    description: string
    status: CAMPAIGN_STATUS
    workflow: WORKFLOW
    gmail_label: string
    icp?: IRawICP
    company_count: number
    opportunity_count: number
    created_at: string
    updated_at: string
}

export interface ICampaign {
    id: string
    name: string
    description: string
    status: CAMPAIGN_STATUS
    workflow: WORKFLOW
    gmailLabel: string
    icp?: IICP
    companyCount: number
    opportunityCount: number
    createdAt: Date
    updatedAt: Date
}

export interface IRawCampaignStats {
    companies: number
    high_priority: number
    researched: number
    shortlisted: number
    contacted: number
    inbound_new: number
}

export interface ICampaignStats {
    companies: number
    highPriority: number
    researched: number
    shortlisted: number
    contacted: number
    inboundNew: number
}

export const serializeICP = (icp: IRawICP): IICP => ({
    thesis: icp?.thesis ?? "",
    industries: icp?.industries ?? [],
    geographies: icp?.geographies ?? [],
    businessModels: icp?.business_models ?? [],
    characteristics: icp?.characteristics ?? [],
    exclusions: icp?.exclusions ?? [],
    revenueMin: icp?.revenue_min ?? null,
    revenueMax: icp?.revenue_max ?? null,
    ebitdaMin: icp?.ebitda_min ?? null,
    employeesMin: icp?.employees_min ?? null,
    employeesMax: icp?.employees_max ?? null,
    ownership: icp?.ownership ?? "",
})

export const deserializeICP = (icp: IICP): Omit<IRawICP, "updated_at"> => ({
    thesis: icp.thesis,
    industries: icp.industries,
    geographies: icp.geographies,
    business_models: icp.businessModels,
    characteristics: icp.characteristics,
    exclusions: icp.exclusions,
    revenue_min: icp.revenueMin,
    revenue_max: icp.revenueMax,
    ebitda_min: icp.ebitdaMin,
    employees_min: icp.employeesMin,
    employees_max: icp.employeesMax,
    ownership: icp.ownership,
})

export const serializeCampaign = (
    campaign: IRawCampaign
): ICampaign => ({
    id: campaign?.id,
    name: campaign?.name,
    description: campaign?.description,
    status: campaign?.status,
    workflow: campaign?.workflow,
    gmailLabel: campaign?.gmail_label ?? "",
    icp: campaign?.icp ? serializeICP(campaign.icp) : undefined,
    companyCount: campaign?.company_count ?? 0,
    opportunityCount: campaign?.opportunity_count ?? 0,
    createdAt: new Date(campaign?.created_at),
    updatedAt: new Date(campaign?.updated_at),
})

export const serializeCampaignStats = (
    stats: IRawCampaignStats
): ICampaignStats => ({
    companies: stats?.companies ?? 0,
    highPriority: stats?.high_priority ?? 0,
    researched: stats?.researched ?? 0,
    shortlisted: stats?.shortlisted ?? 0,
    contacted: stats?.contacted ?? 0,
    inboundNew: stats?.inbound_new ?? 0,
})
