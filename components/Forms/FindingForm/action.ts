"use server"

// #region imports
import { refresh } from "next/cache"

import {
    createFinding,
    IFindingInput,
} from "@/lib/api"
// #endregion

export const findingAction = async (companyId: string, input: IFindingInput) => {
    const res = await createFinding(companyId, input)
    if (res.success) refresh()
    return { success: res.success, error: res.error }
}
