"use server"

// #region imports
import { refresh } from "next/cache"
import { redirect } from "next/navigation"

import {
    createCampaign,
    deleteCampaign,
    deleteDocument,
    ICampaignInput,
    updateCampaign,
    updateICP,
    uploadDocument,
} from "@/lib/api"

import { IICP } from "@/lib/types"
// #endregion

export const createCampaignAction = async (input: ICampaignInput) => {
    const res = await createCampaign(input)
    if (res.success) refresh()
    return { success: res.success, error: res.error, id: res.data?.id }
}

export const updateCampaignAction = async (
    id: string,
    input: Partial<Omit<ICampaignInput, "icp">>
) => {
    const res = await updateCampaign(id, input)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}

export const deleteCampaignAction = async (id: string) => {
    const res = await deleteCampaign(id)
    if (res.success) redirect("/campaigns")
    return { success: res.success, error: res.error }
}

export const updateICPAction = async (id: string, icp: IICP) => {
    const res = await updateICP(id, icp)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}

export const uploadDocumentAction = async (id: string, form: FormData) => {
    const res = await uploadDocument(id, form)
    return { success: res.success, error: res.error, document: res.data }
}

export const deleteDocumentAction = async (id: string) => {
    const res = await deleteDocument(id)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}

export const refreshAction = async () => refresh()
