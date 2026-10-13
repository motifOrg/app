"use server"

// #region imports
import { refresh } from "next/cache"

import {
    createDraft,
    deleteDraft,
    IDraftUpdate,
    updateDraft,
} from "@/lib/api"
// #endregion

export const createDraftAction = async (input: {
    company_id?: string
    opportunity_id?: string
}) => {
    const res = await createDraft(input)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}

export const updateDraftAction = async (id: string, input: IDraftUpdate) => {
    const res = await updateDraft(id, input)
    if (res.success) refresh()
    return { success: res.success, error: res.error, draft: res.data }
}

export const deleteDraftAction = async (id: string) => {
    const res = await deleteDraft(id)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}
