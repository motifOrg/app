"use server"

// #region imports
import {
    _DRAFTS_URL,
    _INBOUND_URL,
    _INTEGRATIONS_URL,
} from "@/constants"

import {
    _DELETE,
    _GET,
    _PATCH,
    _POST,
    IResponse,
} from "@/lib/api/utils"

import {
    DRAFT_STATUS,
    IDraft,
    IIntegrations,
    IOpportunity,
    IOpportunityCounts,
    IRawDraft,
    IRawIntegrations,
    IRawOpportunity,
    OPPORTUNITY_STATUS,
    PRIORITY,
    serializeDraft,
    serializeIntegrations,
    serializeOpportunity,
} from "@/lib/types"
// #endregion

export interface IOpportunityInput {
    campaign_id: string
    sender_name?: string
    sender_email: string
    subject: string
    body?: string
    company_name?: string
    company_domain?: string
}

export interface IDraftUpdate {
    recipient?: string
    subject?: string
    body?: string
    status?: DRAFT_STATUS
}

export const getOpportunities = async(
    query: { campaign_id: string, q?: string, status?: string, priority?: string }
): Promise<IResponse<{ opportunities: IOpportunity[], counts: IOpportunityCounts }>> => {
    const res = await _GET<IRawOpportunity[]>(_INBOUND_URL, query)

    if(res.success && res.data){
        return {
            success: true,
            data: {
                opportunities: res.data.map(serializeOpportunity),
                counts: {
                    all: res.counts?.all ?? 0,
                    new: res.counts?.new ?? 0,
                    reviewing: res.counts?.reviewing ?? 0,
                    qualified: res.counts?.qualified ?? 0,
                    declined: res.counts?.declined ?? 0,
                },
            }
        }
    }

    return { success: false, error: res.error }
}

export const getOpportunity = async(
    id: string
): Promise<IResponse<IOpportunity>> => {
    const res = await _GET<IRawOpportunity>(`${_INBOUND_URL}/${id}`)

    if(res.success && res.data){
        return {
            success: true,
            data: serializeOpportunity(res.data)
        }
    }

    return { success: false, error: res.error, status: res.status }
}

export const createOpportunity = async(
    input: IOpportunityInput
): Promise<IResponse<IOpportunity>> => {
    const res = await _POST<IRawOpportunity>(_INBOUND_URL, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeOpportunity(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const updateOpportunity = async(
    id: string,
    input: { status?: OPPORTUNITY_STATUS, priority?: PRIORITY }
): Promise<IResponse<IOpportunity>> => {
    const res = await _PATCH<IRawOpportunity>(`${_INBOUND_URL}/${id}`, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeOpportunity(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const evaluateOpportunity = async(
    id: string
): Promise<IResponse<IOpportunity>> => {
    const res = await _POST<IRawOpportunity>(`${_INBOUND_URL}/${id}/evaluate`)

    if(res.success && res.data){
        return {
            success: true,
            data: serializeOpportunity(res.data)
        }
    }

    return { success: false, error: res.error, status: res.status }
}

export const getDrafts = async(
    query: { company_id?: string, opportunity_id?: string }
): Promise<IResponse<IDraft[]>> => {
    const res = await _GET<IRawDraft[]>(_DRAFTS_URL, query)

    if(res.success && res.data){
        return {
            success: true,
            data: res.data.map(serializeDraft)
        }
    }

    return { success: false, error: res.error }
}

export const createDraft = async(
    input: { company_id?: string, opportunity_id?: string }
): Promise<IResponse<IDraft>> => {
    const res = await _POST<IRawDraft>(_DRAFTS_URL, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeDraft(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const updateDraft = async(
    id: string,
    input: IDraftUpdate
): Promise<IResponse<IDraft>> => {
    const res = await _PATCH<IRawDraft>(`${_DRAFTS_URL}/${id}`, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeDraft(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const deleteDraft = async(
    id: string
): Promise<IResponse<null>> => {
    const res = await _DELETE<null>(`${_DRAFTS_URL}/${id}`)
    return { success: res.success, error: res.error }
}

export const getIntegrations = async():
Promise<IResponse<IIntegrations>> => {
    const res = await _GET<IRawIntegrations>(_INTEGRATIONS_URL)

    if(res.success && res.data){
        return {
            success: true,
            data: serializeIntegrations(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const syncGmail = async(campaignId: string):
Promise<IResponse<null>> => {
    const res = await _POST<null>(`${_INTEGRATIONS_URL}/gmail/sync?campaign_id=${campaignId}`)
    return { success: res.success, error: res.error, status: res.status }
}
