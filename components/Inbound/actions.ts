"use server"

// #region imports
import { refresh } from "next/cache"

import {
    IOpportunityInput,
    createOpportunity,
    syncGmail,
    updateOpportunity,
} from "@/lib/api"

import {
    OPPORTUNITY_STATUS,
    PRIORITY,
} from "@/lib/types"
// #endregion

export const updateOpportunityAction = async (
    id: string,
    input: { status?: OPPORTUNITY_STATUS, priority?: PRIORITY }
) => {
    const res = await updateOpportunity(id, input)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}

export const createOpportunityAction = async (input: IOpportunityInput) => {
    const res = await createOpportunity(input)
    if (res.success) refresh()
    return { success: res.success, error: res.error, id: res.data?.id }
}

export const syncGmailAction = async () => {
    const res = await syncGmail()
    if (res.success) refresh()
    return { success: res.success, error: res.error, status: res.status }
}
