"use server"

// #region imports
import { refresh } from "next/cache"

import {
    exportCompanies,
    ICompanyQuery,
    ICompanyUpdate,
    updateCompany,
} from "@/lib/api"
// #endregion

export const exportCompaniesAction = async (
    query: Omit<ICompanyQuery, "page" | "limit">
) => {
    const res = await exportCompanies(query)
    return { success: res.success, error: res.error, data: res.data }
}

export const updateCompanyAction = async (
    id: string,
    input: ICompanyUpdate
) => {
    const res = await updateCompany(id, input)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}