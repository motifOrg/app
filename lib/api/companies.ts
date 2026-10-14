"use server"

// #region imports
import { _COMPANIES_URL } from "@/constants"

import {
    _DELETE,
    _DOWNLOAD,
    _GET,
    _PATCH,
    _POST,
    IResponse,
} from "@/lib/api/utils"

import {
    CONFIDENCE,
    EVALUATION_STATUS,
    FINDING_KIND,
    ICompany,
    IFinding,
    IMessage,
    IRawCompany,
    IRawFinding,
    IRawMessage,
    PRIORITY,
    RESEARCH_STATUS,
    serializeCompany,
    serializeFinding,
    serializeMessage,
} from "@/lib/types"
// #endregion

export interface ICompanyQuery {
    campaign_id: string
    q?: string
    priority?: string
    research_status?: string
    evaluation_status?: string
    sort?: string
    page?: number
    limit?: number
}

export const exportCompanies = async(
    query: Omit<ICompanyQuery, "page" | "limit">
): Promise<IResponse<{ body: string, filename: string }>> =>
    _DOWNLOAD(`${_COMPANIES_URL}/export`, { ...query })

export interface ICompanyInput {
    campaign_id: string
    name: string
    domain?: string
    industry?: string
    location?: string
    description?: string
    employees?: number | null
    revenue_estimate?: string
    owner_name?: string
}

export interface ICompanyUpdate {
    priority?: PRIORITY
    research_status?: RESEARCH_STATUS
    evaluation_status?: EVALUATION_STATUS
}

export interface IFindingInput {
    kind: FINDING_KIND
    title: string
    content?: string
    source_url?: string
    confidence?: CONFIDENCE
}

export const getCompanies = async(
    query: ICompanyQuery
): Promise<IResponse<ICompany[]>> => {
    const res = await _GET<IRawCompany[]>(_COMPANIES_URL, { ...query })

    if(res.success && res.data){
        return {
            success: true,
            data: res.data.map(serializeCompany),
            total: res.total,
            page: res.page,
            count: res.count,
        }
    }

    return { success: false, error: res.error }
}

export const getCompany = async(
    id: string
): Promise<IResponse<ICompany>> => {
    const res = await _GET<IRawCompany>(`${_COMPANIES_URL}/${id}`)

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCompany(res.data)
        }
    }

    return { success: false, error: res.error, status: res.status }
}

export const createCompany = async(
    input: ICompanyInput
): Promise<IResponse<ICompany>> => {
    const res = await _POST<IRawCompany>(_COMPANIES_URL, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCompany(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const updateCompany = async(
    id: string,
    input: ICompanyUpdate
): Promise<IResponse<ICompany>> => {
    const res = await _PATCH<IRawCompany>(`${_COMPANIES_URL}/${id}`, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeCompany(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const deleteCompany = async(
    id: string
): Promise<IResponse<null>> => {
    const res = await _DELETE<null>(`${_COMPANIES_URL}/${id}`)
    return { success: res.success, error: res.error }
}

export const createFinding = async(
    id: string,
    input: IFindingInput
): Promise<IResponse<IFinding>> => {
    const res = await _POST<IRawFinding>(`${_COMPANIES_URL}/${id}/findings`, {}, {
        body: JSON.stringify(input)
    })

    if(res.success && res.data){
        return {
            success: true,
            data: serializeFinding(res.data)
        }
    }

    return { success: false, error: res.error }
}

export const deleteFinding = async(
    id: string,
    findingId: string
): Promise<IResponse<null>> => {
    const res = await _DELETE<null>(`${_COMPANIES_URL}/${id}/findings/${findingId}`)
    return { success: res.success, error: res.error }
}

export const runResearch = async(
    id: string
): Promise<IResponse<null>> => {
    const res = await _POST<null>(`${_COMPANIES_URL}/${id}/research`)
    return { success: res.success, error: res.error, status: res.status }
}

export const getMessages = async(
    id: string
): Promise<IResponse<IMessage[]>> => {
    const res = await _GET<IRawMessage[]>(`${_COMPANIES_URL}/${id}/messages`)

    if(res.success && res.data){
        return {
            success: true,
            data: res.data.map(serializeMessage)
        }
    }

    return { success: false, error: res.error }
}

export const sendMessage = async(
    id: string,
    body: string
): Promise<IResponse<IMessage[]>> => {
    const res = await _POST<IRawMessage[]>(`${_COMPANIES_URL}/${id}/messages`, {}, {
        body: JSON.stringify({ body })
    })

    if(res.success && res.data){
        return {
            success: true,
            data: res.data.map(serializeMessage)
        }
    }

    return { success: false, error: res.error }
}
