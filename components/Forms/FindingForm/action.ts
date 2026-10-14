"use server"

// #region imports
import { revalidatePath, refresh } from "next/cache"

import {
    createFinding,
    IFindingInput,
} from "@/lib/api"
// #endregion

export const findingAction = async (companyId: string, input: IFindingInput) => {
    const res = await createFinding(companyId, input)
    if (res.success) {
        refresh()
        revalidatePath(`/companies/${companyId}`)
    }
    return { success: res.success, error: res.error }
}
