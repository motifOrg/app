"use server"

// #region imports
import { refresh } from "next/cache"

import {
    ICompanyUpdate,
    updateCompany,
} from "@/lib/api"
// #endregion

export const updateCompanyAction = async (
    id: string,
    input: ICompanyUpdate
) => {
    const res = await updateCompany(id, input)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}