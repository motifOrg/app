"use server"

// #region imports
import { refresh } from "next/cache"

import { importCompanies } from "@/lib/api"
// #endregion

export const importAction = async (
	campaignId: string,
	formData: FormData,
) => {
	const file = formData.get("file")

	if (!(file instanceof File) || file.size === 0)
		return { success: false, error: "Choose a CSV file to import." }

	if (!file.name.toLowerCase().endsWith(".csv"))
		return { success: false, error: "Only .csv files can be imported." }

	const res = await importCompanies(campaignId, formData)

	if (res.success && res.data && res.data.inserted > 0)
		refresh()

	return res
}
