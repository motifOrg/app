"use server"

// #region imports
import {
    _CAMPAIGNS_URL,
    _DOCUMENTS_URL,
} from "@/constants"

import {
    _DELETE,
    _GET,
    _PATCH,
    _POST,
    _PUT,
    IResponse,
} from "@/lib/api/utils"

import {
    CAMPAIGN_STATUS,
    ICampaign,
    ICampaignStats,
    IDocument,
    IICP,
    IImportResult,
    IRawCampaign,
    IRawCampaignStats,
    IRawDocument,
    IRawICP,
    WORKFLOW,
    deserializeICP,
    serializeCampaign,
    serializeCampaignStats,
    serializeDocument,
    serializeICP,
} from "@/lib/types"
// #endregion

export interface ICampaignInput {
    name: string
    description: string
    workflow: WORKFLOW
    status?: CAMPAIGN_STATUS
    icp?: IICP
}

export const getCampaigns = async(
    query?: { q?: string, status?: string }
): Promise<IResponse<ICampaign[]>> => {
    const res = await _GET<IRawCampaign[]>(_CAMPAIGNS_URL, query)

    if(res.success && res.data){
        return {
            success: true,
            data: res.data.map(serializeCampaign)
        }
    }

    return { success: false, error: res.error }
}

export const getCampaign = async(
    id: string
): Promise<IResponse<ICampaign>> => {
    const res = await _GET<IRawCampaign>(`${_CAMPAIGNS_URL}/${id}`)

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCampaign(res.data)
        }
    }

    return { success: false, error: res.error, status: res.status }
}

export const getCampaignStats = async(
    id: string
): Promise<IResponse<ICampaignStats>> => {
    const res = await _GET<IRawCampaignStats>(`${_CAMPAIGNS_URL}/${id}/stats`)

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCampaignStats(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const createCampaign = async(
    input: ICampaignInput
): Promise<IResponse<ICampaign>> => {
    const res = await _POST<IRawCampaign>(_CAMPAIGNS_URL, {}, {
        body: JSON.stringify({
            name: input.name,
            description: input.description,
            workflow: input.workflow,
            status: input.status,
            icp: input.icp ? deserializeICP(input.icp) : undefined,
        })
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCampaign(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const updateCampaign = async(
    id: string,
    input: Partial<Omit<ICampaignInput, "icp">>
): Promise<IResponse<ICampaign>> => {
    const res = await _PATCH<IRawCampaign>(`${_CAMPAIGNS_URL}/${id}`, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCampaign(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const deleteCampaign = async(
    id: string
): Promise<IResponse<null>> => {
    const res = await _DELETE<null>(`${_CAMPAIGNS_URL}/${id}`)
    return { success: res.success, error: res.error }
}

export const updateICP = async(
    id: string,
    icp: IICP
): Promise<IResponse<IICP>> => {
    const res = await _PUT<IRawICP>(`${_CAMPAIGNS_URL}/${id}/icp`, {}, {
        body: JSON.stringify(deserializeICP(icp))
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeICP(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const getDocuments = async(
    id: string
): Promise<IResponse<IDocument[]>> => {
    const res = await _GET<IRawDocument[]>(`${_CAMPAIGNS_URL}/${id}/documents`)

    if(res.success && res.data){
        return {
            success: true,
            data: res.data.map(serializeDocument)
        }
    }

    return { success: false, error: res.error }
}

export const uploadDocument = async(
    id: string,
    form: FormData
): Promise<IResponse<IDocument>> => {
    const res = await _POST<IRawDocument>(`${_CAMPAIGNS_URL}/${id}/documents`, {}, {
        body: form
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeDocument(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const deleteDocument = async(
    id: string
): Promise<IResponse<null>> => {
    const res = await _DELETE<null>(`${_DOCUMENTS_URL}/${id}`)
    return { success: res.success, error: res.error }
}

export const importCompanies = async(
    id: string,
    form: FormData
): Promise<IResponse<IImportResult>> => {
    const res = await _POST<{
        rows_processed: number
        inserted: number
        skipped: number
        failed: number
        errors: { row: number, message: string }[] | null
    }>(`${_CAMPAIGNS_URL}/${id}/companies/import`, {}, {
        body: form
    })

    if(res.success && res.data){
        return {
            success: true,
            data: {
                rowsProcessed: res.data.rows_processed,
                inserted: res.data.inserted,
                skipped: res.data.skipped,
                failed: res.data.failed,
                errors: res.data.errors ?? [],
            }
        }
    }

    return { success: false, error: res.error }
}
