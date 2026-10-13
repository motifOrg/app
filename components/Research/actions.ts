"use server"

// #region imports
import { refresh } from "next/cache"
import { redirect } from "next/navigation"

import {
    deleteCompany,
    deleteFinding,
    runResearch,
} from "@/lib/api"
// #endregion

export const deleteFindingAction = async (id: string, findingId: string) => {
    const res = await deleteFinding(id, findingId)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}

export const runResearchAction = async (id: string) => {
    const res = await runResearch(id)
    if (res.success) refresh()
    return { success: res.success, error: res.error, status: res.status }
}

export const deleteCompanyAction = async (id: string, campaignId: string) => {
    const res = await deleteCompany(id)
    if (res.success) redirect(`/?campaign=${campaignId}`)
    return { success: res.success, error: res.error }
}
